import Groq from "groq-sdk";
import { NextResponse } from "next/server";
import { z } from "zod";
import { executeAgentPlan, type AgentIntent, type AgentPlan } from "@/lib/agent-tools";
const intents=["verify_visit","draft_note","match_caregiver","prepare_proof","operations_summary"] as const;
const PlanSchema=z.object({intent:z.enum(intents),scenario:z.enum(["valid","flagged"]).optional(),explanation:z.string().min(4).max(300)});
const system=`You are VisitRail's care operations routing agent. Choose exactly one safe deterministic tool. Never authorize billing, finalize notes, assign caregivers, or sign blockchain transactions. Return JSON only with intent, optional scenario, and a short explanation. Intents: verify_visit, draft_note, match_caregiver, prepare_proof, operations_summary. Use scenario flagged when the user asks to test weak, invalid, manual, distant, short, suspicious, or failed evidence; otherwise valid.`;
function safePlan(raw:string,prompt:string):AgentPlan{
  try{const candidate=JSON.parse(raw) as Record<string,unknown>;const parsed=PlanSchema.safeParse(candidate);if(parsed.success)return parsed.data;const intent=intents.includes(candidate.intent as AgentIntent)?candidate.intent as AgentIntent:inferIntent(prompt);return {intent,scenario:intent==="verify_visit"?inferScenario(prompt):undefined,explanation:typeof candidate.explanation==="string"?candidate.explanation.slice(0,300):"The model selected the safest matching VisitRail operation."}}catch{return {intent:inferIntent(prompt),scenario:inferIntent(prompt)==="verify_visit"?inferScenario(prompt):undefined,explanation:"The model response was normalized into the safest matching VisitRail operation."}}
}
function inferIntent(prompt:string):AgentIntent{const value=prompt.toLowerCase();if(/note|documentation|draft/.test(value))return"draft_note";if(/match|caregiver|staff/.test(value))return"match_caregiver";if(/proof|hash|anchor|solana|devnet/.test(value))return"prepare_proof";if(/verify|gps|visit|billing|evidence/.test(value))return"verify_visit";return"operations_summary"}
function inferScenario(prompt:string){return /weak|invalid|manual|distant|short|suspicious|failed|block/.test(prompt.toLowerCase())?"flagged" as const:"valid" as const}
export async function POST(request:Request){
  const body=await request.json() as {prompt?:string};const prompt=body.prompt?.trim();
  if(!prompt)return NextResponse.json({error:"prompt is required"},{status:400});
  if(!process.env.GROQ_API_KEY)return NextResponse.json({error:"GROQ_API_KEY is not configured"},{status:503});
  const client=new Groq({apiKey:process.env.GROQ_API_KEY});const models=[process.env.GROQ_AGENT_MODEL??"openai/gpt-oss-120b","llama-3.3-70b-versatile"];
  let lastError="Unknown model error";
  for(const model of models){try{const completion=await client.chat.completions.create({model,temperature:0.1,response_format:{type:"json_object"},messages:[{role:"system",content:system},{role:"user",content:prompt.slice(0,1200)}]});const plan=safePlan(completion.choices[0]?.message?.content??"{}",prompt);return NextResponse.json({ok:true,model:completion.model,plan,result:executeAgentPlan(plan),guardrails:["AI selects a tool but cannot change deterministic results.","Billing, note finalization, staffing assignment, and signing remain outside model authority."]})}catch(error){lastError=error instanceof Error?error.message:"Unknown model error"}}
  return NextResponse.json({error:"Agent execution failed",detail:lastError},{status:502});
}
