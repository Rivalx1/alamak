export async function onRequest({ request }) {
  const url = new URL(request.url);
  const target = url.searchParams.get("url");

  if (!target) {
    return new Response("Missing url parameter", { status: 400 });
  }

  try {
    const res = await fetch(target, {
      headers: {
        "User-Agent": "Mozilla/5.0"
      }
    });

    const headers = new Headers(res.headers);
    headers.set("Access-Control-Allow-Origin", "*");

    return new Response(res.body, {
      status: res.status,
      headers
    });
  } catch (err) {
    return new Response("Error fetching stream: " + err.toString(), { status: 500 });
  }
}
