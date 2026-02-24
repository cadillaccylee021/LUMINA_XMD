const axios = require("axios");

module.exports = [
 {
  command: ["spotify"],
  alias: ["spot", "spplay", "sportify"],
  description: "Download and play a song from Spotify",
  category: "Downloader",
  filename: __filename,
  async execute(m, { ednut, text, reply }) {
    try {
      if (!text) return reply("❌ Please provide a Spotify song name to search.");

      await reply(`⏳ Searching on Spotify...\n🎵 Query: *${text}*`);

      // 🔎 Search Spotify via ZenzzXD API
      const searchUrl = `https://api.zenzxz.my.id/api/search/spotify?query=${encodeURIComponent(text)}`;
      const { data: searchRes } = await axios.get(searchUrl);

      if (!searchRes?.success || !searchRes.data?.length) {
        return reply("❌ No results found on Spotify.");
      }

      const song = searchRes.data[0]; // Take first result
      const trackUrl = song.url;

      await reply(`📥 Found: *${song.title}* by *${song.artist}*\n▶️ Downloading...`);

      // 🌐 Download via Nekolabs / FabDL API
      const dlUrl = `https://api.nekolabs.web.id/downloader/spotify/v1?url=${encodeURIComponent(trackUrl)}`;
      const { data: dlRes } = await axios.get(dlUrl);

      if (!dlRes?.success || !dlRes.result?.downloadUrl) {
        return reply("❌ Failed to download the song.");
      }

      const audioUrl = dlRes.result.downloadUrl;

      // 🎶 Send audio file
      await ednut.sendMessage(
        m.chat,
        {
          audio: { url: audioUrl },
          mimetype: "audio/mpeg",
          fileName: `${dlRes.result.title} - ${dlRes.result.artist}.mp3`,
          ptt: false
        },
        { quoted: m }
      );

    } catch (err) {
      await reply(`⚠️ Error: ${err.message || err}`);
    }
  }
},
  {
    command: ["capcut"],
    description: "🎬 Download Capcut video by URL",
    category: "Downloader",
    ban: false,
    gcban: false,
    async execute(m, { ednut, text, reply }) {
      try {
        if (!text || !/^https?:\/\/.*capcut\.com/.test(text))
          return reply("❌ Please provide a valid Capcut template URL.");

        const res = await fetch(`https://api.yogik.id/downloader/capcut?url=${encodeURIComponent(text)}`);
        const json = await res.json();

        if (!json.status || !json.result?.videoUrl)
          return reply("❌ Failed to fetch Capcut video.");

        await ednut.sendMessage(m.chat, {
          video: { url: json.result.videoUrl },
          caption: global.footer,
        }, { quoted: m });

      } catch (err) {
        global.log("ERROR", `Capcut plugin failed: ${err.message || err}`);
        reply("❌ Error occurred while processing the Capcut link.");
      }
    }
  },
 {
    command: ["twitter"],
    alias: ["x"],
    description: "📹 Download Twitter/X video",
    category: "Downloader",
    ban: false,
    gcban: false,
    async execute(m, { ednut, text, fetch, reply }) {
      if (!text || (!text.includes("twitter.com") && !text.includes("x.com"))) {
        return reply("❌ Please send a valid Twitter/X link.");
      }

      try {
        const res = await fetch(`https://archive.lick.eu.org/api/download/twitterx?url=${encodeURIComponent(text)}`);
        const json = await res.json();

        if (!json.status || !json.result?.downloads?.length) {
          return reply("❌ Failed to fetch Twitter video.");
        }

        const video = json.result.downloads.find(v => v.quality.includes("MP4")) || json.result.downloads[0];

        if (!video.url) return reply("❌ No valid video found.");

        await ednut.sendMessage(m.chat, {
          video: { url: video.url },
          caption: global.footer
        }, { quoted: m });

      } catch (err) {
        global.log("ERROR", `Twitter plugin failed: ${err.message || err}`);
        reply("❌ An error occurred while processing the Twitter link.");
      }
    }
  }
];