// app/api/login/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers"; // ✅ must be from next/headers
import axios from "axios";

export async function POST(req: Request) {
  const body = await req.json();

  const response = await axios.post(
    process.env.NEXT_PUBLIC_BASE_URL + "Account/Login",
    body
  );

  const token = response.data.token;

  (await
        cookies()).set({
    name: "token",
    value: token,
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 24,
  });

  return NextResponse.json({ success: true });
}
