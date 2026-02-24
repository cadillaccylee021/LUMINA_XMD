module.exports = [
  {
  command: "del",
  description: "Delete a quoted message",
  category: "Owner",
  ban: true,
  gcban: true,
  execute: async (m, { ednut, isOwner, isAdmins, isBotAdmins, example, isGroup }) => {
    if (!m.isGroup) {
      if (!isOwner && !isAdmins) return m.reply("❌ You must be an admin to use this command.");
      if (!m.quoted) return m.reply("❗ Reply to the message you want to delete.");
      if (m.quoted.fromMe) {
        return ednut.sendMessage(m.chat, {
          delete: {
            remoteJid: m.chat,
            fromMe: true,
            id: m.quoted.id,
            participant: m.quoted.sender,
          },
        });
      } else {
        if (!isBotAdmins) return m.reply("❌ I need to be an admin to delete this message.");
        return ednut.sendMessage(m.chat, {
          delete: {
            remoteJid: m.chat,
            fromMe: false,
            id: m.quoted.id,
            participant: m.quoted.sender,
          },
        });
      }
    } else {
      if (!isOwner) return m.reply("❌ Only the bot owner can use this command in groups.");
      if (!m.quoted) return m.reply("❗ Reply to the message you want to delete.");
      return ednut.sendMessage(m.chat, {
        delete: {
          remoteJid: m.chat,
          fromMe: false,
          id: m.quoted.id,
          participant: m.quoted.sender,
        },
      });
    }
  }
},

  {
    command: "bio",
    alias: ["setbiobot"],
    description: "Set the bot's bio/status",
    category: "Owner",
    ban: true,
    gcban: true,
    owner: true,
    execute: async (m, { ednut, text, isOwner, msg, example, isGroup }) => {
      if (!text) return m.reply(example("Set your bot bio text"));
      await ednut.updateProfileStatus(text);
      m.reply("_Bio set successfully._");
    },
  },

  {
    command: "restart",
    description: "Restart the bot",
    category: "Owner",
    ban: true,
    gcban: true,
    owner: true,
    execute: async (m, { isOwner, msg, sleep, reply }) => {
      reply("*Restarting, please wait...*");
      await sleep(1500);
      process.exit(0);
    },
  },

  {
    command: "leave",
    alias: ["left"],
    description: "Make bot leave the group",
    category: "Owner",
    ban: true,
    gcban: true,
    execute: async (m, { ednut, isOwner, msg, sleep, isGroup}) => {
      if (!m.isGroup) return m.reply(msg.group);
      if (!isOwner) return m.reply(msg.owner)
      await sleep(2000);
      await ednut.groupLeave(m.chat);
    },
  },

  {
    command: "join",
    alias: ["joingc"],
    description: "Join a WhatsApp group using invite link",
    category: "Owner",
    ban: true,
    gcban: true,
    owner: true,
    execute: async (m, { ednut, isOwner, text, msg, example, isGroup }) => {
      if (!text) return m.reply(example("Provide group invite link"));
      if (!text.includes("chat.whatsapp.com")) return m.reply("The given link is invalid.");
      try {
        const code = text.split("https://chat.whatsapp.com/")[1];
        await ednut.groupAcceptInvite(code);
        m.reply("Successfully joined the group.");
      } catch (err) {
        m.reply("Failed to join group. Make sure the link is correct and valid.");
      }
    },
  },
];