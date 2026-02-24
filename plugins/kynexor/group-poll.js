module.exports = [
  {
    command: ["poll"],
    description: "Create a poll with a question and options in the group.",
    category: "group",
    filename: __filename,
    async execute(m, { ednut, from, isGroup, body, reply, prefix }) {
      try {
        // ✅ Only works in groups
        if (!isGroup) return reply("❌ This command can only be used in groups.");

        // ✅ Split input into question & options
        let [question, optionsString] = body.split(";");
        if (!question || !optionsString) {
          return reply(`Usage: ${prefix}poll question;option1,option2,option3...`);
        }

        // ✅ Clean options
        let options = optionsString
          .split(",")
          .map(opt => opt.trim())
          .filter(opt => opt !== "");

        if (options.length < 2) {
          return reply("❌ Please provide at least *two options* for the poll.");
        }

        // ✅ Send poll
        await ednut.sendMessage(from, {
          poll: {
            name: question.trim(),
            values: options,
            selectableCount: 1,
            toAnnouncementGroup: true,
          }
        }, { quoted: m });
      } catch (e) {
        console.error("Poll command error:", e);
        reply(`❌ An error occurred.\n\n_Error:_ ${e.message}`);
      }
    }
  }
];