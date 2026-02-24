const scores = {};
const activeGames = {};
const gameMeta = {};
const lastMessageId = {};       // Tracks last processed message per game
const playerHasMoved = {};      // Tracks if current player has moved this turn

const getGameKey = (p1, p2) => [p1, p2].sort().join("-");
let listenerRegistered = false;

module.exports = [
  {
    command: ["ttt"],
    alias: ["tictactoe", "xo"],
    description: "Start a Tic Tac Toe game in a group",
    category: "Game",
    use: "<opponent-number>",
    ban: true,
    gcban: true,
    execute: async (m, { ednut, args, reply }) => {
      const from = m.key.remoteJid;
      if (!from.endsWith("@g.us")) return reply("❌ This command can only be used in groups.");

      const senderJid = m.key.participant || m.key.remoteJid;
      const senderNum = senderJid.replace(/[^0-9]/g, "");

      // Fetch participants using .jid
      let participantsList = [];
      try {
        const meta = await ednut.groupMetadata(from);
        participantsList = meta.participants.map(p => p.jid);
      } catch (e) {
        participantsList = [senderJid];
      }

      const rawInput = args.join("").replace(/[^0-9]/g, "");
      if (!rawInput) return reply("👥 Provide the opponent's WhatsApp number. Example: .ttt 2348012345678");
      if (rawInput.length < 10 || rawInput.length > 15) return reply("📱 Invalid number format. Use full WhatsApp number like 2348012345678");
      if (rawInput === senderNum) return reply("❌ You can't play against yourself.");

      const opponentJid = participantsList.find(j => j.includes(rawInput)) || rawInput + "@s.whatsapp.net";
      if (!opponentJid) return reply("❌ The opponent is not in this group. Paste their *number*, not tag.");

      const gameKey = getGameKey(senderNum, rawInput);
      if (activeGames[gameKey]) return reply("⚠️ A game is already ongoing between you two.");

      // Initialize game state
      const board = ["1️⃣","2️⃣","3️⃣","4️⃣","5️⃣","6️⃣","7️⃣","8️⃣","9️⃣"];
      let currentPlayer = "❌";
      let turns = 0;

      const renderBoard = (currentId) => `🎮 *Tic Tac Toe*\n
${board[0]} | ${board[1]} | ${board[2]}
${board[3]} | ${board[4]} | ${board[5]}
${board[6]} | ${board[7]} | ${board[8]}

👤 *Turn:* @${currentId} (${currentPlayer})
🗨️ Reply to this message with a number (1–9) to play.`.trim();

      const checkWin = (b, player) => {
        const wins = [
          [0,1,2],[3,4,5],[6,7,8],
          [0,3,6],[1,4,7],[2,5,8],
          [0,4,8],[2,4,6],
        ];
        return wins.some(([a,b,c]) => b[a] === player && b[b] === player && b[c] === player);
      };

      const sent = await ednut.sendMessage(from, {
        text: renderBoard(senderNum),
        mentions: [senderJid, opponentJid].filter(Boolean)
      }, { quoted: m });

      activeGames[gameKey] = true;
      gameMeta[gameKey] = {
        playerX: senderNum,
        playerO: rawInput,
        jidX: senderJid,
        jidO: opponentJid,
        board,
        currentPlayer,
        turns,
        messageID: sent.key.id
      };
      playerHasMoved[gameKey] = false;

      // Register a **global listener once**
      if (!listenerRegistered) {
        listenerRegistered = true;

        ednut.ev.on("messages.upsert", async (msgData) => {
          try {
            const msg = msgData.messages?.[0];
            if (!msg?.message) return;

            const fromGroup = msg.key.remoteJid;
            const rawFrom = msg.key.participant || msg.key.remoteJid;
            const fromNum = rawFrom.replace(/[^0-9]/g, "");

            // Find active game where sender is a player
            const gameKey = Object.keys(activeGames).find(k => {
              const meta = gameMeta[k];
              return meta &&
                     (fromGroup === from || fromGroup.endsWith("@g.us")) &&
                     (fromNum === meta.playerX || fromNum === meta.playerO);
            });
            if (!gameKey) return;

            const meta = gameMeta[gameKey];
            if (!meta) return;

            // Prevent duplicate message processing
            if (lastMessageId[gameKey] === msg.key.id) return;
            lastMessageId[gameKey] = msg.key.id;

            const text = (msg.message.conversation || msg.message.extendedTextMessage?.text || "").trim();
            if (!text.match(/^[1-9]$/)) return;

            // Determine whose turn
            const expected = meta.currentPlayer === "❌" ? meta.playerX : meta.playerO;
            if (fromNum !== expected) {
              await ednut.sendMessage(fromGroup, {
                text: `⚠️ It's not your turn.`,
                mentions: [expected === meta.playerX ? meta.jidX : meta.jidO].filter(Boolean)
              }, { quoted: msg });
              return;
            }

            // Only first move counts
            if (playerHasMoved[gameKey]) return;

            const move = parseInt(text);
            const idx = move - 1;
            if (["❌","⭕"].includes(meta.board[idx])) {
              await ednut.sendMessage(fromGroup, { text: "❎ That spot is already taken." }, { quoted: msg });
              return;
            }

            // Make move
            meta.board[idx] = meta.currentPlayer;
            meta.turns++;
            playerHasMoved[gameKey] = true;

            // Check win
            const wins = [
              [0,1,2],[3,4,5],[6,7,8],
              [0,3,6],[1,4,7],[2,5,8],
              [0,4,8],[2,4,6],
            ];
            if (wins.some(([a,b,c]) => meta.board[a] === meta.currentPlayer && meta.board[b] === meta.currentPlayer && meta.board[c] === meta.currentPlayer)) {
              scores[expected] = (scores[expected] || 0) + 1;
              await ednut.sendMessage(fromGroup, {
                text: `🎉 *${meta.currentPlayer} wins!* @${expected}\n\n${renderBoard(expected)}\n\n🏆 *Scores:*\n@${meta.playerX}: ${scores[meta.playerX] || 0}\n@${meta.playerO}: ${scores[meta.playerO] || 0}`,
                mentions: [meta.jidX, meta.jidO].filter(Boolean)
              }, { quoted: msg });
              cleanup(gameKey);
              return;
            }

            // Check draw
            if (meta.turns === 9) {
              await ednut.sendMessage(fromGroup, {
                text: `🤝 *It's a draw!*\n\n${renderBoard(expected)}`,
                mentions: [meta.jidX, meta.jidO].filter(Boolean)
              }, { quoted: msg });
              cleanup(gameKey);
              return;
            }

            // Switch turn
            meta.currentPlayer = meta.currentPlayer === "❌" ? "⭕" : "❌";
            playerHasMoved[gameKey] = false;
            const nextTurn = meta.currentPlayer === "❌" ? meta.playerX : meta.playerO;

            const nextMsg = await ednut.sendMessage(fromGroup, {
              text: renderBoard(nextTurn),
              mentions: [meta.jidX, meta.jidO].filter(Boolean)
            }, { quoted: msg });

            meta.messageID = nextMsg.key.id;

          } catch (err) {
            console.error("[TicTacToe Global Listener Error]:", err);
          }
        });
      }
    }
  },
  {
    command: ["tttstop"],
    description: "Force stop any active Tic Tac Toe game",
    category: "Game",
    ban: true,
    gcban: true,
    execute: async (m, { ednut, reply }) => {
      const senderJid = m.key.participant || m.key.remoteJid;
      const senderNum = senderJid.replace(/[^0-9]/g, "");

      const key = Object.keys(activeGames).find(k => k.includes(senderNum));
      if (!key) return reply("⚠️ You are not in any active game.");

      cleanup(key);
      reply("🛑 Game has been stopped.");
    }
  }
];

// Cleanup helper
function cleanup(gameKey) {
  delete activeGames[gameKey];
  delete gameMeta[gameKey];
  delete lastMessageId[gameKey];
  delete playerHasMoved[gameKey];
}