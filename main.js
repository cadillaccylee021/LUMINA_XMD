

// ❗️Global error logging
// 📦 Core requires
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// 🌐 Minimal server to keep the bot alive (for Render/Railway)
app.get('/', (_, res) => res.send('Bot is running!'));
app.listen(port); // ✅ Place this right after defining port

// ⚠️ Global error handlers
process.once("uncaughtException", function (err) {
  const e = String(err || "");
  const ignoreErrors = [
    "conflict", "Socket connection timeout", "not-authorized", "already-exists", "rate-overlimit",
    "Connection Closed", "Timed Out", "Value not found", "Closing open session in favor of incoming prekey bundle",
    "Closing stale open session for new outgoing prekey bundle", "Closing session", "bad mac", "bad session",
    "Unexpected handshake error", "Error: read ECONNRESET"
  ];
  if (ignoreErrors.some(i => e.toLowerCase().includes(i.toLowerCase()))) return;
  log("ERROR", `[Uncaught Exception] ${err?.stack || e}`);
});

process.once("unhandledRejection", (reason) => {
  if (!String(reason).toLowerCase().includes("conflict")) {
    log("ERROR", `[Unhandled Rejection] ${reason}`);
  }
});

// 🧼 Ultimate Noise Suppressor — FULL log silence for session/decrypt junk
const originalLog = console.log;
const originalError = console.error;
const originalDebug = console.debug;
const originalStdout = process.stdout.write;
const originalStderr = process.stderr.write;

function isNoisy(message) {
  return typeof message === "string" && (
    message.includes("Bad MAC") ||
    message.includes("Removing old closed session") ||
    message.includes("Closing open session") ||
    message.includes("Closing stale open session") ||
    message.includes("Closing session") ||
    message.includes("Decrypted message with closed session.") ||
    message.includes("Failed to decrypt message with any known session") ||
    message.includes("MessageCounterError: Key used already or never filled") ||
    message.includes("SessionCipher.doDecryptWhisperMessage") ||
    message.includes("SessionCipher.decryptWithSessions")
  );
}

// Console overrides
console.log = (...args) => {
  if (isNoisy(args[0])) return;
  originalLog.apply(console, args);
};

console.error = (...args) => {
  if (isNoisy(args[0])) return;
  originalError.apply(console, args);
};

console.debug = (...args) => {
  if (isNoisy(args[0])) return;
  originalDebug.apply(console, args);
};

// Direct stdout/stderr stream overrides
process.stdout.write = (chunk, encoding, callback) => {
  if (isNoisy(chunk)) return true;
  return originalStdout.call(process.stdout, chunk, encoding, callback);
};

process.stderr.write = (chunk, encoding, callback) => {
  if (isNoisy(chunk)) return true;
  return originalStderr.call(process.stderr, chunk, encoding, callback);
};

// ✅ Part 1 - Setup & Initial Config
require('./lib/update')();
require("./config.js");
const chalk = require("chalk");

// ✅ Logger with info, warn, error levels
global.log = function (level, msg) {
  const now = new Date();
  const dd = now.getDate().toString().padStart(2, '0');
  const mm = (now.getMonth() + 1).toString().padStart(2, '0');
  const yy = now.getFullYear().toString().slice(-2);
  const timestamp = now.toLocaleTimeString("en-GB") + ` ${dd}-${mm}-${yy}`;

  const tag = level.toUpperCase();
  const label =
    tag === "INFO" ? chalk.cyan(tag) :
    tag === "WARN" ? chalk.yellow(tag) :
    tag === "ERROR" ? chalk.red(tag) :
    tag;

  console.log(`${label} [${timestamp}]:`, chalk.blue(msg));
};

require("events").EventEmitter.defaultMaxListeners = 600;

const {
  default: makeWASocket,
  useMultiFileAuthState,
  DisconnectReason,
  makeInMemoryStore,
  jidDecode,
  downloadContentFromMessage,
  delay,
  Browsers
} = require("@whiskeysockets/baileys");

const pino = require("pino");
const fs = require('fs');
const path = require('path');
const readline = require("readline");
const { Boom } = require("@hapi/boom");
const yargs = require('yargs/yargs');
const NodeCache = require('node-cache');
const moment = require('moment-timezone');
const FileType = require('file-type');
const axios = require("axios");
const _ = require('lodash');
const PhoneNumber = require("awesome-phonenumber");

const DataBase = require('./lib/database');
const { delArrSave } = require('./lib/arrfunction.js');

const {
  smsg,
  imageToWebp,
  videoToWebp,
  writeExif,
  writeExifImg,
  writeExifVid,
  toAudio,
  toPTT,
  toVideo,
  getBuffer,
  getSizeMedia
} = require("./all/myfunc");

