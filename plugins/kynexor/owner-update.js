const axios = require('axios');
const fs = require('fs');
const path = require("path");
const AdmZip = require("adm-zip");
const { Sequelize, DataTypes } = require('sequelize');

module.exports = {
  command: "update",
  alias: ["upgrade", "sync"],
  description: "Update the bot to the latest version.",
  category: "Owner",
  filename: __filename,

  async execute(m, { ednut, reply, isOwner }) {
    if (!isOwner) return reply("*📛 This command is restricted to owners only.*");

    await ednut.sendMessage(m.chat, {
      react: { text: "🔄", key: m.key }
    });

    const stylish = (text, emoji) => `*${emoji} 卄 ${text} 卄 ${emoji}*`;
    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    // Initialize SQLite DB for commit hash
    const DATABASE = new Sequelize({
      dialect: 'sqlite',
      storage: path.join(__dirname, 'update.db'),
      logging: false
    });

    const UpdateDB = DATABASE.define('UpdateInfo', {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: false, defaultValue: 1 },
      commitHash: { type: DataTypes.STRING, allowNull: false },
    }, { tableName: 'update_info', timestamps: false });

    await UpdateDB.sync();

    async function getCommitHash() {
      const record = await UpdateDB.findByPk(1);
      return record ? record.commitHash : 'unknown';
    }

    async function setCommitHash(hash) {
      let record = await UpdateDB.findByPk(1);
      if (!record) record = await UpdateDB.create({ id: 1, commitHash: hash });
      else record.commitHash = hash;
      await record.save();
    }

    try {
      await reply(stylish("Checking lumina-xmd", "🔍"));

      const { data: commitData } = await axios.get(
        "https://api.github.com/repos/Itzpatron/lumina-xmd3/commits/main"
      );

      const currentHash = await getCommitHash();
      if (currentHash === commitData.sha) {
        return reply(stylish("Already latest version", "✅"));
      }

      await reply(stylish("Updating lumina-xmd", "⚡"));



    // Set zip and temp paths to one directory up (project root)
    const projectRoot = path.resolve(__dirname, '..', '..');
    const zipPath = path.join(projectRoot, "update_temp.zip");
    const tempUpdatePath = path.join(projectRoot, 'temp_update');

      fs.writeFileSync(
        zipPath,
        (await axios.get("https://github.com/Itzpatron/lumina-xmd3/archive/main.zip", {
          responseType: "arraybuffer"
        })).data
      );

      new AdmZip(zipPath).extractAllTo(tempUpdatePath, true);



      copyFolderSync(
        path.join(tempUpdatePath, 'lumina-xmd3-main'),
        projectRoot
      );

      await setCommitHash(commitData.sha);

      fs.unlinkSync(zipPath);
      fs.rmSync(tempUpdatePath, { recursive: true });

      await reply(stylish("✅ Updated! Restarting now...", "🔄"));
      await sleep(1000);
      process.exit(0);

    } catch (error) {
      console.error("Update error:", error);
      reply(stylish("Update failed", "❌"));
    }
  }
};

function copyFolderSync(source, target) {
  if (!fs.existsSync(source)) return;
  fs.existsSync(target) || fs.mkdirSync(target, { recursive: true });

  fs.readdirSync(source).forEach(item => {
    const src = path.join(source, item);
    const dest = path.join(target, item);

    const skipFiles = ['config.js', 'app.json', '.env'];
    const isJsonFile = item.endsWith('.json');

    if (skipFiles.includes(item) || isJsonFile) return;

    fs.lstatSync(src).isDirectory()
      ? copyFolderSync(src, dest)
      : fs.copyFileSync(src, dest);
  });
}
