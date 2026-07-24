import Link from "next/link";
export function Logo({ compact = false }: { compact?: boolean }) {
  return <Link className="logo" href="/" aria-label="VisitRail home"><span className="logo-mark" aria-hidden="true"><i /><b /></span>{!compact && <span>VisitRail</span>}</Link>;
}
