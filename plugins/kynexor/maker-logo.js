module.exports = [
  {
    command: ["wanted"],
    description: "Create a wanted poster also reply to someone's message to use the profile picture",
    category: "Logo",
    ban: true,
    gcban: true,
    execute: async (m, { ednut, uploadImage, reply }) => {
      try {
        if (!m.quoted) return reply(`Reply to an image or someone's message to create a wanted poster.`)
        let buffer
        if (m.quoted && m.quoted.mtype === 'imageMessage') {
          buffer = await ednut.downloadMediaMessage(m.quoted)
        } else {
          let sender = m.quoted ? m.quoted.sender : m.sender
          let imageUrl = await ednut.profilePictureUrl(sender, 'image').catch(() => 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png')
          let response = await fetch(imageUrl)
          buffer = await response.arrayBuffer()
          buffer = Buffer.from(buffer)
        }
        let image = await uploadImage(buffer)
        let wanted = `https://api.popcat.xyz/v2/wanted?image=${image}`
        await ednut.sendMessage(m.chat, { image: { url: wanted }, caption: `${global.footer}`}, { quoted: m })
      } catch (error) {
        global.log("ERROR", `wanted plugin: ${error.message || error}`);
      }
    }
  },
  {
    command: ["jail"],
    description: "Create a jail poster also reply to someone's message to use the profile picture",
    category: "Logo",
    ban: true,
    gcban: true,
    execute: async (m, { ednut, uploadImage, reply }) => {
      try {
        if (!m.quoted) return reply(`Reply to an image or someone's message to create a jail poster.`)
        let buffer
        if (m.quoted && m.quoted.mtype === 'imageMessage') {
          buffer = await ednut.downloadMediaMessage(m.quoted)
        } else {
          let sender = m.quoted ? m.quoted.sender : m.sender
          let imageUrl = await ednut.profilePictureUrl(sender, 'image').catch(() => 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png')
          let response = await fetch(imageUrl)
          buffer = await response.arrayBuffer()
          buffer = Buffer.from(buffer)
        }
        let image = await uploadImage(buffer)
        let jail = `https://api.popcat.xyz/v2/jail?image=${image}`
        await ednut.sendMessage(m.chat, { image: { url: jail }, caption: `${global.footer}`}, { quoted: m })
      } catch (error) {
        global.log("ERROR", `jail plugin: ${error.message || error}`);
      }
    }
  },
  {
    command: ["nokia"],
    description: "Create a nokia poster also reply to someone's message to use the profile picture",
    category: "Logo",
    ban: true,
    gcban: true,
    execute: async (m, { ednut, uploadImage, reply }) => {
      try {
        if (!m.quoted) return reply(`Reply to an image or someone's message to create a nokia poster.`)
        let buffer
        if (m.quoted && m.quoted.mtype === 'imageMessage') {
          buffer = await ednut.downloadMediaMessage(m.quoted)
        } else {
          let sender = m.quoted ? m.quoted.sender : m.sender
          let imageUrl = await ednut.profilePictureUrl(sender, 'image').catch(() => 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png')
          let response = await fetch(imageUrl)
          buffer = await response.arrayBuffer()
          buffer = Buffer.from(buffer)
        }
        let image = await uploadImage(buffer)
        let nokia = `https://api.popcat.xyz/v2/nokia?image=${image}`
        await ednut.sendMessage(m.chat, { image: { url: nokia }, caption: `${global.footer}`}, { quoted: m })
      } catch (error) {
        global.log("ERROR", `nokia plugin: ${error.message || error}`);
      }
    }
  },
  {
    command: ["gun"],
    description: "Create a gun image poster also reply to someone's message to use the profile picture",
    category: "Logo",
    ban: true,
    gcban: true,
    execute: async (m, { ednut, uploadImage, reply }) => {
      try {
        if (!m.quoted) return reply(`Reply to an image or someone's message to create a gun poster.`)
        let buffer
        let text = m.text.split(' ').slice(1).join(' ')
        if (m.quoted && m.quoted.mtype === 'imageMessage') {
          buffer = await ednut.downloadMediaMessage(m.quoted)
        } else {
          let sender = m.quoted ? m.quoted.sender : m.sender
          let imageUrl = await ednut.profilePictureUrl(sender, 'image').catch(() => 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png')
          let response = await fetch(imageUrl)
          buffer = await response.arrayBuffer()
          buffer = Buffer.from(buffer)
        }
        let image = await uploadImage(buffer)
        let gun = `https://api.popcat.xyz/v2/gun?image=${image}`
        await ednut.sendMessage(m.chat, { image: { url: gun }, caption: `${global.footer}`}, { quoted: m })
      } catch (error) {
        global.log("ERROR", `gun plugin: ${error.message || error}`);
      }
    }
  },
  {
    command: ["ad"],
    description: "Create an ad image also reply to someone's message to use the profile picture",
    category: "Logo",
    ban: true,
    gcban: true,
    execute: async (m, { ednut, uploadImage, reply }) => {
      try {
        if (!m.quoted) return reply(`Reply to an image or someone's message to create an ad.`)
        let buffer
        if (m.quoted && m.quoted.mtype === 'imageMessage') {
          buffer = await ednut.downloadMediaMessage(m.quoted)
        } else {
          let sender = m.quoted ? m.quoted.sender : m.sender
          let imageUrl = await ednut.profilePictureUrl(sender, 'image').catch(() => 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png')
          let response = await fetch(imageUrl)
          buffer = await response.arrayBuffer()
          buffer = Buffer.from(buffer)
        }
        let image = await uploadImage(buffer)
        let ad = `https://api.popcat.xyz/v2/ad?image=${image}`
        await ednut.sendMessage(m.chat, { image: { url: ad }, caption: `${global.footer}`}, { quoted: m })
      } catch (error) {
        global.log("ERROR", `ad plugin: ${error.message || error}`);
      }
    }
  },
  {
    command: ["blur"],
    description: "Create a blur image also reply to someone's message to use the profile picture",
    category: "Logo",
    ban: true,
    gcban: true,
    execute: async (m, { ednut, uploadImage, reply }) => {
      try {
        if (!m.quoted) return reply(`Reply to an image or someone's message to create a blur image.`)
        let buffer
        if (m.quoted && m.quoted.mtype === 'imageMessage') {
          buffer = await ednut.downloadMediaMessage(m.quoted)
        } else {
          let sender = m.quoted ? m.quoted.sender : m.sender
          let imageUrl = await ednut.profilePictureUrl(sender, 'image').catch(() => 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png')
          let response = await fetch(imageUrl)
          buffer = await response.arrayBuffer()
          buffer = Buffer.from(buffer)
        }
        let image = await uploadImage(buffer)
        let blur = `https://api.popcat.xyz/v2/blur?image=${image}`
        await ednut.sendMessage(m.chat, { image: { url: blur }, caption: `${global.footer}`}, { quoted: m })
      } catch (error) {
        global.log("ERROR", `blur plugin: ${error.message || error}`);
      }
    }
  },
  {
    command: ["invert"],
    description: "Create an invert image also reply to someone's message to use the profile picture",
    category: "Logo",
    ban: true,
    gcban: true,
    execute: async (m, { ednut, uploadImage, reply }) => {
      try {
        if (!m.quoted) return reply(`Reply to an image or someone's message to create an invert image.`)
        let buffer
        if (m.quoted && m.quoted.mtype === 'imageMessage') {
          buffer = await ednut.downloadMediaMessage(m.quoted)
        } else {
          let sender = m.quoted ? m.quoted.sender : m.sender
          let imageUrl = await ednut.profilePictureUrl(sender, 'image').catch(() => 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png')
          let response = await fetch(imageUrl)
          buffer = await response.arrayBuffer()
          buffer = Buffer.from(buffer)
        }
        let image = await uploadImage(buffer)
        let invert = `https://api.popcat.xyz/v2/invert?image=${image}`
        await ednut.sendMessage(m.chat, { image: { url: invert }, caption: `${global.footer}`}, { quoted: m })
      } catch (error) {
        global.log("ERROR", `invert plugin: ${error.message || error}`);
      }
    }
  },
  {
    command: ["mnm"],
    description: "Create an M&M's image also reply to someone's message to use the profile picture",
    category: "Logo",
    ban: true,
    gcban: true,
    execute: async (m, { ednut, uploadImage, reply }) => {
      try {
        if (!m.quoted) return reply(`Reply to an image or someone's message to create an M&M's image.`)
        let buffer
        if (m.quoted && m.quoted.mtype === 'imageMessage') {
          buffer = await ednut.downloadMediaMessage(m.quoted)
        } else {
          let sender = m.quoted ? m.quoted.sender : m.sender
          let imageUrl = await ednut.profilePictureUrl(sender, 'image').catch(() => 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png')
          let response = await fetch(imageUrl)
          buffer = await response.arrayBuffer()
          buffer = Buffer.from(buffer)
        }
        let image = await uploadImage(buffer)
        let mnm = `https://api.popcat.xyz/v2/mnm?image=${image}`
        await ednut.sendMessage(m.chat, { image: { url: mnm }, caption: `${global.footer}`}, { quoted: m })
      } catch (error) {
        global.log("ERROR", `mnm plugin: ${error.message || error}`);
      }
    }
  },
  {
    command: ["caution"],
    description: "Create a caution fake logo image",
    category: "Logo",
    ban: true,
    gcban: true,
    execute: async (m, { ednut, reply }) => {
      try {
        let text = m.text.split(' ').slice(1).join(' ')
        if (!text) return reply('Please provide a text')
        let caution = `https://api.popcat.xyz/v2/caution?text=${text}`
        await ednut.sendMessage(m.chat, { image: { url: caution }, caption: `${global.footer}`, quoted: m })
      } catch (error) {
        global.log("ERROR", `caution plugin: ${error.message || error}`);
      }
    }
  }
];