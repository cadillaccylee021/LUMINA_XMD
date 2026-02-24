const fs = require("fs");
const path = require("path");

// Helper to update .env and process.env
function updateEnv(key, value) {
  const envPath = path.resolve(__dirname, "../../.env");
  let envFile = fs.readFileSync(envPath, "utf8");

  if (new RegExp(`^${key}=`, "m").test(envFile)) {
    envFile = envFile.replace(new RegExp(`^${key}=.*`, "m"), `${key}=${value}`);
  } else {
    envFile += `\n${key}=${value}`;
  }

  fs.writeFileSync(envPath, envFile);
  process.env[key] = value;
}

// Whitelist of allowed environment keys with descriptions
const allowedKeysInfo = {
  OWNER_NUMBER: "Your WhatsApp number in international format, e.g., 2348012345678",
  BOT_NAME: "The bot's display name, e.g., ᴘᴀᴛʀᴏɴ ᴍᴅ",
  OWNER_NAME: "Your name or display name, e.g., lumina",
  PACK_NAME: "Sticker pack name, e.g., MyPack",
  PREFIX: "Command prefix, choose from: ., !, ?, /, ,, *, +",
  WARN: "Maximum number of warnings allowed, e.g., 3 or 4"
};

const allowedKeys = Object.keys(allowedKeysInfo);
const allowedPrefixes = [".", "!", "?", "/", ",", "*", "+"];

module.exports = [
  {
    command: ["setenv"],
    alias: ["updateenv"],
    description: "Update bot settings",
    category: "EnvManager",
    use: "<key> <value>",
    filename: __filename,

    async execute(m, { q, reply, isOwner }) {
      if (!isOwner) {
        return reply("❌ Only the bot owner can use this command.");
      }

      if (!q) {
        let usageText = "❌ Usage: setenv <key> <value>\n✅ Allowed keys:\n";
        allowedKeys.forEach(k => {
          usageText += `• ${k}: ${allowedKeysInfo[k]}\n`;
        });
        usageText += "\nExample: .setenv BOT_NAME ᴘᴀᴛʀᴏɴ ᴍᴅ";
        return reply(usageText);
      }

      const [key, ...rest] = q.split(" ");
      let value = rest.join(" ").trim();
      const keyUpper = key.toUpperCase();

      if (!keyUpper || !value) {
        let usageText = "❌ Usage: setenv <key> <value>\n✅ Allowed keys:\n";
        allowedKeys.forEach(k => {
          usageText += `• ${k}: ${allowedKeysInfo[k]}\n`;
        });
        usageText += "\nExample: .setenv BOT_NAME ᴘᴀᴛʀᴏɴ ᴍᴅ";
        return reply(usageText);
      }

      if (!allowedKeys.includes(keyUpper)) {
        return reply(`❌ Key not allowed. Allowed keys: ${allowedKeys.join(", ")}`);
      }

      // ✅ Clean OWNER_NUMBER (remove "+" if present)
      if (keyUpper === "OWNER_NUMBER") {
        value = value.replace(/^\+/, "");
        if (!/^\d+$/.test(value)) {
          return reply("❌ Invalid number format. Please enter digits only, e.g., 2348012345678");
        }
      }

      // Validate PREFIX values
      if (keyUpper === "PREFIX" && !allowedPrefixes.includes(value)) {
        return reply(`❌ Invalid prefix. Allowed values: ${allowedPrefixes.join(" ")}`);
      }

      updateEnv(keyUpper, value);
      await reply(`✅ ${keyUpper} updated to: ${value}\n♻️ Restarting bot...`);
      process.exit(0);
    },
  },
  {
    command: ["getenv"],
    alias: ["envinfo", "showenv"],
    description: "Show current bot settings",
    category: "EnvManager",
    filename: __filename,

    async execute(m, { reply }) {
      const info = `
🌍 *Environment Config*
──────────────────────────
👑 OWNER_NUMBER: ${process.env.OWNER_NUMBER || "Not set"}
🤖 BOT_NAME: ${process.env.BOT_NAME || "Not set"}
🙍 OWNER_NAME: ${process.env.OWNER_NAME || "Not set"}
📦 PACK_NAME: ${process.env.PACK_NAME || "Not set"}
📌 PREFIX: ${process.env.PREFIX || "Not set"}
⚠️ WARN: ${process.env.WARN || "Not set"}
──────────────────────────
      `.trim();

      await reply(info);
    },
  },
];