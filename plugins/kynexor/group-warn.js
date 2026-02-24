const { alias } = require("yargs");

module.exports = [
  {
    command: ["warn"],
    description: "Warn a user in group chat",
    category: "Group",
    ban: true,
    gcban: true,
    group: true,
    execute: async (m, { ednut, isAdmins, isOwner, isBotAdmins, text, sleep, reply }) => {
        if (!(isAdmins || isOwner)) return reply(msg.admin);
                      if (!isBotAdmins) return reply(msg.BotAdmin); // ⬅️ bot must be admin first
      const war = global.warn || 3;
      const who = m.mentionedJid?.[0] || m.quoted?.sender;
      if (!who) return reply("Tag or reply to someone to warn.");

      const warns = global.db.warn ??= {};
      if (!warns[who]) warns[who] = 0;

      const reason = text?.replace(/@\d+/g, "")?.trim() || "No reason";

      if (warns[who] < war) {
        warns[who] += 1;

        await ednut.sendMessage(m.chat, {
          text: `*WARNING*\n\nUser: @${who.split("@")[0]}\nWarning: ${warns[who]}/${war}\nReason: ${reason}`,
          mentions: [who],
        });

        await ednut.sendMessage(m.chat, { delete: m.key });

        if (warns[who] >= war) {
          await ednut.sendMessage(m.chat, {
            text: `@${who.split("@")[0]} has reached *${war}* warnings and will be removed.`,
            mentions: [who],
          });

          await sleep(3000);
          await ednut.groupParticipantsUpdate(m.chat, [who], "remove");
          delete warns[who];
        }
      }
    },
  },
  {
    command: ["delwarn"],
    alias: ["removewarn", "delwarns", "resetwarn"],
    description: "Reduce warning count of a user",
    category: "Group",
    ban: true,
    gcban: true,
    group: true,
    execute: async (m, { ednut, isAdmins, isOwner, isBotAdmins, reply }) => {
              if (!isBotAdmins) return reply(msg.BotAdmin); // ⬅️ bot must be admin first
        if (!(isAdmins || isOwner)) return reply(msg.admin);
      const who = m.mentionedJid?.[0] || m.quoted?.sender;
      if (!who) return reply("Tag or reply to someone to reduce warning.");

      const warns = global.db.warn ??= {};
      if (!warns[who]) return reply("User has no warnings.");

      if (warns[who] > 0) {
        warns[who] -= 1;

        await ednut.sendMessage(m.chat, {
          text: `Warning Removed\nUser: @${who.split("@")[0]}\nTotal Warnings: ${warns[who]}`,
          mentions: [who],
        });
      } else {
        reply("User has no warnings.");
      }
    },
  },
  {
    command: ["resetwarn"],
    description: "Reset warning count for a user",
    category: "Group",
    ban: true,
    gcban: true,
    group: true,
    execute: async (m, { ednut, isAdmins, isOwner, isBotAdmins, text, reply }) => {
              if (!isBotAdmins) return reply(msg.BotAdmin); // ⬅️ bot must be admin first
        if (!(isAdmins || isOwner)) return reply(msg.admin);
      const who =
        m.mentionedJid?.[0] ||
        m.quoted?.sender ||
        (text ? text.replace(/[^0-9]/g, "") + "@s.whatsapp.net" : false);
      if (!who) return reply("*Tag, reply or provide number to reset warning.*");

      const warns = global.db.warn ??= {};
      warns[who] = 0;

      await ednut.sendMessage(m.chat, {
        text: `Warnings for @${who.split("@")[0]} have been reset.`,
        mentions: [who],
      });
    },
  },
];