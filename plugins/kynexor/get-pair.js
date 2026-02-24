const fetch = require("node-fetch");

module.exports = [
  {
    command: ["pair"],
    alias: ["getpair", "clonebot"],
    description: "Generate a pairing code",
    category: "Other",
    use: "<phone_number>",
    filename: __filename,
    async execute(m, { ednut, q, reply, from, prefix }) {
      try {
        if (!q) return await reply(`*Example -* ${prefix}pair 23475822XX`);

        // Remove all non-digit characters
        const digitsOnly = q.replace(/\D/g, "");

        // Check if starts with 0
        if (digitsOnly.startsWith("0")) {
          return await reply("❗Please use your country code (e.g., 234) instead of starting with 0.");
        }

        // Format the number with +
        const phoneNumber = `+${digitsOnly}`;

        const response = await fetch(`https://patron-pairing.onrender.com/pair?phone=${phoneNumber}`);
        const pair = await response.json();

        if (!pair || !pair.code) {
          return await reply("❌ Failed to retrieve pairing code. Please check the phone number and try again.");
        }

        const pairingCode = pair.code;
        const doneMessage = "> *lumina-xmd PAIR COMPLETED*";

        // First message with details
        await ednut.sendMessage(m.chat, { text: `${doneMessage}\n\n*Your pairing code is:* ${pairingCode}` }, { quoted: m });

        await new Promise((res) => setTimeout(res, 2000));

        // Just the pairing code again
        await ednut.sendMessage(m.chat, { text: `${pairingCode}` }, { quoted: m });

      } catch (error) {
        console.error(error);
        await reply("⚠️ An error occurred. Please try again later.");
      }
    },
  },
];