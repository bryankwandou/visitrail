import { NextResponse } from "next/server";
import { prepareEvidenceProof } from "@/lib/proof";
export async function POST(request: Request){ const body=await request.json() as {visitRecordId?:string;finalizedAt?:string;evidenceDigest?:Record<string,unknown>}; if(!body.visitRecordId||!body.finalizedAt||!body.evidenceDigest) return NextResponse.json({error:"visitRecordId, finalizedAt, and evidenceDigest are required"},{status:400}); return NextResponse.json(prepareEvidenceProof({visitRecordId:body.visitRecordId,finalizedAt:body.finalizedAt,evidenceDigest:body.evidenceDigest})); }
