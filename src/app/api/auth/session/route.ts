import { cookies } from "next/headers";

export async function POST(req: Request) {
  const { token, maxAge } = await req.json(); // 클라가 보낸 JWT
  // (선택) 여기서 토큰 검증/디코딩
  cookies().set({
    name: "access_token",
    value: token,
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: maxAge ?? 60 * 60, // 1h
  });
  return new Response(null, { status: 204 });
}