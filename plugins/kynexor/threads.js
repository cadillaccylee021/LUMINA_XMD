const axios = require("axios");

module.exports = {
  command: ["threads"],
  alias: ["th", "thread"],
  description: "Download Threads image or video",
  category: "Downloader",
  use: "<threads-link>",
  filename: __filename,

  async execute(m, { ednut, text, reply }) {
    try {
      if (!text) return reply("❌ Please provide a Threads link.");
      if (!text.includes("threads.com"))
        return reply("❌ Invalid Threads URL.");

      const api = `https://api.nekolabs.web.id/downloader/threads?url=${encodeURIComponent(text)}`;
      const { data } = await axios.get(api);

      if (!data.success) return reply("❌ Failed to fetch Threads media.");

      const res = data.result;
      const caption = global.footer; // ✅ fixed as requested

      /* ================= IMAGE ================= */
      if (res.type === 1 && res.images?.length) {
        const imageUrl = res.images[0][0]?.url_cdn;
        if (!imageUrl) return reply("❌ Image not found.");

        await ednut.sendMessage(
          m.chat,
          {
            image: { url: imageUrl },
            caption
          },
          { quoted: m }
        );
        return;
      }

      /* ================= VIDEO ================= */
      if (res.type === 2 && res.videos?.length) {
        const videoUrl = res.videos[0][0]?.url_cdn;
        if (!videoUrl) return reply("❌ Video not found.");

        await ednut.sendMessage(
          m.chat,
          {
            video: { url: videoUrl },
            caption
          },
          { quoted: m }
        );
        return;
      }

      return reply("❌ Unsupported Threads post type.");

    } catch (err) {
      console.error(err);
      reply("⚠️ Error while downloading Threads media.");
    }
  }
};