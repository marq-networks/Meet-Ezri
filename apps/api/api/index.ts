import app from "../src/app";

export default async function handler(req: any, res: any) {
  const url = (req.url || "").split("?")[0];

  // stop Vercel auto-hits from hanging your function
  if (url === "/" ) {
    res.statusCode = 200;
    res.setHeader("content-type", "text/plain");
    res.end("OK");
    return;
  }

  if (url === "/favicon.ico" || url === "/favicon.png") {
    res.statusCode = 204;
    res.end();
    return;
  }

  if (url === "/health") {
    res.statusCode = 200;
    res.setHeader("content-type", "application/json");
    res.end(JSON.stringify({ ok: true }));
    return;
  }

  await app.ready();
  app.server.emit("request", req, res);
}
