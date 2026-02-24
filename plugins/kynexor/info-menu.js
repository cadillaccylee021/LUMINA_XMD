const os = require("os");
const moment = require("moment-timezone");
const { sizeFormatter } = require("human-readable");

function smallCaps(text) {
  const map = {
    a: 'ᴀ', b: 'ʙ', c: 'ᴄ', d: 'ᴅ', e: 'ᴇ', f: 'ғ', g: 'ɢ',
    h: 'ʜ', i: 'ɪ', j: 'ᴊ', k: 'ᴋ', l: 'ʟ', m: 'ᴍ', n: 'ɴ',
    o: 'ᴏ', p: 'ᴘ', q: 'ǫ', r: 'ʀ', s: 's', t: 'ᴛ', u: 'ᴜ',
    v: 'ᴠ', w: 'ᴡ', x: 'x', y: 'ʏ', z: 'ᴢ'
  };
  return text.toLowerCase().split("").map(c => map[c] || c).join("");
}

const welDate = moment.tz(global.timezone).format("DD/MM/YYYY");
const formatp = sizeFormatter({
  std: 'JEDEC',
  decimalPlaces: 2,
  keepTrailingZeroes: false,
  render: (literal, symbol) => `${literal} ${symbol}B`,
});

const run = seconds => {
  seconds = Number(seconds);
  const d = Math.floor(seconds / (3600 * 24));
  const h = Math.floor((seconds % (3600 * 24)) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  return [d && `${d}d`, h && `${h}h`, m && `${m}m`, s && `${s}s`].filter(Boolean).join(" ");
};

const getTime = (format = "HH:mm:ss", date) =>
  date ? moment(date).format(format) : moment.tz(global.timezone).format(format);

module.exports = {
  command: ['menu'],
  alias: ['allmenu'],
  description: 'Show bot menu command list',
  ban: true,
  gcban: true,

  execute: async (m, { ednut, commands, text }) => {
    const disabledCommands = Array.isArray(global.db.disabled)
      ? global.db.disabled.filter(Boolean).map(v => v.toLowerCase())
      : [];

    const inputCategory = text?.trim()?.split(" ")[0]?.toLowerCase();

    let totalEnabledCommands = 0;
    const categories = {
      EnvManager: [], Info: [], Fun: [], Ai: [], Group: [], Owner: [], Other: [], Logo: [],
      Search: [], Converter: [], Maker: [], Game: [], Tool: [], Downloader: [],
      Wa: [], External: [], Nsfw: [], Settings: [], Privacy: [] // ✅ added Privacy here
    };

    commands.forEach(cmd => {
      const category = cmd.category || "Info";
      const cmds = Array.isArray(cmd.command) ? cmd.command : [cmd.command];
      const isDisabled = cmds.some(c => c && disabledCommands.includes(c.toLowerCase()));
      if (categories[category] && !isDisabled) {
        cmds.filter(Boolean).forEach(c => categories[category].push(c));
        totalEnabledCommands += cmds.filter(Boolean).length;
      }
    });

    const allCategoryKeys = Object.keys(categories);
    const selectedCategories = inputCategory
      ? allCategoryKeys.filter(cat => typeof cat === 'string' && cat.toLowerCase() === inputCategory)
      : allCategoryKeys;

    const categoryHasCommand = selectedCategories.some(cat => categories[cat].length > 0);
    if (inputCategory && (!selectedCategories.length || !categoryHasCommand)) return;

    const userName = m.pushName || "User";
    const memoryUsed = formatp(os.totalmem() - os.freemem());
    const uptime = run(process.uptime());
    const currentTime = getTime();

    let archmenu = `╔═━〔 *${smallCaps(global.botname)}* 〕━═╗
│ 👤 ${smallCaps("User")}: ${userName}
│ 📡 ${smallCaps("Ping")}: ${Date.now() - m.messageTimestamp * 1000} ms
│ ⏰ ${smallCaps("Time")}: ${currentTime}
│ 📅 ${smallCaps("Date")}: ${welDate}
│ 🧩 ${smallCaps("Commands")}: ${totalEnabledCommands}
│ 💾 ${smallCaps("Memory")}: ${memoryUsed}
│ ⏳ ${smallCaps("Uptime")}: ${uptime}
╚═════════════════════╝\n\n`;

    const categoryEmoji = {
      Envmanager: "🛠️",
      Info: "ℹ️",
      Fun: "🎉",
      Ai: "🤖",
      Group: "👥",
      Owner: "👑",
      Other: "📦",
      Logo: "🎨",
      Search: "🔎",
      Converter: "🔄",
      Maker: "🖌️",
      Game: "🎮",
      Tool: "🛠️",
      Downloader: "⬇️",
      Wa: "📱",
      External: "🌐",
      Nsfw: "🔞",
      Settings: "⚙️",
      Privacy: "🔐" // ✅ added Privacy emoji
    };

    // Render categories in order, but force Privacy to the bottom
    const orderedCategories = selectedCategories.filter(c => c !== "Privacy");
    orderedCategories.push("Privacy");

    orderedCategories.forEach(category => {
      if (categories[category].length > 0) {
        archmenu += `╭── ${categoryEmoji[category] || ""} ${smallCaps(category)} ──╮\n`;
        const uniqueCmds = [...new Set(categories[category])].sort();
        uniqueCmds.forEach(cmd => {
          archmenu += `│ • ${global.prefix}${smallCaps(cmd)}\n`;
        });
        archmenu += `╰──────────╯\n\n`;
      }
    });

    await ednut.sendMessage(m.chat, { text: archmenu }, { quoted: m });
  }
};