const fs = require("fs");

module.exports = [
  {
    command: ["save"],
    alias: ["sv", "send"],
    description: "Download and forward a quoted message (text, media, sticker, doc)",
    category: "Info",
    ban: false,
    gcban: false,
    execute: async (m, { ednut, botNumber, isOwner, isGroup, reply}) => {
      if (!isOwner) return
      const quoted = m.msg.contextInfo?.quotedMessage;
      if (!quoted) return reply("Reply to a message or media to download and save.");

      // Text
      if (quoted.conversation) {
        return ednut.sendMessage(botNumber, { text: quoted.conversation }, { quoted: m });
      }

      // Image
      if (quoted.imageMessage) {
        const caption = quoted.imageMessage.caption || "";
        const imageUrl = await ednut.downloadAndSaveMediaMessage(quoted.imageMessage);
        return ednut.sendMessage(botNumber, { image: { url: imageUrl }, caption }, { quoted: m });
      }

      // Audio
      if (quoted.audioMessage) {
        const audioUrl = await ednut.downloadAndSaveMediaMessage(quoted.audioMessage);
        return ednut.sendMessage(botNumber, { audio: { url: audioUrl }, mimetype: "audio/mpeg" }, { quoted: m });
      }

      // Video
      if (quoted.videoMessage) {
        const caption = quoted.videoMessage.caption || "";
        const videoUrl = await ednut.downloadAndSaveMediaMessage(quoted.videoMessage);
        return ednut.sendMessage(botNumber, { video: { url: videoUrl }, caption }, { quoted: m });
      }

      // Sticker
      if (quoted.stickerMessage) {
        const stickerUrl = await ednut.downloadAndSaveMediaMessage(quoted.stickerMessage);
        return ednut.sendMessage(botNumber, { sticker: { url: stickerUrl } }, { quoted: m });
      }

      // Document
      if (quoted.documentMessage) {
        const docUrl = await ednut.downloadAndSaveMediaMessage(quoted.documentMessage);
        const fileName = quoted.documentMessage.fileName || "file";
        return ednut.sendMessage(botNumber, { document: { url: docUrl }, mimetype: 'application/zip', fileName }, { quoted: m });
      }

      return reply("Unsupported message type.");
    }
  },

  {
    command: ["setpp"],
    description: "Set bot profile picture (reply to image)",
    category: "Owner",
    ban: false,
    gcban: false,
    owner: true,
    execute: async (m, { ednut, reply, isOwner, mime, quoted, prefix, command, isGroup }) => {
      if (!quoted) return reply(`Reply to an image to set as profile picture.`);
      if (!/image/.test(mime)) return reply(`Send/Reply image with caption *${prefix + command}*`);
      if (/webp/.test(mime)) return reply(`Sticker format not allowed. Send regular image.`);

      try {
        const media = await ednut.downloadAndSaveMediaMessage(quoted);
        await ednut.updateProfilePicture(ednut.user.id, { url: media });
        fs.unlinkSync(media);
      } catch (err) {
        reply("Failed to update profile picture.");
      }
    }
  },

  {
    command: ["delpp"],
    description: "Remove bot profile picture",
    category: "Owner",
    ban: false,
    gcban: false,
    owner: true,
    execute: async (m, { ednut, isOwner, isGroup, reply}) => {
      try {
        await ednut.removeProfilePicture(ednut.user.id);
        reply("Profile picture removed.");
      } catch (err) {
        reply("Failed to remove profile picture.");
      }
    }
  }
];