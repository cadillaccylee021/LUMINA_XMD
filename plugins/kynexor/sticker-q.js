const axios = require("axios");
const { Sticker, StickerTypes } = require("wa-sticker-formatter");
const { getBuffer } = require("../../lib/myfunc.js"); // adjust path if needed

module.exports = [
  {
    command: ["quoted"], // main command
    alias: ["q", "qc"],  // alternative names
    description: "Makes a sticker from quoted text or inline text.",
    category: "Tool",
    use: "<reply to any message or write text>",
    filename: __filename,
    async execute(m, { ednut, from, isOwner, q, quoted, body, reply }) {
      try {
        if (!isOwner) return reply("*❌ Only the bot owner can use this command.*");

        const textToQuote = m.quoted?.text || m.quoted?.body || q;
        if (!textToQuote) return reply("_❌ Provide or reply to a message with text._");

        const senderId = m.quoted?.sender || m.sender;
        const profilePic = await ednut.profilePictureUrl(senderId, "image")
          .catch(() => "https://files.catbox.moe/wpi099.png");

        const username = m.pushName || (await ednut.getName(senderId));

        const payload = {
          type: "quote",
          format: "png",
          backgroundColor: "#FFFFFF",
          width: 512,
          height: 512,
          scale: 3,
          messages: [
            {
              avatar: true,
              from: {
                first_name: username,
                language_code: "en",
                name: username,
                photo: { url: profilePic },
              },
              text: textToQuote,
              replyMessage: {},
            },
          ],
        };

        const res = await axios.post("https://bot.lyo.su/quote/generate", payload);
        const imageBuffer = await getBuffer("data:image/png;base64," + res.data.result.image);

        const sticker = new Sticker(imageBuffer, {
          pack: global.packname || "ᴘᴀᴛʀᴏɴᴍᴅ 🚹", // ✅ using global.packname
          author: username,
          type: StickerTypes.FULL,
          quality: 75,
        });

        const buffer = await sticker.toBuffer();
        await ednut.sendMessage(m.chat, { sticker: buffer }, { quoted: m });

      } catch (e) {
        console.error("Quotely error:", e);
        return reply(`❌ *Quotely Error:* ${e.message}`);
      }
    }
  }
];