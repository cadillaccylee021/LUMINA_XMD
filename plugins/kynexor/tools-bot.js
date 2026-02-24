const translate = require('translate-google-api')

module.exports = [
  {
    command: "translate",
    alias: ["trt"],
    description: "Translate text into another language",
    category: "Tool",
    ban: true,
    gcban: true,
    execute: async (m, { text, args, ednut, example }) => {
      const defaultLang = "en"
      let language, teks

      if (!text && !m.quoted) return m.reply(example("en good night"))

      if (text && !m.quoted) {
        if (args.length < 2) return m.reply(example("en good night"))
        language = args[0]
        teks = text.split(" ").slice(1).join(" ")
      } else if (m.quoted && m.quoted.text) {
        if (!args[0]) return m.reply(example("en good night"))
        language = args[0]
        teks = m.quoted.text
      } else {
        return m.reply(example("en good night"))
      }

      try {
        const result = await translate(teks, { to: language })
        m.reply(result[0])
      } catch (e) {
        global.log("ERROR", `translate plugin: ${e.message || e}`)
        try {
          const result = await translate(teks, { to: defaultLang })
          m.reply(result[0])
        } catch (err) {
          global.log("ERROR", `translate fallback: ${err.message || err}`)
          m.reply("Failed to translate the text.")
        }
      }
    }
  },
  {
    command: ["dictionary"],
    alias: ["define", "meaning"],
    description: "Get the definition of an English word",
    category: "Tool",
    ban: true,
    gcban: true,
    execute: async (m, { text, ednut, fetch }) => {
      try {
        const word = text.trim();
        if (!word) return m.reply("Please provide a word to define.");

        const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`);
        if (!res.ok) return m.reply("Word not found or invalid.");

        const data = await res.json();
        const entry = data[0];

        let reply = `*Definition of "${entry.word}"*\n`;

        const phonetic = entry.phonetics.find(p => p.text) || {};
        if (phonetic.text) reply += `Pronunciation: _${phonetic.text}_\n`;

        entry.meanings.slice(0, 2).forEach((meaning, idx) => {
          reply += `\n${idx + 1}. *${meaning.partOfSpeech}*\n`;
          meaning.definitions.slice(0, 2).forEach(def => {
            reply += `- ${def.definition}\n`;
            if (def.example) reply += `  _e.g._ "${def.example}"\n`;
          });
        });

        const synonyms = entry.meanings.flatMap(m => m.synonyms).filter(Boolean);
        const antonyms = entry.meanings.flatMap(m => m.antonyms).filter(Boolean);

        if (synonyms.length) {
          reply += `\nSynonyms: ${[...new Set(synonyms)].slice(0, 5).join(", ")}`;
        }
        if (antonyms.length) {
          reply += `\nAntonyms: ${[...new Set(antonyms)].slice(0, 5).join(", ")}`;
        }

        await ednut.sendMessage(m.chat, { text: reply.trim() }, { quoted: m });

        const audioUrl = entry.phonetics.find(p => p.audio)?.audio;
        if (audioUrl) {
          await ednut.sendMessage(m.chat, {
            audio: { url: audioUrl },
            mimetype: 'audio/mp4',
            ptt: true
          }, { quoted: m });
        }

      } catch (e) {
        global.log("ERROR", `dictionary plugin: ${e.message || e}`);
        m.reply("Failed to fetch definition.");
      }
    }
  },
  {command: "getpp",
  alias: ["pfp", "pp"],
  description: "Get profile picture of a user",
  category: "Privacy",
  ban: true,
  gcban: true,
  execute: async (m, { ednut, text, reply }) => {
    try {
      // Check if user provided input
      let users = m.mentionedJid?.[0] ||
        (m.quoted ? m.quoted.sender : (text ? text.replace(/[^0-9]/g, '') + '@s.whatsapp.net' : null));
      
      if (!users) {
        return reply("❎ Please mention a user, reply to their message, or enter their number.");
      }
      
      let avatar;
      try {
        avatar = await ednut.profilePictureUrl(users, "image");
      } catch {
        avatar = 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png?q=60';
      }
      
      await ednut.sendMessage(m.chat, {
        image: { url: avatar },
        caption: `Profile picture of @${users.split('@')[0]}`,
        contextInfo: { mentionedJid: [users] }
      }, { quoted: m });
      
    } catch (e) {
      global.log("ERROR", `pfp plugin: ${e.message || e}`);
      reply("Failed to fetch profile picture.");
    }
  }},
  {
  command: "weather",
  alias: ["forecast"],
  description: "Get weather info for a location",
  category: "Tool",
  ban: true,
  gcban: true,
  execute: async (m, { text, ednut, example, axios }) => {
    if (!text) return m.reply(example('location'));
    try {
      let wdata = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${text}&units=metric&appid=060a6bcfa19809c2cd4d97a212b19273&language=en`
      );
      let info = wdata.data;

      let textw = `🌍 *Weather Report* 🌍\n\n`;
      textw += `📍 *Location:* ${info.name}, ${info.sys.country}\n`;
      textw += `🗺️ *Coordinates:* ${info.coord.lat}, ${info.coord.lon}\n\n`;

      textw += `🌤️ *Condition:* ${info.weather[0].main}\n`;
      textw += `📝 *Description:* ${info.weather[0].description}\n\n`;

      textw += `🌡️ *Temperature:* ${info.main.temp}°C\n`;
      textw += `🤔 *Feels Like:* ${info.main.feels_like}°C\n`;
      textw += `💧 *Humidity:* ${info.main.humidity}%\n`;
      textw += `🌀 *Wind Speed:* ${info.wind.speed} m/s\n`;
      textw += `⏲️ *Pressure:* ${info.main.pressure} hPa\n\n`;

      // ➡️ Footer / credit
      textw += `> *© Powered By ᴘᴀᴛʀᴏɴTᴇᴄʜＸ*`;

      await ednut.sendMessage(m.chat, { text: textw }, { quoted: m });
    } catch (e) {
      global.log("ERROR", `weather plugin: ${e.message || e}`);
      m.reply("❌ Failed to fetch weather data. Please check the location and try again.");
    }
  }
},

  {
    command: "fancy",
    alias: ["styletext"],
    description: "Convert text to fancy styles",
    category: "Tool",
    ban: true,
    gcban: true,
    execute: async (m, { text, ednut, prefix, example, styletext }) => {
      try {
        if (!text) return m.reply(example('Enter query text!'));
        let args = text.split(' ');
        let styleNumber = parseInt(args[0]);
        let query = text.replace(args[0], '').trim();

        if (isNaN(styleNumber) || !query) {
          let styles = await styletext(text);
          let teks = `Example: ${prefix}fancy 2 hello\n\nStyles for: ${text}\n\n`;
          for (let i = 0; i < styles.length; i++) {
            teks += `${i + 1}. ${styles[i].name} : ${styles[i].result}\n\n`;
          }
          return m.reply(teks);
        }

        let styles = await styletext(query);
        if (styleNumber && styles[styleNumber - 1]) {
          return m.reply(styles[styleNumber - 1].result);
        } else {
          return m.reply('Invalid style number.');
        }
      } catch (e) {
        global.log("ERROR", `fancy plugin: ${e.message || e}`);
        m.reply("Failed to convert text.");
      }
    }
  }
]