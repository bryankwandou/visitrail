import { AppShell, PageHeader } from "@/components/app-shell";
import { OperationsWorkspace } from "@/components/operations-workspace";
export const metadata = { title: "Command Center" };
export default function AppPage(){ return <AppShell active="/app"><PageHeader eyebrow="Friday, July 24" title="Good morning, Elena." description="The day is covered. Three exceptions need a human decision." action={<button className="button primary">Schedule a visit</button>}/><OperationsWorkspace/></AppShell>; }
