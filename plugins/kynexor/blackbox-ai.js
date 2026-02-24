const axios = require("axios");

module.exports = [
  {
    command: ["blackbox"],
    alias: ["blackboxai", "askbb"],
    description: "Ask Blackbox AI a question",
    category: "Ai",
    filename: __filename,
    async execute(m, { text, reply }) {
      try {
        if (!text) return reply("❌ Please provide a query!\n\nExample: .blackbox hello");

        await reply("⏳ Asking Blackbox AI...");

        const url = `https://ab-blackboxai.abrahamdw882.workers.dev/?q=${encodeURIComponent(text)}`;
        const { data } = await axios.get(url, { timeout: 10000 });

        let response;

        if (typeof data === "string" && data.trim()) {
          response = data;
        } else if (data?.content && data.content.trim()) {
          response = data.content;
        } else {
          response = "⚠️ No valid response from Blackbox AI.";
        }

        await reply(response);
      } catch (e) {
        console.error("Blackbox command error:", e.message || e);
        await reply("❌ Error fetching response from Blackbox AI.");
      }
    },
  },
];