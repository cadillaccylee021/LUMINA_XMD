const axios = require("axios");

module.exports = [
  {
    command: ["garl"],
    alias: ["imgloli"],
    description: "Download anime loli images.",
    category: "Fun",
    filename: __filename,
    async execute(m, { ednut, from, reply }) {
      try {
        let res = await axios.get("https://api.lolicon.app/setu/v2?num=1&r18=0&tag=lolicon");
        let wm = `😎 Random Garl image

> *©ᴘᴏᴡᴇʀᴇᴅ ʙʏ Pᴀᴛʀᴏɴ TᴇᴄʜＸ 🚹*`;

        await ednut.sendMessage(from, {
          image: { url: res.data.data[0].urls.original },
          caption: wm
        }, { quoted: m });
      } catch (e) {
        reply("I can't find this anime.");
        console.error(e);
      }
    }
  },

  {
    command: ["waifu2"],
    alias: ["imgwaifu"],
    description: "Download anime waifu images (NSFW).",
    category: "Fun",
    filename: __filename,
    async execute(m, { ednut, from, reply }) {
      try {
        let res = await axios.get("https://api.waifu.pics/nsfw/waifu");
        let wm = `🚹 Random Waifu image

> *©ᴘᴏᴡᴇʀᴇᴅ ʙʏ Pᴀᴛʀᴏɴ TᴇᴄʜＸ 🚹*`;

        await ednut.sendMessage(from, {
          image: { url: res.data.url },
          caption: wm
        }, { quoted: m });
      } catch (e) {
        reply("I can't find this anime.");
        console.error(e);
      }
    }
  },

  {
    command: ["neko"],
    alias: ["imgneko"],
    description: "Download anime neko images.",
    category: "Fun",
    filename: __filename,
    async execute(m, { ednut, from, reply }) {
      try {
        let res = await axios.get("https://api.waifu.pics/nsfw/neko");
        let wm = `🚹 Random neko image

> *©ᴘᴏᴡᴇʀᴇᴅ ʙʏ Pᴀᴛʀᴏɴ TᴇᴄʜＸ 🚹*`;

        await ednut.sendMessage(from, {
          image: { url: res.data.url },
          caption: wm
        }, { quoted: m });
      } catch (e) {
        reply("I can't find this anime.");
        console.error(e);
      }
    }
  },

  {
    command: ["megumin"],
    alias: ["imgmegumin"],
    description: "Download anime megumin images.",
    category: "Fun",
    filename: __filename,
    async execute(m, { ednut, from, reply }) {
      try {
        let res = await axios.get("https://api.waifu.pics/sfw/megumin");
        let wm = `❤️‍🔥 Random megumin image

> *©ᴘᴏᴡᴇʀᴇᴅ ʙʏ Pᴀᴛʀᴏɴ TᴇᴄʜＸ 🚹*`;

        await ednut.sendMessage(from, {
          image: { url: res.data.url },
          caption: wm
        }, { quoted: m });
      } catch (e) {
        reply("I can't find this anime.");
        console.error(e);
      }
    }
  },

  {
    command: ["maid"],
    alias: ["imgmaid"],
    description: "Download anime maid images.",
    category: "Fun",
    filename: __filename,
    async execute(m, { ednut, from, reply }) {
      try {
        let res = await axios.get("https://api.waifu.im/search/?included_tags=maid");
        let wm = `😎 Random maid image

> *©ᴘᴏᴡᴇʀᴇᴅ ʙʏ Pᴀᴛʀᴏɴ TᴇᴄʜＸ 🚹*`;

        await ednut.sendMessage(from, {
          image: { url: res.data.images[0].url },
          caption: wm
        }, { quoted: m });
      } catch (e) {
        reply("I can't find this anime.");
        console.error(e);
      }
    }
  },

  {
    command: ["awoo"],
    alias: ["imgawoo"],
    description: "Download anime awoo images.",
    category: "Fun",
    filename: __filename,
    async execute(m, { ednut, from, reply }) {
      try {
        let res = await axios.get("https://api.waifu.pics/sfw/awoo");
        let wm = `😎 Random awoo image

> *©ᴘᴏᴡᴇʀᴇᴅ ʙʏ Pᴀᴛʀᴏɴ TᴇᴄʜＸ 🚹*`;

        await ednut.sendMessage(from, {
          image: { url: res.data.url },
          caption: wm
        }, { quoted: m });
      } catch (e) {
        reply("I can't find this anime.");
        console.error(e);
      }
    }
  },

  {
    command: ["animegirl"],
    alias: ["imganimegirl"],
    description: "Fetch a random anime girl image.",
    category: "Fun",
    filename: __filename,
    async execute(m, { ednut, from, reply }) {
      try {
        let res = await axios.get("https://api.waifu.pics/nsfw/waifu");
        await ednut.sendMessage(from, {
          image: { url: res.data.url },
          caption: "*ANIME GIRL IMAGE* 🥳\n\n\n> *© ᴘᴏᴡᴇʀᴇᴅ ʙʏ Pᴀᴛʀᴏɴ TᴇᴄʜＸ 🚹*"
        }, { quoted: m });
      } catch (e) {
        reply(`*Error Fetching Anime Girl image*: ${e.message}`);
      }
    }
  },

  {
    command: ["waifu"],
    alias: ["imgwaifu2"],
    description: "Download anime waifu images.",
    category: "Fun",
    filename: __filename,
    async execute(m, { ednut, from, reply }) {
      try {
        let res = await axios.get("https://api.waifu.pics/sfw/waifu");
        await ednut.sendMessage(from, {
          image: { url: res.data.url },
          caption: "RANDOM WAIFU IMAGE 👾\n\n\n> *© ᴘᴏᴡᴇʀᴇᴅ ʙʏ Pᴀᴛʀᴏɴ TᴇᴄʜＸ 🚹*"
        }, { quoted: m });
      } catch (e) {
        reply(`*Error Fetching Anime Girl image*: ${e.message}`);
      }
    }
  }
];