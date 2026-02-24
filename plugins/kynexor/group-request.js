module.exports = [
  {
    command: ["request"],
    description: "Check pending group join requests",
    category: "Group",
    group: true,
    execute: async (m, { ednut, isBotAdmins, isAdmins, isOwner, reply }) => {
      try {
              if (!isBotAdmins) return reply(msg.BotAdmin); // ⬅️ bot must be admin first
        if (!(isAdmins || isOwner)) return reply(msg.admin);
        const response = await ednut.groupRequestParticipantsList(m.chat);
        if (!response || response.length === 0) {
          return ednut.sendMessage(m.chat, { text: "No pending join requests." }, { quoted: m });
        }

        let replyMessage = `° Join Request List:\n`;
        response.forEach((request, index) => {
          const { jid, request_method, request_time } = request;
          const formattedTime = new Date(parseInt(request_time) * 1000).toLocaleString();
          replyMessage += `\nNo. ${index + 1}`;
          replyMessage += `\nJID: ${jid}`;
          replyMessage += `\nMethod: ${request_method}`;
          replyMessage += `\nTime: ${formattedTime}\n`;
        });

        await ednut.sendMessage(m.chat, { text: replyMessage }, { quoted: m });
      } catch (err) {
        reply("Failed to fetch requests.");
        global.log?.("ERROR", `request error: ${err.message || err}`);
      }
    }
  },

  {
    command: ["approve"],
    description: "Approve all pending group join requests",
    category: "Group",
    group: true,
    execute: async (m, { ednut, isBotAdmins, isAdmins, isOwner, reply }) => {
      try {
              if (!isBotAdmins) return reply(msg.BotAdmin); // ⬅️ bot must be admin first
        if (!(isAdmins || isOwner)) return reply(msg.admin);
        const pending = await ednut.groupRequestParticipantsList(m.chat);
        if (!pending || pending.length === 0) {
          return reply("No pending participants.");
        }

        let approvedList = [];
        let message = "Approved users:\n\n";

        for (const user of pending) {
          try {
            await ednut.groupRequestParticipantsUpdate(m.chat, [user.jid], "approve");
            message += `@${user.jid.split("@")[0]}\n`;
            approvedList.push(user.jid);
          } catch {}
        }

        await ednut.sendMessage(m.chat, {
          text: message,
          mentions: approvedList
        });
      } catch (err) {
        reply("Failed to approve.");
        global.log?.("ERROR", `approve error: ${err.message || err}`);
      }
    }
  },

  {
    command: ["reject"],
    description: "Reject a specific user or all pending join requests",
    category: "Group",
    group: true,
    botAdmin: true,
    admin: true,
    execute: async (m, { ednut, isBotAdmins, isAdmins, isOwner, text, reply }) => {
      try {
              if (!isBotAdmins) return reply(msg.BotAdmin); // ⬅️ bot must be admin first
        if (!(isAdmins || isOwner)) return reply(msg.admin);
        const input = text.trim();

        // Reject specific user
        if (input) {
          const jid = input.includes("@s.whatsapp.net")
            ? input
            : input.replace(/[^0-9]/g, "") + "@s.whatsapp.net";

          try {
            await ednut.groupRequestParticipantsUpdate(m.chat, [jid], "reject");
            return reply(`Rejected: @${jid.split("@")[0]}`, { mentions: [jid] });
          } catch (err) {
            return reply("Failed to reject user or user not in pending list.");
          }
        }

        // Reject all pending
        const pending = await ednut.groupRequestParticipantsList(m.chat);
        if (!pending || pending.length === 0) {
          return reply("No pending participants.");
        }

        let rejectedList = [];
        let message = "Rejected users:\n\n";

        for (const user of pending) {
          try {
            await ednut.groupRequestParticipantsUpdate(m.chat, [user.jid], "reject");
            message += `@${user.jid.split("@")[0]}\n`;
            rejectedList.push(user.jid);
          } catch {}
        }

        await ednut.sendMessage(m.chat, {
          text: message,
          mentions: rejectedList
        });
      } catch (err) {
        reply("Failed to reject.");
        global.log?.("ERROR", `reject error: ${err.message || err}`);
      }
    }
  }
];