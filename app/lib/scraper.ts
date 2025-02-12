import cheerio from "https://esm.sh/cheerio@1.0.0-rc.12";

const kv = await Deno.openKv();

// 📌 英語 → 日本語の変換マップ
const libraryMap: Record<string, string> = {
  matsumoto: "松本",
  education: "教育",
  medicine: "医学",
  engineering: "工学",
  agriculture: "農学",
  textiles: "繊維",
};

const BASE_URL = "https://www.shinshu-u.ac.jp/institution/library/";
const libraries = Object.keys(libraryMap);

// 📌 定期スクレイピング (21:55 JST = 12:55 UTC)
Deno.cron("update library data", "23 13 * * *", async () => {
  console.log("📌 21:55 JST にスクレイピングを開始！");

  const results: Record<string, string> = {};

  for (const library of libraries) {
    const url = BASE_URL + library;
    console.log(`Fetching: ${url}`);

    const res = await fetch(url);
    const html = await res.text();
    const $ = cheerio.load(html);

    // 📌 最初の <dd> 要素のみ取得
    const firstDd = $("dd").first().text().trim();

    results[libraryMap[library]] = firstDd;
  }

  // 📌 Deno KV に保存
  await kv.set(["library_data"], results);
  console.log("✅ データを Deno KV に保存しました！");
});
