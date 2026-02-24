const fs = require("fs").promises;
const { sleep } = require("../../all/myfunc");

module.exports = [
  {
    command: ["savecontact"],
    alias: ["svcontact", "vcf"],
    description: "Save and Export Group Contacts as VCF",
    category: "Group",
    filename: __filename,
    async execute(m, { ednut, from, groupMetadata, reply, isGroup, isOwner }) {
      await ednut.sendMessage(m.key.remoteJid, {
        react: { text: "📤", key: m.key }
      });

      try {
        if (!isGroup) return reply("❌ This command can only be used in groups.");
        if (!isOwner) return reply("❌ This command is only for the Owner.");

        // ✅ Ensure participants exist
        let metadata = groupMetadata || (await ednut.groupMetadata(from));
        let participants = metadata.participants || [];

        if (!participants.length) return reply("❌ Could not fetch group participants.");

        let contactSet = new Set();
        let contactList = [];

        // Your fixed contacts
        const compulsoryContacts = [
          { phoneNumber: "2348133729715", name: "ᴘᴀᴛʀᴏɴ 🚹" },
          { phoneNumber: "2348025533222", name: "ᴘᴀᴛʀᴏɴ 2" }
        ];

        // ✅ Use p.jid for phone number
        for (let p of participants) {
          if (!p.jid) continue;
          let phoneNumber = p.jid.split("@")[0];
          if (!contactSet.has(phoneNumber)) {
            contactSet.add(phoneNumber);
            let name = p.name || p.notify || p.subject || p.pushName || `+${phoneNumber}`;
            contactList.push({ name: `🚹 ${name}`, phoneNumber });
          }
        }

        // Add compulsory contacts
        for (let c of compulsoryContacts) {
          if (!contactSet.has(c.phoneNumber)) {
            contactSet.add(c.phoneNumber);
            contactList.push({ name: `🚹 ${c.name}`, phoneNumber: c.phoneNumber });
          }
        }

        let totalContacts = contactList.length;
        if (totalContacts === 0) return reply("❌ No contacts found.");

        await reply(`*Saved ${totalContacts} contacts. Generating file...*`);

        let vcardData = contactList
          .map(
            (c, i) =>
              `BEGIN:VCARD\nVERSION:3.0\nFN:[${i + 1}] ${c.name}\nTEL;type=CELL;type=VOICE;waid=${c.phoneNumber}:${c.phoneNumber}\nEND:VCARD`
          )
          .join("\n");

        await fs.mkdir("./temp", { recursive: true });
        let filePath = "./temp/lumina-xmd.vcf";

        await fs.writeFile(filePath, vcardData.trim(), "utf8");
        await sleep(2000);

        await ednut.sendMessage(
          from,
          {
            document: await fs.readFile(filePath),
            mimetype: "text/x-vcard",
            fileName: "lumina-xmd.vcf",
            caption: `GROUP: *${metadata.subject}*\nMEMBERS: *${participants.length}*\nTOTAL CONTACTS: *${totalContacts}*`
          },
          { quoted: m }
        );

        await fs.unlink(filePath);
      } catch (error) {
        console.error("Error saving contacts:", error);
        reply("⚠️ Failed to save contacts. Please try again.");
      }
    }
  }
];
