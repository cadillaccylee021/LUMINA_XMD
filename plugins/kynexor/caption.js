module.exports = [
  {
    command: ["caption"],
    alias: ["cap"],
    description: "Change caption of an image or video",
    category: "Tool",
    filename: __filename,

    async execute(m, { ednut, text, reply }) {
      try {
        if (!m.quoted)
          return reply("❌ Reply to an image or video.");

        if (!text)
          return reply("❌ Please provide a caption.");

        const q = m.quoted;
        const mime = q.mimetype || "";

        if (!/image|video/.test(mime))
          return reply("❌ Only images or videos are supported.");

        // 📥 DOWNLOAD ORIGINAL MEDIA (NO RE-ENCODE)
        const media = await q.download();

        // 🖼️ IMAGE
        if (mime.startsWith("image")) {
          await ednut.sendMessage(
            m.chat,
            {
              image: media,
              caption: text,
            },
            { quoted: m }
          );
        }

        // 🎥 VIDEO
        else if (mime.startsWith("video")) {
          await ednut.sendMessage(
            m.chat,
            {
              video: media,
              caption: text,
            },
            { quoted: m }
          );
        }

      } catch (err) {
        reply("❌ Error: " + err.message);
      }
    },
  },
  {
  command: ["tostatus"],
  alias: ["poststatus", "story"],
  description: "Post quoted image or video to status",
  category: "Owner",
  filename: __filename,

  async execute(m, { ednut, text, isOwner, reply }) {
    try {
      // 🔒 OWNER CHECK (your exact style)
      if (!isOwner) {
        return reply("📛 This command is restricted to owners only.");
      }

      // ❗ Must quote media
      if (!m.quoted) {
        return reply("❌ Reply to an image or video.");
      }

      const mime = m.quoted.mimetype || "";
      if (!mime.startsWith("image/") && !mime.startsWith("video/")) {
        return reply("❌ Only images or videos are allowed.");
      }

      // 📥 Download media
      const media = await m.quoted.download();
      if (!media) {
        return reply("❌ Failed to download media.");
      }

      // 📝 Caption priority:
      // 1. Command text
      // 2. Quoted caption
      // 3. Quoted text
      const caption =
        text ||
        m.quoted.caption ||
        m.quoted.text ||
        "";

      // ✅ Uses WhatsApp DEFAULT status privacy
      await ednut.sendMessage(
        "status@broadcast",
        {
          [mime.startsWith("image/") ? "image" : "video"]: media,
          caption
        }
      );

      reply("*✅ Status posted successfully.*\nNot working yet");
    } catch (err) {
      console.error(err);
      reply("❌ Error posting status.");
    }
  }
}
];