import { NextRequest, NextResponse } from "next/server";
import { revalidateTag, revalidatePath } from "next/cache";

export async function POST(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get("secret");
  const tag = request.nextUrl.searchParams.get("tag");

  if (secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ message: "Invalid secret" }, { status: 401 });
  }

  if (tag) {
    revalidateTag(tag);
    return NextResponse.json({ revalidated: true, type: "tag", tag, now: Date.now() });
  } else {
    revalidatePath("/", "layout");
    return NextResponse.json({ revalidated: true, type: "path", path: "/", now: Date.now() });
  }
}