const {
  getTime,
  tanggal,
  toRupiah,
  telegraPh,
  pinterest,
  ucapan,
  generateProfilePicture
} = require('./all/function.js');

const {
  color
} = require('./all/color');

const store = makeInMemoryStore({
  logger: pino().child({
    level: "silent",
    stream: "store"
  })
});

global.opts = new Object(yargs(process.argv.slice(2)).exitProcess(false).parse());

const groupCache = new NodeCache({
  stdTTL: 3600
});

const pkg = require("./package.json");

const deleteFolderRecursive = function (pathesi) {
  if (fs.existsSync(pathesi)) {
    fs.readdirSync(pathesi).forEach((file) => {
      const curPath = path.join(pathesi, file);
      if (fs.lstatSync(curPath).isDirectory()) {
        deleteFolderRecursive(curPath);
      } else {
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(pathesi);
  }
};

const question = (text) => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  return new Promise((resolve) => rl.question(text, resolve));
};

async function startBotz() {
  const { state, saveCreds } = await useMultiFileAuthState('./tmp/session');
  const database = new DataBase(process.env.DATABASE_URL);
  const existing = await database.read();

  global.db = {
    reconnect: 0,
    loadedPlugins: false,
    groups: {},
    settings: {},
    database: {},
    sticker: {},
    warns: {},
    setsudo: [],
    disabled: [],
    ban: [],
    gcban: [],
    plugins: {},
    ...existing
  };

  const ednut = makeWASocket({
  auth: state,
  logger: pino({ level: "silent" }),
  printQRInTerminal: false,
  browser: ['Windows', 'Chrome', '10.0'],
  // ✅ force a specific WhatsApp Web version
  version: [2, 3000, 1029030078],
});

  global.ednut = ednut;
  store.bind(ednut.ev);

require("./all/connect/messages")(ednut, store);
require("./all/connect/connection")(ednut, startBotz);
require("./all/connect/creds")(ednut, store, saveCreds);
require("./all/connect/call")(ednut);
require("./all/connect/group")(ednut);
require("./all/connect/statusForward")(ednut);
require("./all/connect/antistatus")(ednut);
require("./all/connect/statuslike")(ednut, store);
require("./all/connect/antidelete")(ednut, store);


  setInterval(async () => {
    try {
      await database.write(global.db);
    } catch (e) {
      log("ERROR", `DB Save: ${e.message}`);
    }
  }, 10000);
  
  
  setInterval(() => {
  const used = process.memoryUsage().rss / 1024 / 1024
  if (used > 800) {
    console.log("Memory high, cleaning...")
    global.gc?.()
  }
}, 60000)

// 🧼 Silent cleanup every 30 minutes
setInterval(() => {
  const tmpDir = path.join(__dirname, './tmp');
  const sessionDir = path.join(tmpDir, 'session');

  if (fs.existsSync(sessionDir)) {
    const files = fs.readdirSync(sessionDir);
    for (const file of files) {
      if (file.endsWith('.json') && file !== 'creds.json') {
        try {
          fs.unlinkSync(path.join(sessionDir, file));
        } catch {}
      }
    }
  }

  const keep = ['session', 'store', 'arch.jpg', 'data.js', 'helper.js'];
  const entries = fs.readdirSync(tmpDir);
  for (const entry of entries) {
    if (!keep.includes(entry)) {
      const fullPath = path.join(tmpDir, entry);
      try {
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
          fs.rmSync(fullPath, { recursive: true, force: true });
        } else {
          fs.unlinkSync(fullPath);
        }
      } catch {}
    }
  }

  // ✅ Silent memory cleanup (no logs)
  if (global.gc) {
    global.gc();
  }
}, 30 * 60 * 1000); // every 30 minutes

  ednut.decodeJid = (jid) => {
    if (!jid) return jid;
    if (/:\d+@/gi.test(jid)) {
      let decode = jidDecode(jid) || {};
      return (decode.user && decode.server && decode.user + "@" + decode.server) || jid;
    } else return jid;
  };

  ednut.getName = (jid, withoutContact = false) => {
    id = ednut.decodeJid(jid);
    withoutContact = ednut.withoutContact || withoutContact;
    let v;
    if (id.endsWith("@g.us"))
      return new Promise(async (resolve) => {
        v = store.contacts[id] || {};
        if (!(v.name || v.subject)) v = await ednut.groupMetadata(id) || {};
        resolve(v.name || v.subject || PhoneNumber("+" + id.replace("@s.whatsapp.net", "")).getNumber("international"));
      });
    else {
      v =
        id === "0@s.whatsapp.net"
          ? { id, name: "WhatsApp" }
          : id === ednut.decodeJid(ednut.user.id)
          ? ednut.user
          : store.contacts[id] || {};
      return (withoutContact ? "" : v.name) || v.subject || v.verifiedName || PhoneNumber("+" + jid.replace("@s.whatsapp.net", "")).getNumber("international");
    }
  };

  ednut.serializeM = (m) => smsg(ednut, m, store);
  ednut.sendText = (jid, text, quoted = "", options = {}) => ednut.sendMessage(jid, { text, ...options }, { quoted });

  ednut.sendContact = async (jid, kon, desk = "Developer Bot", quoted = '', opts = {}) => {
    let list = [];
    for (let i of kon) {
      list.push({
        displayName: botname,
        vcard:
          'BEGIN:VCARD\n' +
          'VERSION:3.0\n' +
          `N:;${botname};;;\n` +
          `FN:${botname}\n` +
          'ORG:null\n' +
          'TITLE:\n' +
          `item1.TEL;waid=${i}:${i}\n` +
          'item1.X-ABLabel:Ponsel\n' +
          `X-WA-BIZ-DESCRIPTION:${desk}\n` +
          `X-WA-BIZ-NAME:${botname}\n` +
          'END:VCARD'
      });
    }
    ednut.sendMessage(jid, { contacts: { displayName: `${list.length} contacts`, contacts: list }, ...opts }, { quoted });
  };
  
  ednut.downloadMediaMessage = async (message) => {
    let mime = (message.msg || message).mimetype || '';
    let messageType = message.mtype ? message.mtype.replace(/Message/gi, '') : mime.split('/')[0];
    const stream = await downloadContentFromMessage(message, messageType);
    let buffer = Buffer.from([]);
    for await (const chunk of stream) {
      buffer = Buffer.concat([buffer, chunk]);
    }
    global.gc?.();
    return buffer;
  };

  ednut.sendImageAsSticker = async (jid, path, quoted, options = {}) => {
    let buff = Buffer.isBuffer(path)
      ? path
      : /^data:.?\/.?;base64,/i.test(path)
      ? Buffer.from(path.split`,`[1], 'base64')
      : /^https?:\/\//.test(path)
      ? await (await getBuffer(path))
      : fs.existsSync(path)
      ? fs.readFileSync(path)
      : Buffer.alloc(0);
    let buffer;
    if (options && (options.packname || options.author)) {
      buffer = await writeExifImg(buff, options);
    } else {
      buffer = await imageToWebp(buff);
    }
    await ednut.sendMessage(jid, { sticker: { url: buffer }, ...options }, { quoted });
    buff = null;
    buffer = null;
    global.gc?.();
    return buffer;
  };

  ednut.sendVideoAsSticker = async (jid, path, quoted, options = {}) => {
    let buff = Buffer.isBuffer(path)
      ? path
      : /^data:.?\/.?;base64,/i.test(path)
      ? Buffer.from(path.split`,`[1], 'base64')
      : /^https?:\/\//.test(path)
      ? await (await getBuffer(path))
      : fs.existsSync(path)
      ? fs.readFileSync(path)
      : Buffer.alloc(0);
    let buffer;
    if (options && (options.packname || options.author)) {
      buffer = await writeExifVid(buff, options);
    } else {
      buffer = await videoToWebp(buff);
    }
    await ednut.sendMessage(jid, { sticker: { url: buffer }, ...options }, { quoted });
    buff = null;
    buffer = null;
    global.gc?.();
    return buffer;
  };

  ednut.reply = (jid, text = '', quoted, options) => {
    return Buffer.isBuffer(text)
      ? ednut.sendFile(jid, text, 'file', '', quoted, false, options)
      : ednut.sendMessage(jid, { ...options, text }, { quoted });
  };

  ednut.sendMedia = async (jid, path, quoted, options = {}) => {
    let { ext, mime, data } = await ednut.getFile(path);
    let messageType = mime.split("/")[0];
    let pase = messageType.replace('application', 'document') || messageType;
    const res = await ednut.sendMessage(jid, { [pase]: data, mimetype: mime, ...options }, { quoted });
    data = null;
    global.gc?.();
    return res;
  };

  ednut.getFile = async (PATH, save) => {
    let res;
    let data = Buffer.isBuffer(PATH)
      ? PATH
      : /^data:.*?\/.*?;base64,/i.test(PATH)
      ? Buffer.from(PATH.split(',')[1], 'base64')
      : /^https?:\/\//.test(PATH)
      ? await (res = await getBuffer(PATH))
      : fs.existsSync(PATH)
      ? fs.readFileSync(PATH)
      : typeof PATH === 'string'
      ? PATH
      : Buffer.alloc(0);

    let type = await FileType.fromBuffer(data) || { mime: 'application/octet-stream', ext: '.bin' };
    let filename = path.join(__dirname, './tmp/' + new Date().getTime() + '.' + type.ext);
    if (data && save) fs.promises.writeFile(filename, data);
    return { res, filename, size: await getSizeMedia(data), ...type, data };
  };

  ednut.sendFile = async (jid, path, filename = '', caption = '', quoted, ptt = false, options = {}) => {
    let type = await ednut.getFile(path, true);
    let { res, data: file, filename: pathFile } = type;

    if (res && res.status !== 200 || file.length <= 65536) {
      try { throw { json: JSON.parse(file.toString()) }; }
      catch (e) { if (e.json) throw e.json; }
    }

    let opt = { filename };
    if (quoted) opt.quoted = quoted;
    if (!type) options.asDocument = true;

    let mtype = '', mimetype = type.mime, convert;

    if (/webp/.test(type.mime) || (/image/.test(type.mime) && options.asSticker)) mtype = 'sticker';
    else if (/image/.test(type.mime) || (/webp/.test(type.mime) && options.asImage)) mtype = 'image';
    else if (/video/.test(type.mime)) mtype = 'video';
    else if (/audio/.test(type.mime)) {
      convert = await (ptt ? toPTT : toAudio)(file, type.ext);
      file = convert.data;
      pathFile = convert.filename;
      mtype = 'audio';
      mimetype = 'audio/ogg; codecs=opus';
    } else mtype = 'document';

    if (options.asDocument) mtype = 'document';

    let message = {
      ...options,
      caption,
      ptt,
      [mtype]: { url: pathFile },
      mimetype
    };

    let m;
    try {
      m = await ednut.sendMessage(jid, message, { ...opt, ...options });
    } catch (e) {
      console.error(e);
      m = null;
    } finally {
      if (!m) m = await ednut.sendMessage(jid, { ...message, [mtype]: file }, { ...opt, ...options });

      if (fs.existsSync(pathFile)) {
        try {
          await fs.promises.unlink(pathFile);
        } catch (err) {
          console.error('Failed to delete temp file:', err);
        }
      }

      file = null;
      global.gc?.();
      return m;
    }
  };

  ednut.downloadAndSaveMediaMessage = async (message, filename, attachExtension = true) => {
    let quoted = message.m ? message.m : message;
    let mime = (message.m || message).mimetype || '';
    let messageType = message.mtype ? message.mtype.replace(/Message/gi, '') : mime.split('/')[0];
    const stream = await downloadContentFromMessage(quoted, messageType);
    let buffer = Buffer.from([]);
    for await (const chunk of stream) {
      buffer = Buffer.concat([buffer, chunk]);
    }

    let type = await FileType.fromBuffer(buffer);
    let trueFileName = attachExtension ? (filename + '.' + type.ext) : filename;
    const dir = './tmp/';
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);
    const filePath = `${dir}/${trueFileName}`;
    await fs.writeFileSync(filePath, buffer);

    buffer = null;
    global.gc?.();

    return filePath;
  };

  return ednut;
}

