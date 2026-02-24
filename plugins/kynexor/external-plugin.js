const fs = require("fs");
const path = require("path");
const axios = require("axios");
const DataBase = require("../../lib/database.js");

global.database = global.database || new DataBase(process.env.DATABASE_URL);

module.exports = {
  command: ["install"],
  description: "Install a plugin from a raw GitHub URL",
  category: "External",
  owner: true,

  execute: async (m, { text, reply }) => {
    if (!text || !text.startsWith("https://raw.githubusercontent.com/")) {
      return reply(
        "Please provide a valid raw GitHub URL.\n\nExample:\ninstall https://raw.githubusercontent.com/user/repo/branch/path/plugin.js"
      );
    }

    try {
      const response = await axios.get(text);
      const pluginCode = response.data;
      const filename = text.split("/").pop();

      if (!filename.endsWith(".js")) {
        return reply("Invalid file type. Only `.js` plugins are allowed.");
      }

      const pluginDir = path.resolve(__dirname, "../../plugins/patron");
      if (!fs.existsSync(pluginDir)) fs.mkdirSync(pluginDir, { recursive: true });

      const pluginPath = path.join(pluginDir, filename);

      // Save to memory (DB)
      global.db.plugins = global.db.plugins || {};
      global.db.plugins[filename] = pluginCode;

      // Write to disk
      fs.writeFileSync(pluginPath, pluginCode, "utf8");

      // Save to external DB (Mongo, Postgres, etc.)
      if (typeof global.database?.write === "function") {
        await global.database.write(global.db);
      }

      // Try loading the plugin
      try {
        delete require.cache[require.resolve(pluginPath)];
        require(pluginPath);
        reply(`✅ Plugin *${filename}* installed and loaded.`);
        global.log("INFO", `Plugin installed: ${filename}`);
      } catch (loadErr) {
        reply(`⚠️ Plugin *${filename}* saved, but failed to load. Check console.`);
        global.log("ERROR", `Plugin load error: ${loadErr.message}`);
      }
    } catch (err) {
      global.log("ERROR", `Plugin install failed: ${err.message}`);
      reply("❌ Failed to install plugin. Invalid URL or network error.");
    }
  },
};