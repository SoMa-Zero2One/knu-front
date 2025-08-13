import { cookies } from "next/headers";

export async function POST() {
  const cookieStore = await cookies();
  
  // 쿠키 삭제
  cookieStore.delete('access_token');
  
  return new Response(null, { status: 204 });
}