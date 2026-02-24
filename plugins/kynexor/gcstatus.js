module.exports = [
  {
    command: ["groupstatus"],
    alias: ["gstatus", "gstat"],
    description: "Post replied message as group status",
    category: "group",
    use: ".groupstatus [reply to image/video/audio/text]",
    filename: __filename,
    async execute(m, { conn, reply, quoted, q, isGroup, isAdmins, isOwner }) {
      try {
        if (!isGroup) return await reply("❌ This command can only be used in groups.");
        if (!isOwner) return await reply("❌ Only admins can use this command.");
        if (!quoted) return await reply("❗ Please reply to the media or text you want to set as group status.");

        const mtype = quoted.type;
        let statusPayload = {};

        if (mtype === 'imageMessage') {
          const mediaBuffer = await quoted.download();
          const caption = quoted.imageMessage?.caption || q || '';
          statusPayload = {
            groupStatusMessage: {
              image: mediaBuffer,
              caption: caption
            }
          };
        } else if (mtype === 'videoMessage') {
          const mediaBuffer = await quoted.download();
          const caption = quoted.videoMessage?.caption || q || '';
          statusPayload = {
            groupStatusMessage: {
              video: mediaBuffer,
              caption: caption
            }
          };
        } else if (mtype === 'audioMessage') {
          const mediaBuffer = await quoted.download();
          statusPayload = {
            groupStatusMessage: {
              audio: mediaBuffer,
              ptt: quoted.audioMessage?.ptt || false
            }
          };
        } else if (mtype === 'conversation' || mtype === 'extendedTextMessage') {
          const textContent = quoted.text || quoted.msg || '';
          const bgColors = ['#FF5733', '#33FF57', '#3357FF', '#FF33A1', '#33FFF5', '#F5FF33', '#9933FF'];
          const randomBg = bgColors[Math.floor(Math.random() * bgColors.length)];
          statusPayload = {
            groupStatusMessage: {
              text: textContent,
              backgroundColor: randomBg,
              font: Math.floor(Math.random() * 5)
            }
          };
        } else {
          return await reply("❌ Unsupported media type.");
        }

        await conn.sendMessage(m.chat, statusPayload);
        await reply("✅ Group status updated successfully.");

      } catch (e) {
        console.error("groupstatus error:", e);
        await reply("⚠️ Failed to update group status. Please try again later.");
      }
    }
  }
];