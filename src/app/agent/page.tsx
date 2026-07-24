import { AppShell, PageHeader } from "@/components/app-shell";
import { AgentConsole } from "@/components/agent-console";
export const metadata={title:"AI Operations Agent"};
export default function AgentPage(){return <AppShell active="/agent"><PageHeader eyebrow="Groq-powered, tool constrained" title="AI operations agent" description="Use natural language to route work into deterministic VisitRail controls. The model can propose and explain, never authorize."/><AgentConsole/></AppShell>}
