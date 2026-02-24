module.exports = [
  {
  command: ["groq"],
  description: "Ask Groq Compound Beta Mini AI",
  category: "Ai",
  ban: true,
  gcban: true,
  execute: async (m, { ednut, axios, reply }) => {
    try {
      const query = m.text.split(" ").slice(1).join(" ");
      if (!query) return reply("📝 Please provide a query for Groq AI.");
      
      const url = `https://archive.lick.eu.org/api/ai/groq-compound-beta-mini?text=${encodeURIComponent(query)}`;
      const res = await axios.get(url);
      
      const text = res.data?.result?.trim();
      if (!text) return reply("⚠️ Unexpected response from Groq AI.");
      
      await ednut.sendMessage(m.chat, { text }, { quoted: m });
    } catch (err) {
      global.log("ERROR", `groq failed: ${err.message || err}`);
      reply("❌ Failed to contact Groq AI.");
    }
  }
},
{
  command: ["deepseek"],
  description: "Ask Deepseek R1 AI",
  category: "Ai",
  ban: true,
  gcban: true,
  execute: async (m, { ednut, axios, reply }) => {
    try {
      const query = m.text.split(" ").slice(1).join(" ");
      if (!query) return reply("📝 Please provide a query for Deepseek R1.");
      
      const url = `https://archive.lick.eu.org/api/ai/groq-deepseek-r1-distill-llama-70b?text=${encodeURIComponent(query)}`;
      const res = await axios.get(url);
      
      const text = res.data?.result?.trim();
      if (!text) return reply("⚠️ Unexpected response from Deepseek R1.");
      
      await ednut.sendMessage(m.chat, { text }, { quoted: m });
    } catch (err) {
      global.log("ERROR", `deepseek failed: ${err.message || err}`);
      reply("❌ Failed to contact Deepseek R1.");
    }
  }
}
];