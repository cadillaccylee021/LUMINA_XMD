module.exports = [
  {
    command: ["creact"],
    alias: ["chr", "channel-react", "reactch", "chreact"],
    description: "React to channel messages with stylized text",
    category: "Owner",
    use: "<channel-link> <text>",
    filename: __filename,

    async execute(m, { ednut, args, isOwner, reply }) {
      const stylizedChars = {
        a: '🅐', b: '🅑', c: '🅒', d: '🅓', e: '🅔', f: '🅕', g: '🅖',
        h: '🅗', i: '🅘', j: '🅙', k: '🅚', l: '🅛', m: '🅜', n: '🅝',
        o: '🅞', p: '🅟', q: '🅠', r: '🅡', s: '🅢', t: '🅣', u: '🅤',
        v: '🅥', w: '🅦', x: '🅧', y: '🅨', z: '🅩',
        '0': '⓿', '1': '➊', '2': '➋', '3': '➌', '4': '➍',
        '5': '➎', '6': '➏', '7': '➐', '8': '➑', '9': '➒'
      };

      try {
        if (!isOwner) return reply("❌ Owner only command");
        if (!args[0]) return reply("⚠️ Usage: .chr <channel-link> <text>");

        const [link, ...textParts] = args;
        if (!link.includes("whatsapp.com/channel/")) return reply("❌ Invalid channel link format");

        const inputText = textParts.join(" ").toLowerCase();
        if (!inputText) return reply("❌ Please provide text to convert");

        const emoji = inputText
          .split("")
          .map(char => (char === " " ? "―" : stylizedChars[char] || char))
          .join("");

        const parts = link.split("/");
        const channelId = parts[4];
        const messageId = parts[5];
        if (!channelId || !messageId) return reply("❌ Invalid link - missing IDs");

        const channelMeta = await ednut.newsletterMetadata("invite", channelId);
        await ednut.newsletterReactMessage(channelMeta.id, messageId, emoji);

        return reply(`╭━━━〔 *lumina-xmd* 〕━━━┈⊷
┃▸ *Success!* Reaction sent
┃▸ *Channel:* ${channelMeta.name}
┃▸ *Reaction:* ${emoji}
╰────────────────┈⊷
> *© Pᴏᴡᴇʀᴇᴅ Bʏ ᴘᴀᴛʀᴏɴ TᴇᴄʜＸ 🚹*`);
      } catch (e) {
        console.error("Error in chr:", e);
        reply(`❎ Error: ${e.message || "Failed to send reaction"}`);
      }
    }
  }
];