const { alias } = require("yargs");

module.exports = [
  {
    command: ["mode"],
    description: "Change bot mode: public/private",
    category: "Owner",
    ban: true,
    gcban: true,
    owner: true,
    execute: async (m, { prefix, isOwner, isGroup }) => {
      let args = m.text.split(" ").slice(1);
      const option = args[0]?.toLowerCase();

      if (!option) return m.reply(`Example: ${prefix}mode public/private`);

      switch (option) {
        case "public":
          if (!global.db.settings.mode) return m.reply("_Bot mode is already Public!_");
          global.db.settings.mode = false;
          m.reply("_Bot mode changed to Public!_");
          break;

        case "private":
          if (global.db.settings.mode) return m.reply("_Bot mode is already Private!_");
          global.db.settings.mode = true;
          m.reply("_Bot mode changed to Private!_");
          break;

        default:
          m.reply(`Invalid option! Use one of: public/private`);
      }
    },
  },
  {
    command: ["areact"],
    alias: ["autoreact"],
    description: "Auto react mode: cmd/all/off",
    category: "Owner",
    ban: true,
    gcban: true,
    owner: true,
    execute: async (m, { prefix, isGroup, isOwner }) => {
      let args = m.text.split(" ").slice(1);
      const action = args[0]?.toLowerCase();

      if (!action) return m.reply(`Example: ${prefix}areact all/cmd/off`);

      switch (action) {
        case "cmd":
          if (global.db.settings.areact) return m.reply("Auto react for bot commands is already enabled.");
          global.db.settings.areact = true;
          global.db.settings.areact2 = false;
          m.reply("Auto react to bot command messages enabled.");
          break;

        case "all":
          if (global.db.settings.areact2) return m.reply("Auto react for all messages is already enabled.");
          global.db.settings.areact2 = true;
          global.db.settings.areact = false;
          m.reply("Auto react to all messages enabled.");
          break;

        case "off":
          global.db.settings.areact = false;
          global.db.settings.areact2 = false;
          m.reply("Auto react feature disabled.");
          break;

        default:
          m.reply("Invalid option! Use one of: all/cmd/off");
      }
    },
  }
];