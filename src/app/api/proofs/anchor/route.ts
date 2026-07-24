import bs58 from "bs58";
import { Connection, Keypair, PublicKey, Transaction, TransactionInstruction, sendAndConfirmTransaction } from "@solana/web3.js";
import { NextResponse } from "next/server";
import { verifyWalletSession } from "@/lib/wallet-verification";
const MEMO_PROGRAM=new PublicKey("MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr");
export async function POST(request:Request){
  if(!process.env.SOLANA_PRIVATE_KEY)return NextResponse.json({error:"Server devnet signer is not configured"},{status:503});
  if(!process.env.WALLET_CHALLENGE_SECRET)return NextResponse.json({error:"Wallet authorization is not configured"},{status:503});
  const body=await request.json() as {memoText?:string;walletSession?:string};
  if(!body.memoText||!/^VisitRail:v1:[a-f0-9]{64}$/.test(body.memoText))return NextResponse.json({error:"A valid VisitRail proof memo is required"},{status:400});
  if(!body.walletSession)return NextResponse.json({error:"Verified wallet session is required"},{status:401});
  const authorization=verifyWalletSession(body.walletSession,process.env.WALLET_CHALLENGE_SECRET);if(!authorization.verified)return NextResponse.json({error:authorization.reason},{status:401});
  try{const signer=Keypair.fromSecretKey(bs58.decode(process.env.SOLANA_PRIVATE_KEY));const connection=new Connection(process.env.SOLANA_RPC_URL??"https://api.devnet.solana.com","confirmed");const transaction=new Transaction().add(new TransactionInstruction({programId:MEMO_PROGRAM,keys:[],data:Buffer.from(body.memoText,"utf8")}));const signature=await sendAndConfirmTransaction(connection,transaction,[signer],{commitment:"confirmed"});const balance=await connection.getBalance(signer.publicKey,"confirmed");return NextResponse.json({ok:true,cluster:"devnet",signature,signer:signer.publicKey.toBase58(),requestedByWallet:authorization.publicKey,explorerUrl:`https://explorer.solana.com/tx/${signature}?cluster=devnet`,balanceLamports:balance,memo:body.memoText})}catch(error){return NextResponse.json({error:"Devnet anchor failed",detail:error instanceof Error?error.message:"Unknown error"},{status:502})}
}
