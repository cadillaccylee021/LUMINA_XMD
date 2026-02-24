const cheerio = require("cheerio");
const fetch = require("node-fetch");

async function xnxxSearch(query) {
  try {
    const base = "https://www.xnxx.com";
    const res = await fetch(`${base}/search/${encodeURIComponent(query)}/${Math.floor(1 + Math.random() * 3)}`);
    const html = await res.text();
    const $ = cheerio.load(html);
    const results = [];

    $("div.mozaique").each(function () {
      $(this).find("div.thumb-under").each(function () {
        const title = $(this).find("a").attr("title");
        const link = base + $(this).find("a").attr("href");
        if (title && link) results.push({ title, link });
      });
    });

    return {
      status: true,
      result: results.slice(0, 10)
    };
  } catch (err) {
    return { status: false, error: err.message };
  }
}

module.exports = [
  {
    command: ["xnxxdl"],
    alias: ["xnxxdownload"],
    description: "🔞 Download XNXX Video",
    category: "Nsfw",
    gcban: true,
    ban: true,
    async execute(m, { ednut, args, reply }) {
      const text = args.join(" ");
      if (!text || !text.includes("xnxx.com")) {
        return reply("❌ Please send a valid XNXX link.\n\nExample:\nxnxxdl https://www.xnxx.com/video-...");
      }

      try {
        const res = await fetch(`https://api.yogik.id/downloader/xnxx?url=${encodeURIComponent(text)}`);
        const json = await res.json();

        if (!json.status || !json.result) {
          return reply("❌ Failed to fetch video. Please try again.");
        }

        const vid = json.result;
        const caption = `🔞 *${vid.title}*\n\n📺 Duration: ${vid.duration}s\n🔗 URL: ${vid.URL}\n\n${vid.info.trim()}`;

        // Send thumbnail first
        const thumbMsg = await ednut.sendMessage(m.chat, {
          image: { url: vid.image },
          caption,
        }, { quoted: m });

        // Then send video quoting thumbnail
        await ednut.sendMessage(m.chat, {
          video: { url: vid.files.high },
          caption: `${global.footer || "🎥 XNXX Video File"}`,
        }, { quoted: thumbMsg });

      } catch (err) {
        global.log("ERROR", `XNXX download failed: ${err.message || err}`);
        reply("❌ Failed to fetch or send video.");
      }
    }
  },
  {
    command: ["xns"],
    alias: ["xnxxsearch"],
    description: "🔍 Search videos on XNXX",
    category: "Nsfw",
    gcban: true,
    ban: true,
    async execute(m, { ednut, args, reply }) {
      const text = args.join(" ");
      if (!text) return reply("❌ Please provide a search query.\nExample: xnxxsearch lisa");

      const res = await xnxxSearch(text);
      if (!res.status || !res.result.length) {
        global.log("ERROR", `XNXX search failed: ${res.error}`);
        return reply("❌ No results found.");
      }

      let txt = `🔞 *XNXX Search Results:*\n\n`;
      for (let i = 0; i < res.result.length; i++) {
        const { title, link } = res.result[i];
        txt += `*${i + 1}.* ${title}\n${link}\n\n`;
      }

      await ednut.sendMessage(m.chat, { text: txt.trim() }, { quoted: m });
    },
  },
];