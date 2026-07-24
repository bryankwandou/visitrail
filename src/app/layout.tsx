import type { Metadata } from "next";
import { DM_Sans, Manrope } from "next/font/google";
import "./globals.css";
const bodyFont = DM_Sans({ variable: "--font-body", subsets: ["latin"] });
const displayFont = Manrope({ variable: "--font-display", subsets: ["latin"] });
export const metadata: Metadata = { title: { default: "VisitRail — Care delivery you can prove", template: "%s · VisitRail" }, description: "Agency-grade electronic visit verification, grounded care notes, continuity matching, and family visibility." };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en"><body className={`${bodyFont.variable} ${displayFont.variable}`}>{children}</body></html>; }
