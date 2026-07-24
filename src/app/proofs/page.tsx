import { AppShell, PageHeader } from "@/components/app-shell";
import { WalletProofLab } from "@/components/wallet-proof-lab";
export const metadata={title:"Devnet Proof Lab"};
export default function ProofsPage(){return <AppShell active="/proofs"><PageHeader eyebrow="Solana devnet" title="Evidence proof lab" description="Connect a browser wallet, create a privacy-safe record hash, and confirm a real Memo transaction on devnet."/><WalletProofLab/></AppShell>}
