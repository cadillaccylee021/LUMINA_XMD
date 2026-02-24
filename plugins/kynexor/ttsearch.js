const fetch = require("node-fetch");

module.exports = [
  {
    command: ["ttsearch"],
    alias: ["tiktoksearch"],
    description: "Search and download TikTok video",
    category: "Downloader",
    use: "<query or TikTok link>",
    filename: __filename,
    ban: true,
    gcban: true,

    execute: async (m, { ednut, q, reply }) => {
      if (!q) {
        return reply(
          "❌ Please provide a keyword or TikTok link.\nExample: .ttsearch funny cat"
        );
      }

      try {
        // 🔍 NEW API
        const api = `https://api.deline.web.id/search/tiktok?query=${encodeURIComponent(q)}`;
        const res = await fetch(api);
        const json = await res.json();

        // ✅ VALIDATE RESPONSE
        if (!json?.status || !json?.result?.play) {
          return reply("⚠️ No TikTok video found.");
        }

        const v = json.result;

        const caption = `
🎬 *${v.title || "No Title"}*
👤 Author: ${v.nickname} (@${v.author})
🎵 Music: ${v.music_info?.title || "Unknown"}
🔗 https://www.tiktok.com/@${v.author}/video/${v.video_id}

© ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴘᴀᴛʀᴏɴTᴇᴄʜＸ
        `.trim();

        // 📤 SEND VIDEO (NO WM)
        await ednut.sendMessage(
          m.chat,
          {
            video: { url: v.play }, // ✅ JUST THE PLAY JSON
            mimetype: "video/mp4",
            caption
          },
          { quoted: m }
        );

      } catch (err) {
        console.error("TikTok error:", err.response?.data || err.message);
        reply("❌ Failed to fetch TikTok video. Try again later.");
      }
    }
  }
];