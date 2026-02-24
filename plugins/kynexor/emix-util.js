const axios = require("axios");
const { getBuffer } = require("../../lib/myfunc.js");
const { Sticker, StickerTypes } = require("wa-sticker-formatter");

module.exports = [
  {
    command: ["emix"],
    description: "Combine two emojis into a sticker.",
    category: "Fun",
    filename: __filename,
    use: "😂,🙂",
    async execute(m, { ednut, q, reply, mek }) {
      try {
        // React to user
        await ednut.sendMessage(m.key.remoteJid, {
          react: { text: "😃", key: m.key }
        });

        if (!q.includes(",")) {
          return reply("❌ *Usage:* .emix 😂,🙂\n_Send two emojis separated by a comma._");
        }

        let [emoji1, emoji2] = q.split(",").map(e => e.trim());

        if (!emoji1 || !emoji2) {
          return reply("❌ Please provide two emojis separated by a comma.");
        }

        // Fetch emoji mix image URL
        const imageUrl = await fetchEmix(emoji1, emoji2);

        if (!imageUrl) {
          return reply("❌ Could not generate emoji mix. Try different emojis.");
        }

        // Convert image to sticker
        const buffer = await getBuffer(imageUrl);
        const sticker = new Sticker(buffer, {
          pack: "Emoji Mix",
          author: "LUMINA-XMD",
          type: StickerTypes.FULL,
          categories: ["🤩", "🎉"],
          quality: 75,
          background: "transparent",
        });

        const stickerBuffer = await sticker.toBuffer();
        await ednut.sendMessage(mek.chat, { sticker: stickerBuffer }, { quoted: mek });

      } catch (e) {
        console.error("Error in .emix command:", e.message);
        reply(`❌ Could not generate emoji mix: ${e.message}`);
      }
    }
  }
];

/**
 * Fetch Emoji Mix image from API.
 * @param {string} emoji1 - First emoji.
 * @param {string} emoji2 - Second emoji.
 * @returns {Promise<string>} - The image URL.
 */
async function fetchEmix(emoji1, emoji2) {
  try {
    if (!emoji1 || !emoji2) {
      throw new Error("Invalid emoji input. Please provide two emojis.");
    }

    const apiUrl = `https://levanter.onrender.com/emix?q=${encodeURIComponent(emoji1)},${encodeURIComponent(emoji2)}`;
    const response = await axios.get(apiUrl);

    if (response.data && response.data.result) {
      return response.data.result;
    } else {
      throw new Error("No valid image found.");
    }
  } catch (error) {
    console.error("Error fetching emoji mix:", error.message);
    throw new Error("Failed to fetch emoji mix.");
  }
}