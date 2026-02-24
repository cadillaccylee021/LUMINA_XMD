const fetch = require("node-fetch");

module.exports = [
  {
    command: ["repo"],
    alias: ["sc", "script", "info"],
    description: "Fetch GitHub repository information",
    category: "Info",
    filename: __filename,
    async execute(m, { ednut, q, reply, from }) {
      const githubRepoURL = "https://github.com/Itzpatron/lumina-xmd3";

      try {
        const [, username, repoName] = githubRepoURL.match(/github\.com\/([^/]+)\/([^/]+)/);
        const response = await fetch(`https://api.github.com/repos/${username}/${repoName}`);

        if (!response.ok) throw new Error(`GitHub API error: ${response.status}`);
        const repoData = await response.json();

        // Different caption styles
        const style1 = `╭───『 lumina-xmd REPO 』───⳹
│ 🌐 Use this link to get session id:\n│ 👉 https://lumina-xmd.vercel.app
│ 🚀 Or use this bot .getpair 234xxxxxx
│ 📦 *Repository*: ${repoData.name}
│ 👑 *Owner*: ${repoData.owner.login}
│ ⭐ *Stars*: ${repoData.stargazers_count}
│ ⑂ *Forks*: ${repoData.forks_count}
│ 🔗 *URL*: ${repoData.html_url}/fork
│
│ 📝 *Description*:
│ ${repoData.description || 'No description'}
│
╰────────────────⳹
> *© ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴘᴀᴛʀᴏɴ TᴇᴄʜＸ 🚹* `;

        const style2 = `•——[ *GITHUB INFO* ]——•
  ├─ 🌐 *Use this link to get session id:*\n├─ 👉 https://lumina-xmd.vercel.app
  ├─ 🚀 *Or use this bot .getpair 234xxxxxx*     
  │
  ├─ 🏷️ ${repoData.name}
  ├─ 👤 ${repoData.owner.login}
  ├─ ✨ ${repoData.stargazers_count} Stars
  ├─ ⑂ ${repoData.forks_count} Forks
  ├─ 🔗 ${repoData.html_url}/fork
  │
  •——[ *lumina-xmd* ]——•
> *© ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴘᴀᴛʀᴏɴ TᴇᴄʜＸ 🚹* `;

        const styles = [style1, style2];
        const selectedStyle = styles[Math.floor(Math.random() * styles.length)];

        // Send image with repo info
        await ednut.sendMessage(
          from,
          {
            image: { url: "https://files.catbox.moe/e71nan.png" },
            caption: selectedStyle,
            contextInfo: {
              mentionedJid: [m.sender],
              forwardingScore: 2,
              isForwarded: true,
              forwardedNewsletterMessageInfo: {
                newsletterJid: "120363403987497624@newsletter",
                newsletterName: "ᴘᴀᴛʀᴏɴTᴇᴄʜＸ",
                serverMessageId: 143,
              },
            },
          },
          { quoted: m }
        );
      } catch (error) {
        console.error("Repo command error:", error);
        reply(`❌ Error: ${error.message}`);
      }
    },
  },
];