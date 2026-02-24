module.exports = [
  {
    command: ["setcmd"],
    description: "Set a hidden command for a sticker",
    category: "Wa",
    ban: true,
    gcban: true,
    owner: true,
    execute: async (m, { ednut, text, isOwner, isGroup }) => {
      global.db.sticker = global.db.sticker || {};
      if (!m.quoted || m.quoted.mtype !== 'stickerMessage') return m.reply('Reply a sticker');
      if (!m.quoted.fileSha256) return m.reply('This sticker doesn\'t support fileSha256');
      if (!text) return m.reply('Provide a text');
      let hash = m.quoted.fileSha256.toString('hex');
      if (global.db.sticker[hash] && global.db.sticker[hash].locked) return m.reply('You do not have permission to change this sticker command.');
      global.db.sticker[hash] = {
        text,
        mentionedJid: m.mentionedJid,
        creator: m.sender,
        at: +new Date(),
        locked: false,
      };
      m.reply('Success!');
      return;
    }
  },
  {
    command: ["delcmd"],
    description: "Delete a command for a sticker",
    category: "Wa",
    ban: true,
    gcban: true,
    owner: true,
    execute: async (m, { ednut, text, isOwner, isGroup }) => {
      let hash = text;
      if (m.quoted && m.quoted.fileSha256) hash = m.quoted.fileSha256.toString('hex');
      if (!hash) return m.reply('Hash not found');
      let sticker = global.db.sticker;
      if (sticker[hash] && sticker[hash].locked) return m.reply('You dont have permission to delete this sticker command');
      delete sticker[hash];
      m.reply('Success!');
      return;
    }
  }
]