import { NextResponse } from "next/server";
import { demoCaregivers } from "@/lib/demo-data";
import { rankCaregivers } from "@/lib/matching";
import type { ClientNeeds } from "@/lib/domain";
export async function POST(request: Request){ const needs=await request.json() as ClientNeeds; return NextResponse.json({matches:rankCaregivers(demoCaregivers,needs)}); }
