const fetch = require('node-fetch');
const fs = require('fs');
const { writeFileSync, unlinkSync } = require('fs');
const { join } = require('path');

// ─── Aptoide API ─────────────────────────────────────────────
const aptoide = {
  search: async (query) => {
    const res = await fetch(`https://ws75.aptoide.com/api/7/apps/search?query=${encodeURIComponent(query)}&limit=10`);
    const json = await res.json();
    return json?.datalist?.list?.map(v => ({
      name: v.name,
      size: v.size,
      version: v.file?.vername,
      id: v.package,
      download: v.stats?.downloads || "N/A"
    })) || [];
  },

  download: async (id) => {
    const res = await fetch(`https://ws75.aptoide.com/api/7/apps/search?query=${id}&limit=1`);
    const json = await res.json();
    const app = json?.datalist?.list?.[0];
    return {
      img: app.icon,
      developer: app.store.name,
      appname: app.name,
      link: app.file.path
    };
  }
};

const downloadFile = async (url) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to download: ${res.statusText}`);
  return Buffer.from(await res.arrayBuffer());
};

// ─── Plugin Export ───────────────────────────────────────────
module.exports = [
  {
    command: ["apk"],
    description: "Search and download APK from Aptoide",
    category: "Downloader",
    async execute(m, { ednut, text, reply }) {
      if (!text) {
        return reply(`Enter app name\n\nExample:\n${prefix}apk whatsapp`);
      }

      ednut.apk = ednut.apk || {};

      // ── Handle Number Input (e.g., apk 2) ──
      if (text.length <= 2 && !isNaN(text) && m.sender in ednut.apk) {
        const dt = ednut.apk[m.sender];

        // ✅ Immediately clear saved search
        if (dt.time) clearTimeout(dt.time);
        delete ednut.apk[m.sender];

        if (dt.download) return reply('You are already downloading an app!');

        try {
          dt.download = true;

          const data = await aptoide.download(dt.data[text - 1].id);

          const caption = `⚡ *App Name:* ${data.appname}\n*Developer:* ${data.developer}\n\n_Wait while the app is being sent..._`;

          const reyz = await ednut.sendFile(m.chat, data.img, `${data.appname}.jpg`, caption, m);

          const dl = await downloadFile(data.link);
          const filePath = join(__dirname, `${data.appname}.apk`);
          writeFileSync(filePath, dl);

          await ednut.sendMessage(m.chat, {
            document: { url: filePath },
            fileName: `${data.appname}.apk`,
            mimetype: 'application/vnd.android.package-archive'
          }, { quoted: reyz });

          // ✅ Auto-delete APK file
          try {
            unlinkSync(filePath);
          } catch (e) {
            console.warn(`Could not delete ${filePath}:`, e.message);
          }

        } catch (e) {
          reply("❌ Failed to download the APK.");
          console.error("APK Download Error:", e.message);
        } finally {
          dt.download = false;
        }

      } else {
        // ── Handle Search ──
        const data = await aptoide.search(text);
        if (!data.length) return reply("❌ No results found.");

        const caption = data.map((v, i) => (
          `${i + 1}. ${v.name}\n• Size: ${v.size}\n• Version: ${v.version}\n• Download: ${v.download}\n• ID: ${v.id}`
        )).join('\n\n');

        const header = `_Reply with a number to download the app (1 - ${data.length})_\nExample: *${prefix}apk 2*`;

        reply(header + '\n\n' + caption);
      };
    }
  }
];