export async function triggerNextJsRevalidate(tag?: string) {
  try {
    const baseUrl = import.meta.env.VITE_SITE_USER_URL;
    const secret = import.meta.env.VITE_REVALIDATE_SECRET;

    if (!baseUrl || !secret) {
      console.warn("[Revalidate] Missing URL or Secret in environment variables");
      return;
    }

    // Ensure baseUrl ends with /
    const url = new URL(`api/revalidate?secret=${secret}${tag ? `&tag=${tag}` : ''}`, baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`);

    const response = await fetch(url.toString(), {
      method: "POST",
    });

    if (!response.ok) {
      console.error("[Revalidate] Failed to revalidate Next.js cache", await response.text());
    } else {
      console.log(`[Revalidate] Successfully revalidated ${tag ? `tag: ${tag}` : 'entire site'}`);
    }
  } catch (error) {
    console.error("[Revalidate] Error calling revalidate webhook", error);
  }
}
