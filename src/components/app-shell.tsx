import Link from "next/link";
import { Logo } from "./logo";
const links = [["/app","Command center"],["/agent","AI agent"],["/proofs","Devnet proof"],["/visits","Visits"],["/notes","Care notes"],["/matching","Matching"],["/reviews","Review queue"],["/family","Family portal"]];
export function AppShell({ children, active = "/app" }: { children: React.ReactNode; active?: string }) {
  return <div className="app-frame"><aside className="sidebar"><Logo /><div className="agency-switch"><span className="avatar">HC</span><span><strong>Harbor Care</strong><small>Austin operations</small></span></div><nav>{links.map(([href,label]) => <Link key={href} className={active===href?"active":""} href={href}><span className="nav-dot" />{label}</Link>)}</nav><div className="sidebar-foot"><div className="signal"><span /> Solana devnet ready</div><p>Proof anchoring is additive. Care delivery controls stay deterministic.</p></div></aside><main className="workspace">{children}</main></div>;
}
export function PageHeader({ eyebrow, title, description, action }: { eyebrow: string; title: string; description: string; action?: React.ReactNode }) {
  return <header className="page-header"><div><p className="eyebrow">{eyebrow}</p><h1>{title}</h1><p>{description}</p></div>{action}</header>;
}
