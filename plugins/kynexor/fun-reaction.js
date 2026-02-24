const axios = require("axios");
const fs = require("fs");
const path = require("path");
const { tmpdir } = require("os");
const Crypto = require("crypto");
const ffmpeg = require("fluent-ffmpeg");
const ffmpegPath = require("@ffmpeg-installer/ffmpeg").path;

ffmpeg.setFfmpegPath(ffmpegPath);

// -------------------- Configuration --------------------
const TMP_DIR = path.resolve(__dirname, "../../tmp/store");
if (!fs.existsSync(TMP_DIR)) fs.mkdirSync(TMP_DIR, { recursive: true });

// Replace with your API key (already used in examples). Keep here for easier change.
const NEX_APIKEY = "0af4edb1db311e0f4c";

// -------------------- Helpers --------------------
async function fetchGifBufferFromUrl(url) {
  // Fetch binary data (arraybuffer) and return Buffer
  const res = await axios.get(url, { responseType: "arraybuffer", timeout: 20000 });
  return Buffer.from(res.data);
}

async function fetchGifFromApiEndpoint(apiEndpoint) {
  // Some endpoints return JSON { url: "..." }, some return binary directly.
  // Try JSON first; if it contains url use that, otherwise fetch binary.
  try {
    const resJson = await axios.get(apiEndpoint, { responseType: "json", timeout: 10000 });
    if (resJson && resJson.data && resJson.data.url) {
      return await fetchGifBufferFromUrl(resJson.data.url);
    }
  } catch (err) {
    // ignore — will try arraybuffer next
  }

  // fallback: request as binary
  try {
    const resBin = await axios.get(apiEndpoint, { responseType: "arraybuffer", timeout: 20000 });
    return Buffer.from(resBin.data);
  } catch (err) {
    throw new Error(`Failed to fetch GIF from API endpoint: ${err.message || err}`);
  }
}

async function gifToVideoBuffer(gifBuffer) {
  const filename = Crypto.randomBytes(6).toString("hex");
  const gifPath = path.join(TMP_DIR, `${filename}.gif`);
  const mp4Path = path.join(TMP_DIR, `${filename}.mp4`);

  try {
    fs.writeFileSync(gifPath, gifBuffer);

    await new Promise((resolve, reject) => {
      ffmpeg(gifPath)
        .outputOptions([
          "-movflags faststart",
          "-pix_fmt yuv420p",
          "-vf scale=trunc(iw/2)*2:trunc(ih/2)*2",
        ])
        .on("error", (err) => reject(err))
        .on("end", () => resolve())
        .save(mp4Path);
    });

    const videoBuffer = fs.readFileSync(mp4Path);
    return videoBuffer;
  } finally {
    // Attempt to unlink both files if they exist (best-effort)
    try { if (fs.existsSync(gifPath)) fs.unlinkSync(gifPath); } catch (_) {}
    try { if (fs.existsSync(mp4Path)) fs.unlinkSync(mp4Path); } catch (_) {}
  }
}

/**
 * Core reaction sender used by each command.
 * - action: the api path (e.g. 'slap')
 * - displayText: short verb used in caption (e.g. 'slapped')
 * - emoji: emoji to append to caption
 */
async function sendReaction(m, opts, action, displayText, emoji = "") {
  const { ednut, reply } = opts;
  try {
    const apiUrl = `https://api.nexoracle.com/reactions-pack/${action}?apikey=${NEX_APIKEY}`;

    const senderTag = `@${m.sender.split("@")[0]}`;
    const target = m.quoted ? m.quoted.sender : null;
    const targetTag = target ? `@${target.split("@")[0]}` : null;

    const caption = targetTag
      ? `${senderTag} ${displayText} ${targetTag} ${emoji}`.trim()
      : `${senderTag} is ${displayText.replace(/ed$|ing$/,"")} the air ${emoji}`.trim();

    // fetch gif buffer (handles JSON url & direct binary)
    const gifBuffer = await fetchGifFromApiEndpoint(apiUrl);

    // convert to mp4 buffer and auto-clean temp files
    const videoBuffer = await gifToVideoBuffer(gifBuffer);

    // send the video
    await ednut.sendMessage(
      m.chat,
      {
        video: videoBuffer,
        caption,
        gifPlayback: true,
        mentions: targetTag ? [m.sender, target] : [m.sender],
      },
      { quoted: m }
    );
  } catch (err) {
    // friendly reply + debug log
    try { reply("❌ Failed to send reaction."); } catch (_) {}
    if (typeof global.log === "function") {
      global.log("ERROR", `${action} error: ${err.message || err}`);
    } else {
      console.error(`${action} error:`, err);
    }
  }
}

