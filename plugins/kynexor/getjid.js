module.exports = [
  {
    command: ["getjid"],
    alias: ["jid"],
    description: "Get Group or Channel JID from link",
    category: "Tool",
    use: "<group | channel link>",
    filename: __filename,

    async execute(m, { args, isOwner, reply, ednut }) {
      try {
        if (!isOwner) return reply("❌ Owner only command");
        if (!args[0]) return reply("⚠️ Usage: .getjid <link>");

        const link = args[0];
        let jid, type;

        // 📌 Group
        if (link.includes("chat.whatsapp.com/")) {
          const code = link.split("/").pop();
          jid = `${code}@g.us`;
          type = "Group";

          return m.reply(
`╭━━━〔 *JID FOUND* 〕━━━┈⊷
┃▸ *Type:* ${type}
┃▸ *JID:* ${jid}
╰────────────────┈⊷`
          );
        }

        // 📌 Channel
        else if (link.includes("whatsapp.com/channel/")) {
          try {
            const inviteCode = link.split('https://whatsapp.com/channel/')[1];
            const metadata = await ednut.newsletterMetadata("invite", inviteCode);

            const replyText = 
`✅ *Channel Info Found*

*Name:* ${metadata.name}
*ID:* ${metadata.id}
*Followers:* ${metadata.subscribers}
*Verified:* ${metadata.verification === "VERIFIED" ? "Yes" : "No"}`;

            return m.reply(replyText);
          } catch (e) {
            console.log("getjid channel error:", e);
            return reply("❌ Could not retrieve channel information. The link might be invalid or the channel may be private.");
          }
        }

        else {
          return reply("❌ Invalid WhatsApp group or channel link");
        }

      } catch (e) {
        console.error("getjid error:", e);
        return reply("❎ Failed to extract JID");
      }
    }
  }
];