module.exports = [
  {
    command: ["url"],
    alias: ["tourl"],
    description: "Upload media to URL",
    category: "Converter",
    ban: true,
    gcban: true,
    execute: async (m, { ednut, reply, uploadImage }) => {
      try {
        let q = m.quoted || m;
        let mime = (q.msg || q).mimetype || "";

        if (!mime) return reply("No media found");

        let media = await q.download();
        let link = await uploadImage(media);

        reply(link);
      } catch (err) {
        global.log("ERROR", `url command failed: ${err.message || err}`);
        reply("Failed to upload media.");
      }
    }
  },

  {
    command: ["shorturl"],
    alias: ["shortlink", "shorten", "tinyurl"],
    description: "Shorten a URL",
    category: "Converter",
    ban: true,
    gcban: true,
    execute: async (m, { ednut, text, axios, reply }) => {
      try {
        if (!text) return reply("Enter a URL");
        if (!text.startsWith("https://")) return reply("Please input a valid link");

        let res = await axios.get("https://tinyurl.com/api-create.php?url=" + encodeURIComponent(text));
        reply(res.data.toString());
      } catch (err) {
        global.log("ERROR", `shorturl command failed: ${err.message || err}`);
        reply("Failed to shorten the link.");
      }
    }
  }
];