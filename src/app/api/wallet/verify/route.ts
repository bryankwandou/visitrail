import { NextResponse } from "next/server";
import { verifyWalletChallenge } from "@/lib/wallet-verification";
export async function POST(request:Request){
  if(!process.env.WALLET_CHALLENGE_SECRET)return NextResponse.json({error:"Wallet verification is not configured"},{status:503});
  const body=await request.json() as {publicKey?:string;message?:string;challenge?:string;signature?:string};
  if(!body.publicKey||!body.message||!body.challenge||!body.signature)return NextResponse.json({error:"publicKey, message, challenge, and signature are required"},{status:400});
  const result=verifyWalletChallenge({publicKey:body.publicKey,message:body.message,challenge:body.challenge,signature:body.signature},process.env.WALLET_CHALLENGE_SECRET);
  return NextResponse.json(result,{status:result.verified?200:401});
}
