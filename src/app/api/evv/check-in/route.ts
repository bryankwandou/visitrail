import { NextResponse } from "next/server";
import { demoVisit } from "@/lib/demo-data";
import { distanceInMeters } from "@/lib/evv";
import type { Coordinates } from "@/lib/domain";
export async function POST(request: Request){ const body=await request.json() as {location?:Coordinates;source?:string}; if(body.source!=="device_gps"||!body.location) return NextResponse.json({ok:false,status:"flagged_unverified",reason:"Device GPS evidence is required."},{status:422}); const distance=Math.round(distanceInMeters(demoVisit.location,body.location)); return NextResponse.json({ok:distance<=150,status:distance<=150?"in_progress":"flagged_unverified",distanceMeters:distance,serverRecordedAt:new Date().toISOString()},{status:distance<=150?200:422}); }
