import { Handlers } from "$fresh/server.ts";

const kv = await Deno.openKv();

export const handler: Handlers = {
  async GET(_req) {
    const data = await kv.get(["library_data"]);

    if (!data.value) {
      return new Response(
        JSON.stringify({ error: "データがまだ取得されていません" }),
        {
          status: 503,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    return new Response(JSON.stringify(data.value, null, 2), {
      headers: { "Content-Type": "application/json" },
    });
  },
};
