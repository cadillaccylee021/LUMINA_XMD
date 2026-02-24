module.exports = [
  {
    command: ["antilink"],
    description: "Manage anti-link feature in a group (kick, delete, warn, off)",
    category: "Group",
    owner: false,
    group: true,
    botadmin: true,
    admin: true,
    ban: true,
    gcban: true,
    async execute(m, { ednut, from, isGroup, isAdmins, isOwner, isBotAdmins, text, example, reply }) {
      try {
        if (!isGroup) return reply("❌ This command can only be used in groups.");
        if (!isBotAdmins) return reply("❌ I need to be an admin to execute this command.");

        if (!text) return reply(example("<kick/delete/warn/off>"));

        const action = text.trim().toLowerCase();
        const groupData = global.db.groups[from] || (global.db.groups[from] = {});

        switch (action) {
          case "kick":
            if (groupData.antilink) return reply("Already activated in this group");
            groupData.antilink = true;
            groupData.antilink2 = false;
            groupData.antilink3 = false;
            await reply("✅ Successfully activated anti-link to *kick* any link sender.");
            break;

          case "delete":
            if (groupData.antilink2) return reply("Already activated in this group");
            groupData.antilink2 = true;
            groupData.antilink = false;
            groupData.antilink3 = false;
            await reply("✅ Successfully activated anti-link to *delete* any sent link.");
            break;

          case "warn":
            if (groupData.antilink3) return reply("Already activated in this group");
            groupData.antilink3 = true;
            groupData.antilink = false;
            groupData.antilink2 = false;
            await reply("✅ Successfully activated anti-link to *warn and delete* any sent link.");
            break;

          case "off":
            groupData.antilink = false;
            groupData.antilink2 = false;
            groupData.antilink3 = false;
            await reply("✅ Successfully deactivated anti-link feature in this group.");
            break;

          default:
            reply("❌ Invalid action. Available actions: kick / delete / warn / off.");
        }
      } catch (e) {
        console.error("AntiLink command error:", e);
        reply("❌ An error occurred while executing the command.");
      }
    }
  },
];
