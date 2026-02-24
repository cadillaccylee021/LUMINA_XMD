const yts = require("youtube-yts");
const axios = require("axios");

module.exports = [
  // ============================
  // 🎵 YTA - YOUTUBE MP3 (Oota Izumi API)
  // ============================
  {
    command: ["yta"],
    alias: ["ytmp3", "ytaudio"],
    description: "Download YouTube audio (MP3)",
    category: "downloader",
    ban: true,
    gcban: true,

    async execute(conn, mek, m, { text, reply }) {
      try {
        if (!text)
          return reply("❌ Please provide a YouTube video link.");

        if (!text.includes("youtube.com") && !text.includes("youtu.be"))
          return reply("❌ Invalid YouTube link!");

        await reply("⏳ Fetching MP3...");

        // 🔥 Oota Izumi API (same as play command)
        const apiUrl = `https://api.ootaizumi.web.id/downloader/youtube?url=${encodeURIComponent(text)}&format=mp3`;

        const { data } = await axios.get(apiUrl, { timeout: 15000 });

        if (!data?.status || !data?.result?.download)
          return reply("❌ Failed to fetch audio.");

        const title = data.result.title || "YouTube Audio";
        const audioUrl = data.result.download;

        await conn.sendMessage(
          m.chat,
          {
            audio: { url: audioUrl },
            mimetype: "audio/mpeg",
            fileName: `${title}.mp3`,
          },
          { quoted: mek }
        );

      } catch (err) {
        console.error("yta error:", err.response?.data || err.message);
        reply("❌ An error occurred while downloading the audio.");
      }
    },
  },

  // ============================
  // 🎥 YTV - YOUTUBE MP4 (Prexzy API)
  // ============================
  {
    command: ["ytv"],
    alias: ["ytmp4", "ytvideo", "mp4"],
    description: "Download YouTube video as MP4",
    category: "downloader",
    ban: true,
    gcban: true,

    async execute(conn, mek, m, { text, reply }) {
      try {
        if (!text)
          return reply("❌ Please provide a YouTube video link.");

        if (!text.includes("youtube.com") && !text.includes("youtu.be"))
          return reply("❌ Invalid YouTube link!");

        await reply("⏳ Fetching MP4...");

        // 🔥 Prexzy API (same as video command)
        const apiUrl = `https://apis.prexzyvilla.site/download/ytdown?url=${encodeURIComponent(text)}`;

        const { data } = await axios.get(apiUrl, { timeout: 15000 });

        if (!data?.status || !data?.success || !data?.video?.downloadUrl)
          return reply("❌ Failed to fetch video.");

        const title = data.title || "YouTube Video";
        const downloadUrl = data.video.downloadUrl;

        await conn.sendMessage(
          m.chat,
          {
            video: { url: downloadUrl },
            mimetype: "video/mp4",
            caption: title,
          },
          { quoted: mek }
        );

      } catch (err) {
        console.error("ytv error:", err.response?.data || err.message);
        reply("❌ An error occurred while downloading the video.");
      }
    },
  },

  // ============================================
  // 🔍 SEARCH → DOWNLOAD MP4 USING YTMP4V2 API
  // ============================================
  {
    command: ["video"],
    alias: ["ytgrab"],
    description: "Download video from YouTube by name or link",
    category: "downloader",
    filename: __filename,
    use: "<name/link>",

    async execute(conn, mek, m, { text, reply }) {
      try {
        if (!text) {
          return reply("❌ Give me a video name or YouTube link!");
        }

        const start = Date.now();

        await conn.sendMessage(m.chat, {
          react: { text: "🎬", key: mek.key },
        });

        let videoUrl = text;

        // 🔎 If NOT a YouTube link → search
        if (!text.includes("youtube.com") && !text.includes("youtu.be")) {

          await reply("🔎 Searching YouTube...");

          const search = await yts(text);
          if (!search.videos.length)
            return reply("❌ No results found.");

          videoUrl = search.videos[0].url;
        }

        // 🔥 Call Prexzy API
        const apiUrl = `https://apis.prexzyvilla.site/download/ytdown?url=${encodeURIComponent(
          videoUrl
        )}`;

        const { data } = await axios.get(apiUrl);

        if (!data?.status || !data?.success || !data?.video) {
          return reply("❌ Failed to fetch video.");
        }

        const title = data.title || "YouTube Video";
        const videoDownloadUrl = data.video.downloadUrl;
        const quality = data.video.quality;
        const size = data.video.fileSize;
        const duration = data.video.duration;

        if (!videoDownloadUrl)
          return reply("❌ Video download link missing.");

        const speed = Date.now() - start;

        await reply(
          `🎬 *YouTube Video Downloader*\n\n` +
          `📌 *Title:* ${title}\n` +
          `🎞️ *Quality:* ${quality}\n` +
          `⏱️ *Duration:* ${duration}\n` +
          `📦 *Size:* ${size}\n` +
          `⚡ *Response:* ${speed} ms\n\n` +
          `⬇️ Sending video...`
        );

        await conn.sendMessage(
          m.chat,
          {
            video: { url: videoDownloadUrl },
            mimetype: "video/mp4",
            caption: title,
          },
          { quoted: mek }
        );

      } catch (err) {
        console.error(
          "Video command error:",
          err.response?.data || err.message
        );
        reply("❌ Error while processing your request.");
      }
    },
  },
];