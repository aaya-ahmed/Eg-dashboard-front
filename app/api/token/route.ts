import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
const token= (await cookies()).get("token");
  return NextResponse.json({ token: token });
}
