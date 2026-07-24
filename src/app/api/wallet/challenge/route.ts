import { NextResponse } from "next/server";
import { createWalletChallenge } from "@/lib/wallet-verification";
export async function POST(request:Request){
  if(!process.env.WALLET_CHALLENGE_SECRET)return NextResponse.json({error:"Wallet verification is not configured"},{status:503});
  const body=await request.json() as {publicKey?:string};if(!body.publicKey)return NextResponse.json({error:"publicKey is required"},{status:400});
  try{return NextResponse.json(createWalletChallenge(body.publicKey,process.env.WALLET_CHALLENGE_SECRET,new URL(request.url).host))}catch{return NextResponse.json({error:"Invalid Solana public key"},{status:400})}
}
