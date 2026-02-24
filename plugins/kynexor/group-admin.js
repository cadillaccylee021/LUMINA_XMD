module.exports = [
  {
    command: ["promote"],
    description: "Promote a member to admin",
    category: "Group",
    ban: true,
    gcban: true,
    group: true,
    execute: async (m, { ednut, isAdmins, isOwner, isBotAdmins, text, reply }) => {
      try {
        if (!isBotAdmins) return reply(msg.BotAdmin); // ⬅️ bot must be admin first
        if (!(isAdmins || isOwner)) return reply(msg.admin); // ⬅️ only admin can use

        let users = m.mentionedJid[0] || (m.quoted ? m.quoted.sender : text.replace(/[^0-9]/g, '') + '@s.whatsapp.net');
        if (!users) return reply("Please tag or reply to a user.");

        await ednut.groupParticipantsUpdate(m.chat, [users], 'promote');
        await ednut.sendMessage(m.chat, {
          text: `@${users.split('@')[0]} has been promoted.`,
          mentions: [users]
        });
        await ednut.sendMessage(m.chat, { delete: m.key });
      } catch (err) {
        reply("Unable to promote member.");
        if (global.log) global.log("ERROR", `Promote Error: ${err.message || err}`);
      }
    }
  },

  {
    command: ["demote"],
    description: "Demote a group admin",
    category: "Group",
    ban: true,
    gcban: true,
    group: true,
    execute: async (m, { ednut, isAdmins, isOwner, isBotAdmins, text, reply }) => {
      try {
        if (!isBotAdmins) return reply(msg.BotAdmin); // ⬅️ bot must be admin first
        if (!(isAdmins || isOwner)) return reply(msg.admin);

        let users = m.mentionedJid[0] || (m.quoted ? m.quoted.sender : text.replace(/[^0-9]/g, '') + '@s.whatsapp.net');
        if (!users) return reply("Please tag or reply to a user.");

        await ednut.groupParticipantsUpdate(m.chat, [users], 'demote');
        await ednut.sendMessage(m.chat, {
          text: `@${users.split('@')[0]} has been demoted.`,
          mentions: [users]
        });
        await ednut.sendMessage(m.chat, { delete: m.key });
      } catch (err) {
        reply("Unable to demote member.");
        if (global.log) global.log("ERROR", `Demote Error: ${err.message || err}`);
      }
    }
  },

  {
    command: ["kick"],
    alias: ["fling", "remove"],
    description: "Remove a user from the group",
    category: "Group",
    ban: true,
    gcban: true,
    group: true,
    execute: async (m, { ednut, isAdmins, isOwner, isBotAdmins, text, reply }) => {
      try {
        if (!isBotAdmins) return reply(msg.BotAdmin); // ⬅️ bot must be admin first
        if (!(isAdmins || isOwner)) return reply(msg.admin);

        let users = m.mentionedJid[0] || (m.quoted ? m.quoted.sender : (text ? text.replace(/[^0-9]/g, '') + '@s.whatsapp.net' : false));
        if (!users) return reply("Tag or reply to a user to kick.");

        await ednut.groupParticipantsUpdate(m.chat, [users], 'remove');
        await ednut.sendMessage(m.chat, {
          text: `@${users.split('@')[0]} has been removed from the group chat.`,
          mentions: [users]
        });
        await ednut.sendMessage(m.chat, { delete: m.key });
      } catch (err) {
        reply("Unable to kick member.");
        if (global.log) global.log("ERROR", `Kick Error: ${err.message || err}`);
      }
    }
  },

  {
    command: ["mute"],
    alias: ["close"],
    description: "Mute the group (only admins can send messages)",
    category: "Group",
    ban: true,
    gcban: true,
    group: true,
    execute: async (m, { ednut, isAdmins, isOwner, isBotAdmins, reply }) => {
      try {
                if (!isBotAdmins) return reply(msg.BotAdmin); // ⬅️ bot must be admin first
        if (!(isAdmins || isOwner)) return reply(msg.admin);

        const metadata = await ednut.groupMetadata(m.chat);
        if (!metadata.announce) {
          await ednut.groupSettingUpdate(m.chat, 'announcement');
          reply(`Group has been muted!`);
        } else {
          reply(`Group is already muted!`);
        }
      } catch (err) {
        reply("Failed to mute group.");
        if (global.log) global.log("ERROR", `Mute Error: ${err.message || err}`);
      }
    }
  },

  {
    command: ["unmute"],
    alias: ["open"],
    description: "Unmute the group (everyone can send messages)",
    category: "Group",
    ban: true,
    gcban: true,
    group: true,
    execute: async (m, { ednut, isAdmins, isOwner, isBotAdmins, reply }) => {
      try {
        if (!isBotAdmins) return reply(msg.BotAdmin); // ⬅️ bot must be admin first
        if (!(isAdmins || isOwner)) return reply(msg.admin);

        const metadata = await ednut.groupMetadata(m.chat);
        if (metadata.announce) {
          await ednut.groupSettingUpdate(m.chat, 'not_announcement');
          reply(`Group has been opened!`);
        } else {
          reply(`Group is already open!`);
        }
      } catch (err) {
        reply("Failed to unmute group.");
        if (global.log) global.log("ERROR", `Unmute Error: ${err.message || err}`);
      }
    }
  }
];