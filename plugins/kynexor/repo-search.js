const axios = require("axios");

module.exports = [
  {
    command: ["srepo"],
    alias: ["searchrepo"],
    description: "Fetch information about a GitHub repository.",
    category: "Other",
    filename: __filename,
    use: "<owner/repo>",
    ban: true,
    gcban: true,
    execute: async (m, { ednut, args, reply }) => {
      try {
        if (!args || args.length === 0) {
          return reply("❌ Please provide a GitHub repository in the format 📌 `owner/repo`.");
        }

        const repoName = args.join(" ");
        const apiUrl = `https://api.github.com/repos/${repoName}`;
        const { data } = await axios.get(apiUrl);

        let responseMsg = `📁 *GitHub Repository Info* 📁\n\n`;
        responseMsg += `📌 *Name*: ${data.name}\n`;
        responseMsg += `🔗 *URL*: ${data.html_url}\n`;
        responseMsg += `📝 *Description*: ${data.description || "No description"}\n`;
        responseMsg += `⭐ *Stars*: ${data.stargazers_count}\n`;
        responseMsg += `🍴 *Forks*: ${data.forks_count}\n`;
        responseMsg += `👤 *Owner*: ${data.owner.login}\n`;
        responseMsg += `📅 *Created At*: ${new Date(data.created_at).toLocaleDateString()}\n`;
        responseMsg += `\n> *© ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴘᴀᴛʀᴏɴTᴇᴄʜＸ* 🚹`;

        await ednut.sendMessage(m.chat, { text: responseMsg }, { quoted: m });
      } catch (error) {
        console.error("GitHub API Error:", error);
        reply(`❌ Error fetching repository data: ${error.response?.data?.message || error.message}`);
      }
    }
  }
];