async function startBot() {
  try {
    let id = global.session;

    if (!id) {
      log("ERROR", "Session ID not found. Please add one in config.js");
      return;
    }

    // ✅ Only allow patron sessions
    if (!/^LUMINA-XMD~/.test(id)) {
      log("ERROR", `Invalid session ID. Please scan a new session from ${global.scan}`);
      return;
    }

    // Paths
    const sessionDir = path.join(__dirname, 'tmp/session');
    const credsPath = path.join(sessionDir, 'creds.json');

    // Ensure session directory exists
    if (!fs.existsSync(sessionDir)) {
      fs.mkdirSync(sessionDir, { recursive: true });
    }

    // 🟢 Skip if creds.json already exists
    if (!fs.existsSync(credsPath)) {
      let credsId = id.replace(/^LUMINA-XMD~/, '');

      try {
        const url = `https://gist.githubusercontent.com/cadillaccylee021/${credsId}/raw/session.json`;
        const response = await axios.get(url);
        const data = typeof response.data === "string" ? response.data : JSON.stringify(response.data);

        await fs.promises.writeFile(credsPath, data);
        log("INFO", "✅ Session downloaded and saved.");
      } catch (err) {
        log("ERROR", "❌ Failed to fetch or save session");
        return;
      }
    } else {
      log("INFO", "✅ Using existing session creds.json");
    }

    // 🧹 Clean up old listeners before restart
    if (global.ednut?.ev) {
      global.ednut.ev.removeAllListeners();
      global.ednut = null;
    }

    // 🚀 Start bot
    await startBotz();

  } catch (error) {
    log("ERROR", `Encountered Error: ${error?.stack || error}`);
  }
}

startBot();