export async function onRequest({ request }) {
  const url = new URL(request.url);
  const target = url.searchParams.get("url");

  if (!target) {
    return new Response("Missing url parameter", { status: 400 });
  }

  const newHeaders = new Headers(request.headers);
  newHeaders.set("User-Agent", "Mozilla/5.0");
  newHeaders.set("Referer", target);
  newHeaders.set("Origin", new URL(target).origin);

  try {
    const res = await fetch(target, {
      method: request.method,
      headers: newHeaders,
    });

    const headers = new Headers(res.headers);
    headers.set("Access-Control-Allow-Origin", "*");
    headers.delete("content-encoding"); // penting, biar HLS bisa parse .ts chunk

    return new Response(res.body, {
      status: res.status,
      headers
    });
  } catch (err) {
    return new Response("Error fetching stream: " + err.toString(), { status: 500 });
  }
}
