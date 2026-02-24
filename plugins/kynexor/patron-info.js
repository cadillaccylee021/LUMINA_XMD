module.exports = [
  {
    command: ["lumin"],
    alias: ["luminainfo", "lumin-info", "manual"],
    description: "Information on how to use the bot.",
    category: "Info",
    filename: __filename,
    async execute(m, { ednut, from, reply }) {
      try {
        const prefix = global.prefix; 
        const ownerNumber = '+27751014718';
        const ownerName = 'Lumina TᴇᴄʜX 🚹';

        // vCard content
        const vCard = 
`BEGIN:VCARD
VERSION:3.0
FN:${ownerName}
TEL;type=CELL;type=VOICE;waid=${ownerNumber.replace('+', '')}:${ownerNumber}
END:VCARD`;

        const message = 
`🔹 *Welcome to Patron Bot!* 🔹
*(Please read everything carefully)*

📌 *Getting Started*
1️⃣ Use *${prefix}list* → Get all available commands with descriptions.
2️⃣ Use *${prefix}help <command>* → Learn how a specific command works.
3️⃣ Use *${prefix}report <command>* → Report issues or broken commands.
4️⃣ Use *${prefix}request <feature>* → Suggest new commands or features.
5️⃣ Visit: *https://lumina-xmd.vercel.app/plugins* → Explore extra plugins. Use *${prefix}install <link>* to apply.
6️⃣ Reach out to the bot owner for any inquiries.
7️⃣ Use *${prefix}getpair* → Connect your number to the bot for a session ID.
8️⃣ *Configuration Commands*
- *setenv* → Change bot settings if you are using a hosting panel.
- *setvar* → Change bot settings if you are deploying on Heroku.

🔄 *Updates*
9️⃣ Use *${prefix}update* → Update the bot.

🎭 *Reactions*
🔟 Use *${prefix}areact off/cmd/all* → Control bot reactions.
   - off → Disable all reactions
   - cmd → React only when a command is used
   - all → React to every message

💡 *Tips*
- Share the bot with friends.
- Join our support channel to stay updated on new features.

🌐 *Website & Resources*
- Visit: https://lumina-xmd.vercel.app → Learn more and get session IDs.
- Report issues using *${prefix}report <command>*.

📰 *Join our Channel* for announcements:
🔗 https://whatsapp.com/channel/0029VbCPLfv17Emn74cHz60k`;

        // Send the info message
        await ednut.sendMessage(from, { text: message });

        // Send the vCard
        await ednut.sendMessage(from, {
          contacts: {
            displayName: ownerName,
            contacts: [{ vcard: vCard }]
          }
        });

      } catch (err) {
        console.error("Error in patron command:", err);
        await ednut.sendMessage(from, { text: "❌ Something went wrong while retrieving the information." });
      }
    }
  }
];