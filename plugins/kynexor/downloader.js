const axios = require("axios");
const cheerio = require("cheerio");

async function downloader(platform, text, { ednut, mek, from, reply }) {
  try {
    if (!text) {
      return reply(`❌ Please provide a link.\nExample:\n.${platform} <url>`);
    }

    const SITE_URL = "https://instatiktok.com/";
    const form = new URLSearchParams();
    form.append("url", text);
    form.append("platform", platform);
    form.append("siteurl", SITE_URL);

    const res = await axios.post(`${SITE_URL}api`, form.toString(), {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        "Origin": SITE_URL,
        "Referer": SITE_URL,
        "User-Agent": "Mozilla/5.0",
        "X-Requested-With": "XMLHttpRequest",
      },
    });

    const html = res?.data?.html;
    if (!html || res?.data?.status !== "success") {
      return reply("❌ Failed to fetch data from server.");
    }

    const $ = cheerio.load(html);
    const links = [];
    $('a.btn[href^="http"]').each((_, el) => {
      const link = $(el).attr("href");
      if (link && !links.includes(link)) links.push(link);
    });

    if (links.length === 0) return reply("❌ No media links found.");

    // Pick correct download
    let download;
    if (platform === "instagram") {
      download = links;
    } else if (platform === "tiktok") {
      download = links.find((l) => /hdplay/.test(l)) || links[0];
    } else if (platform === "facebook") {
      download = links.at(-1);
    }

    if (!download) return reply("❌ Could not retrieve download link.");

    const footer = `\n\n> *© ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴘᴀᴛʀᴏɴTᴇᴄʜＸ* 🚹`;

    if (Array.isArray(download)) {
      for (const media of download) {
        const buff = await axios
          .get(media, { responseType: "arraybuffer" })
          .then((r) => r.data);
        await ednut.sendMessage(
          from,
          { image: buff, caption: `📥 Instagram Downloader${footer}` },
          { quoted: mek }
        );
      }
    } else {
      const buff = await axios
        .get(download, { responseType: "arraybuffer" })
        .then((r) => r.data);
      const isVideo = download.includes(".mp4");
      const caption = `📥 *${platform.toUpperCase()} Download Successful!*${footer}`;
      await ednut.sendMessage(
        from,
        isVideo ? { video: buff, caption } : { image: buff, caption },
        { quoted: mek }
      );
    }
  } catch (e) {
    console.error(e);
    reply(`❌ An error occurred.\n\n${e.message || e}`);
  }
}

module.exports = [
  {
    command: ["facebook"],
    alias: ["fb", "fbvid", "fbvideo"],
    description: "Download Facebook videos",
    category: "Downloader",
    filename: __filename,
    async execute(m, { ednut, q, reply, from }) {
      await downloader("facebook", q, { ednut, mek: m, from, reply });
    },
  },
  {
    command: ["instagram2"],
    alias: ["ig2"],
    description: "Download Instagram photos/videos",
    category: "Downloader",
    filename: __filename,
    async execute(m, { ednut, q, reply, from }) {
      await downloader("instagram", q, { ednut, mek: m, from, reply });
    },
  },
  {
    command: ["tiktok2"],
    alias: ["tt2"],
    description: "Download TikTok videos",
    category: "Downloader",
    filename: __filename,
    async execute(m, { ednut, q, reply, from }) {
      await downloader("tiktok", q, { ednut, mek: m, from, reply });
    },
  },
];