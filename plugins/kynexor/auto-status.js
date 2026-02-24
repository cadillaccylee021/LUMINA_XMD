module.exports = [
  {
    command: ["autoreactstatus"],
    alias: ["statuslike", "autolike"],
    description: "Control how the bot reacts to statuses",
    category: "Owner",
    async execute(m, { text, isOwner, reply }) {
      try {
        if (!isOwner) return reply("📛 This command is restricted to owners only.");

        const action = text?.toLowerCase()?.trim();
        if (!action) {
          return reply("Usage: .autoreactstatus <on/off>");
        }

        const { autolike } = global.db.settings;

        if (action === "on") {
          if (autolike) return reply("_AutoLike is already enabled._");
          global.db.settings.autolike = true;
          return reply("_✅ AutoLike has been enabled. The bot will now react to all statuses._");
        }

        if (action === "off") {
          if (!autolike) return reply("_AutoLike is already turned off._");
          global.db.settings.autolike = false;
          return reply("_❌ AutoLike has been disabled. The bot will no longer react to statuses._");
        }

        return reply("Invalid action. Use: on or off.");
      } catch (e) {
        console.error("Error in autoreactstatus command:", e);
        return reply("❌ An error occurred while processing your command.");
      }
    },
  }
];