// -------------------- Commands Export --------------------
module.exports = [
  // 1 Bite
  {
    command: ["bite"],
    description: "Bite someone",
    category: "Fun",
    ban: true,
    gcban: true,
    async execute(m, opts) {
      await sendReaction(m, opts, "bite", "bit", "🦈");
    },
  },

  // 2 Bully
  {
    command: ["bully"],
    description: "Bully someone",
    category: "Fun",
    ban: true,
    gcban: true,
    async execute(m, opts) {
      await sendReaction(m, opts, "bully", "bullied", "😈");
    },
  },

  // 4 Blush
  {
    command: ["blush"],
    description: "Blush",
    category: "Fun",
    ban: true,
    gcban: true,
    async execute(m, opts) {
      await sendReaction(m, opts, "blush", "blushed", "😊");
    },
  },

  // 5 Cringe
  {
    command: ["cringe"],
    description: "Cringe reaction",
    category: "Fun",
    ban: true,
    gcban: true,
    async execute(m, opts) {
      await sendReaction(m, opts, "cringe", "cringed", "😬");
    },
  },

  // 6 Cry
  {
    command: ["cry"],
    description: "Cry reaction",
    category: "Fun",
    ban: true,
    gcban: true,
    async execute(m, opts) {
      await sendReaction(m, opts, "cry", "is crying over", "😭");
    },
  },

  // 7 Cuddle
  {
    command: ["cuddle"],
    description: "Cuddle someone",
    category: "Fun",
    ban: true,
    gcban: true,
    async execute(m, opts) {
      await sendReaction(m, opts, "cuddle", "cuddled", "🤗");
    },
  },

  // 8 Dance
  {
    command: ["dance"],
    description: "Dance reaction",
    category: "Fun",
    ban: true,
    gcban: true,
    async execute(m, opts) {
      await sendReaction(m, opts, "dance", "danced", "💃");
    },
  },

  // 10 Hug
  {
    command: ["hug"],
    description: "Hug someone",
    category: "Fun",
    ban: true,
    gcban: true,
    async execute(m, opts) {
      await sendReaction(m, opts, "hug", "hugged", "🫂");
    },
  },

  // 11 Happy
  {
    command: ["happy"],
    description: "Happy reaction",
    category: "Fun",
    ban: true,
    gcban: true,
    async execute(m, opts) {
      await sendReaction(m, opts, "happy", "is happy with", "😄");
    },
  },

  // 13 Highfive
  {
    command: ["highfive"],
    description: "Highfive someone",
    category: "Fun",
    ban: true,
    gcban: true,
    async execute(m, opts) {
      await sendReaction(m, opts, "highfive", "highfived", "✋");
    },
  },

  // 14 Kill
  {
    command: ["kill"],
    description: "Kill someone (reaction)",
    category: "Fun",
    ban: true,
    gcban: true,
    async execute(m, opts) {
      await sendReaction(m, opts, "kill", "killed", "💀");
    },
  },

  // 16 Kiss
  {
    command: ["kiss"],
    description: "Kiss someone",
    category: "Fun",
    ban: true,
    gcban: true,
    async execute(m, opts) {
      await sendReaction(m, opts, "kiss", "kissed", "💋");
    },
  },

  // 17 Lick
  {
    command: ["lick"],
    description: "Lick someone",
    category: "Fun",
    ban: true,
    gcban: true,
    async execute(m, opts) {
      await sendReaction(m, opts, "lick", "licked", "👅");
    },
  },

  // 19 Poke
  {
    command: ["poke"],
    description: "Poke someone",
    category: "Fun",
    ban: true,
    gcban: true,
    async execute(m, opts) {
      await sendReaction(m, opts, "poke", "poked", "👉");
    },
  },

  // 20 Pat
  {
    command: ["pat"],
    description: "Pat someone",
    category: "Fun",
    ban: true,
    gcban: true,
    async execute(m, opts) {
      await sendReaction(m, opts, "pat", "patted", "🤝");
    },
  },

  // 21 Smug
  {
    command: ["smug"],
    description: "Smug reaction",
    category: "Fun",
    ban: true,
    gcban: true,
    async execute(m, opts) {
      await sendReaction(m, opts, "smug", "is smug at", "😏");
    },
  },

  // 22 Slap
  {
    command: ["slap"],
    description: "Slap someone",
    category: "Fun",
    ban: true,
    gcban: true,
    async execute(m, opts) {
      await sendReaction(m, opts, "slap", "slapped", "👋");
    },
  },

  // 23 Smile
  {
    command: ["smile"],
    description: "Smile reaction",
    category: "Fun",
    ban: true,
    gcban: true,
    async execute(m, opts) {
      await sendReaction(m, opts, "smile", "smiled at", "🙂");
    },
  },

  // 24 Wink
  {
    command: ["wink"],
    description: "Wink at someone",
    category: "Fun",
    ban: true,
    gcban: true,
    async execute(m, opts) {
      await sendReaction(m, opts, "wink", "winked at", "😉");
    },
  },

  // 25 Wave
  {
    command: ["wave"],
    description: "Wave at someone",
    category: "Fun",
    ban: true,
    gcban: true,
    async execute(m, opts) {
      await sendReaction(m, opts, "wave", "waved at", "👋");
    },
  },
];
