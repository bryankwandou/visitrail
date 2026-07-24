import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import bs58 from "bs58";
import nacl from "tweetnacl";
import { PublicKey } from "@solana/web3.js";
type ChallengePayload={publicKey:string;origin:string;nonce:string;issuedAt:string;expiresAt:string};
const encode=(value:string)=>Buffer.from(value,"utf8").toString("base64url");
const decode=(value:string)=>Buffer.from(value,"base64url").toString("utf8");
function sign(payload:string,secret:string){return createHmac("sha256",secret).update(payload).digest("base64url")}
function messageFor(payload:ChallengePayload){return [`VisitRail wallet verification`,`Domain: ${payload.origin}`,`Wallet: ${payload.publicKey}`,`Nonce: ${payload.nonce}`,`Issued At: ${payload.issuedAt}`,`Expiration Time: ${payload.expiresAt}`,`Purpose: Verify wallet ownership for a VisitRail devnet proof.`].join("\n")}
export function createWalletChallenge(publicKey:string,secret:string,origin="visitrail.vercel.app",now=Date.now()){
  const normalized=new PublicKey(publicKey).toBase58();
  const payload:ChallengePayload={publicKey:normalized,origin,nonce:randomBytes(16).toString("hex"),issuedAt:new Date(now).toISOString(),expiresAt:new Date(now+5*60_000).toISOString()};
  const encoded=encode(JSON.stringify(payload));
  return {message:messageFor(payload),challenge:`${encoded}.${sign(encoded,secret)}`,expiresAt:payload.expiresAt};
}
export function verifyWalletChallenge(input:{publicKey:string;message:string;challenge:string;signature:string},secret:string,now=Date.now()){
  try{
    const [encoded,providedMac]=input.challenge.split(".");if(!encoded||!providedMac)return{verified:false,reason:"Malformed challenge"};
    const expectedMac=sign(encoded,secret);const provided=Buffer.from(providedMac);const expected=Buffer.from(expectedMac);if(provided.length!==expected.length||!timingSafeEqual(provided,expected))return{verified:false,reason:"Invalid challenge signature"};
    const payload=JSON.parse(decode(encoded)) as ChallengePayload;const normalized=new PublicKey(input.publicKey).toBase58();
    if(payload.publicKey!==normalized)return{verified:false,reason:"Wallet does not match challenge"};
    if(Date.parse(payload.expiresAt)<now)return{verified:false,reason:"Challenge expired"};
    if(input.message!==messageFor(payload))return{verified:false,reason:"Signed message was modified"};
    const verified=nacl.sign.detached.verify(new TextEncoder().encode(input.message),bs58.decode(input.signature),new PublicKey(normalized).toBytes());
    return verified?{verified:true,publicKey:normalized,verifiedAt:new Date(now).toISOString()}:{verified:false,reason:"Signature does not match wallet"};
  }catch{return{verified:false,reason:"Wallet verification payload is invalid"}}
}
