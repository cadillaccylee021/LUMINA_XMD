module.exports = [
  {
    command: ["removemembers", "kickall", "endgc", "endgroup"],
    description: "Remove all non-admin members from the group.",
    category: "group",
    filename: __filename,
    async execute(m, { ednut, from, isGroup, groupMetadata, groupAdmins, isBotAdmins, reply, sender }) {
      try {
        if (!isGroup) return reply("❌ This command can only be used in groups.");
        if (!isBotAdmins) return reply("❌ I need to be an admin to execute this command.");

        const botNumber = await ednut.decodeJid(ednut.user.id);

        // ✅ Only bot owner can run this
        if (sender !== botNumber) {
          return reply("❌ Only the bot owner can use this command.");
        }

        const allParticipants = groupMetadata.participants;

        // Filter out admins, bot & owner (remove only members)
        const participantsToRemove = allParticipants.filter(
          member =>
            !groupAdmins.some(admin => admin.id === member.id) &&
            member.id !== botNumber
        );

        if (participantsToRemove.length === 0) {
          return reply("✅ No non-admin members to remove.");
        }

        reply(`🔄 Starting mass removal: ${participantsToRemove.length} members`);

        let successCount = 0;
        let failCount = 0;

        for (let i = 0; i < participantsToRemove.length; i++) {
          try {
            const delay = Math.floor(Math.random() * 2000) + 2000;
            await new Promise(resolve => setTimeout(resolve, delay));

            await ednut.groupParticipantsUpdate(from, [participantsToRemove[i].id], "remove");
            successCount++;

            if (successCount % 5 === 0) {
              await reply(`Progress: ${successCount}/${participantsToRemove.length} members removed...`);
            }
          } catch (e) {
            console.error(`❌ Failed to remove ${participantsToRemove[i].id}:`, e);
            failCount++;
            await new Promise(resolve => setTimeout(resolve, 3000));
          }
        }

        await reply(`✅ Operation Complete!\n• Successfully removed: ${successCount}\n• Failed: ${failCount}`);

        await new Promise(resolve => setTimeout(resolve, 3000));
        await ednut.groupLeave(from);

      } catch (e) {
        console.error("❌ Error during mass removal:", e);
        reply("❌ An error occurred during the operation.");
      }
    }
  },

  {
    command: ["removeadmins", "kickadmins", "kickall3", "deladmins"],
    description: "Remove all admin members from the group, excluding the bot and bot owner.",
    category: "group",
    filename: __filename,
    async execute(m, { ednut, from, isGroup, groupMetadata, groupAdmins, isBotAdmins, reply, sender }) {
      try {
        if (!isGroup) return reply("❌ This command can only be used in groups.");
        if (!isBotAdmins) return reply("❌ I need to be an admin to execute this command.");

        const botNumber = await ednut.decodeJid(ednut.user.id);

        // ✅ Only bot owner can run this
        if (sender !== botNumber) {
          return reply("❌ Only the bot owner can use this command.");
        }

        const allParticipants = groupMetadata.participants;
        const adminJIDs = groupAdmins.map(a => a.id);

        const adminParticipants = allParticipants.filter(
          member =>
            adminJIDs.includes(member.id) &&
            member.id !== botNumber
        );

        if (adminParticipants.length === 0) {
          return reply("✅ No admins to remove (excluding bot and bot owner).");
        }

        reply(`🔄 Removing ${adminParticipants.length} admin members...`);

        for (let participant of adminParticipants) {
          try {
            await ednut.groupParticipantsUpdate(from, [participant.id], "remove");
            await new Promise(resolve => setTimeout(resolve, 2000));
          } catch (e) {
            console.error(`❌ Failed to remove ${participant.id}:`, e);
          }
        }

        reply("✅ Successfully removed all admin members (excluding bot and bot owner).");
      } catch (e) {
        console.error("❌ Error removing admins:", e);
        reply("❌ An error occurred while trying to remove admins.");
      }
    }
  }
];