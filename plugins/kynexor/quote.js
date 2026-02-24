const axios = require("axios");

module.exports = [
  {
    command: ["quote"],
    description: "Get a random inspiring quote.",
    category: "Fun",
    filename: __filename,
    ban: true,
    gcban: true,
    execute: async (m, { ednut, reply }) => {
      try {
        const response = await axios.get("https://zenquotes.io/api/random");
        const { q: content, a: author } = response.data[0];

        const message = `💬 *"${content}"*\n- ${author}\n\n> *QUOTES BY lumina-xmd*`;

        await ednut.sendMessage(m.chat, { text: message }, { quoted: m });
      } catch (error) {
        console.error("Error fetching quote:", error);
        reply("⚠️ Couldn't fetch quote. Check your internet or logs.");
      }
    }
  }
];
