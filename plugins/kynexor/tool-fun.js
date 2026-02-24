const axios = require("axios");
const fetch = require("node-fetch");


module.exports = [
  {
    command: ["joke"],
    alias: [],
    description: "😂 Get a random joke",
    category: "Fun",
    use: ".joke",
    filename: __filename,
    ban: true,
    gcban: true,
    execute: async (m, { ednut, reply }) => {
      const from = m.chat;

      try {
        const response = await axios.get("https://official-joke-api.appspot.com/random_joke");
        const joke = response.data;

        if (!joke || !joke.setup || !joke.punchline) {
          return reply("❌ Failed to fetch a joke. Please try again.");
        }

        const jokeMessage = `🤣 *Here's a random joke for you!* 🤣\n\n*${joke.setup}*\n\n${joke.punchline} 😆\n\n> *© ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴘᴀᴛʀᴏɴTᴇᴄʜＸ* 🚹`;

        return reply(jokeMessage);
      } catch (error) {
        console.error("❌ Error in joke command:", error);
        return reply("⚠️ An error occurred while fetching the joke. Please try again.");
      }
    }
  },
  {
    command: ["flirt"],
    alias: ["masom", "line"],
    description: "Get a random flirt or pickup line.",
    category: "Fun",
    use: ".flirt",
    ban: true,
    gcban: true,
    filename: __filename,
    execute: async (m, { ednut, reply }) => {
      const from = m.chat;

      try {
        // Define API key and URL
        const shizokeys = "shizo";
        const apiUrl = `https://shizoapi.onrender.com/api/texts/flirt?apikey=${shizokeys}`;

        // Fetch data from the API
        const res = await fetch(apiUrl);
        if (!res.ok) {
          throw new Error(`API error: ${await res.text()}`);
        }

        const json = await res.json();
        if (!json.result) {
          throw new Error("Invalid response from API.");
        }

        // Extract and send the flirt message
        const flirtMessage = `${json.result}`;
        await ednut.sendMessage(from, {
          text: flirtMessage,
          mentions: [m.sender],
        }, { quoted: m });

      } catch (error) {
        console.error("Error in flirt command:", error);
        reply("Sorry, something went wrong while fetching the flirt line. Please try again later.");
      }
    }
  },
  {
    command: ["truth"],
    alias: ["t"],
    description: "Get a random truth question from the API.",
    category: "Fun",
    use: ".truth",
    ban: true,
    gcban: true,
    filename: __filename,
    execute: async (m, { ednut, reply }) => {
      const from = m.chat;
      try {
        const shizokeys = "shizo";
        const res = await fetch(`https://shizoapi.onrender.com/api/texts/truth?apikey=${shizokeys}`);
        if (!res.ok) throw new Error(`API request failed with status ${res.status}`);

        const json = await res.json();
        if (!json.result) throw new Error("Invalid API response: No 'result' field found.");

        await ednut.sendMessage(from, { text: `${json.result}`, mentions: [m.sender] }, { quoted: m });
      } catch (error) {
        console.error("Error in truth command:", error);
        reply("Sorry, something went wrong while fetching the truth question. Please try again later.");
      }
    }
  },
  {
    command: ["dare"],
    alias: ["d"],
    description: "Get a random dare from the API.",
    category: "Fun",
    use: ".dare",
    filename: __filename,
    ban: true,
    gcban: true,
    execute: async (m, { ednut, reply }) => {
      const from = m.chat;
      try {
        const shizokeys = "shizo";
        const res = await fetch(`https://shizoapi.onrender.com/api/texts/dare?apikey=${shizokeys}`);
        if (!res.ok) throw new Error(`API request failed with status ${res.status}`);

        const json = await res.json();
        if (!json.result) throw new Error("Invalid API response: No 'result' field found.");

        await ednut.sendMessage(from, { text: `${json.result}`, mentions: [m.sender] }, { quoted: m });
      } catch (error) {
        console.error("Error in dare command:", error);
        reply("Sorry, something went wrong while fetching the dare. Please try again later.");
      }
    }
  },
  {
    command: ["fact"],
    alias: [],
    description: "🧠 Get a random fun fact",
    category: "Fun",
    use: ".fact",
    filename: __filename,
    ban: true,
    gcban: true,
    execute: async (m, { ednut, reply }) => {
      const from = m.chat;
      try {
        const response = await axios.get("https://uselessfacts.jsph.pl/random.json?language=en");
        const fact = response.data.text;

        if (!fact) return reply("❌ Failed to fetch a fun fact. Please try again.");

        const factMessage = `🧠 *Random Fun Fact* 🧠\n\n${fact}\n\nIsn't that interesting? 😄\n\n> *© ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴘᴀᴛʀᴏɴTᴇᴄʜＸ* 🚹`;
        return reply(factMessage);
      } catch (error) {
        console.error("❌ Error in fact command:", error);
        return reply("⚠️ An error occurred while fetching a fun fact. Please try again later.");
      }
    }
  },
  {
    command: ["pickupline"],
    alias: ["pickup"],
    description: "Get a random pickup line from the API.",
    category: "Fun",
    use: ".pickupline",
    filename: __filename,
    ban: true,
    gcban: true,
    execute: async (m, { ednut, reply }) => {
      const from = m.chat;
      try {
        const res = await fetch('https://api.popcat.xyz/pickuplines');
        if (!res.ok) throw new Error(`API request failed with status ${res.status}`);

        const json = await res.json();
        const pickupLine = `*Here's a pickup line for you:*\n\n"${json.pickupline}"\n\n> *© ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴘᴀᴛʀᴏɴTᴇᴄʜＸ* 🚹`;

        await ednut.sendMessage(from, { text: pickupLine }, { quoted: m });
      } catch (error) {
        console.error("Error in pickupline command:", error);
        reply("Sorry, something went wrong while fetching the pickup line. Please try again later.");
      }
    }
  },
  {
    command: ["character"],
    alias: ["char"],
    description: "Check the character of a mentioned user.",
    category: "Fun",
    use: "<@mention>",
    filename: __filename,
    ban: true,
    gcban: true,
    execute: async (m, { ednut, isGroup, reply }) => {
      const from = m.chat;
      try {
        if (!isGroup) return reply("This command can only be used in groups.");

        const mentionedUser = m.message.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
        if (!mentionedUser) return reply("Please mention a user whose character you want to check.");

        const userChar = [
          "Sigma","Generous","Grumpy","Overconfident","Obedient","Good","Simp","Kind",
          "Patient","Pervert","Cool","Helpful","Brilliant","Sexy","Hot","Gorgeous","Cute"
        ];

        const userCharacterSelection = userChar[Math.floor(Math.random() * userChar.length)];
        const message = `Character of @${mentionedUser.split("@")[0]} is *${userCharacterSelection}* 🔥⚡`;

        await ednut.sendMessage(from, { text: message, mentions: [mentionedUser] }, { quoted: m });
      } catch (e) {
        console.error("Error in character command:", e);
        reply("An error occurred while processing the command. Please try again.");
      }
    }
  },
  {
    command: ["repeat"],
    alias: ["rp", "rpm"],
    description: "Repeat a message a specified number of times.",
    category: "Fun",
    use: "<count>,<message>",
    filename: __filename,
    ban: true,
    gcban: true,
    execute: async (m, { reply, args }) => {
      try {
        if (!args[0]) return reply("✳️ Use this command like:\n*Example:* .repeat 10,I love you");

        const [countStr, ...messageParts] = args.join(" ").split(",");
        const count = parseInt(countStr.trim());
        const message = messageParts.join(",").trim();

        if (isNaN(count) || count <= 0 || count > 300) return reply("❎ Please specify a valid number between 1 and 300.");
        if (!message) return reply("❎ Please provide a message to repeat.");

        const repeatedMessage = Array(count).fill(message).join("\n");
        reply(`🔄 Repeated ${count} times:\n\n${repeatedMessage}`);
      } catch (error) {
        console.error("❌ Error in repeat command:", error);
        reply("❎ An error occurred while processing your request.");
      }
    }
  }
];
