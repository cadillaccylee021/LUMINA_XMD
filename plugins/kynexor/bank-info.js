const fs = require("fs");
const path = require("path");

// Ensure data folder exists
const dataDir = path.join(__dirname, "../../storage");
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Path to bank data file
const bankDataPath = path.join(dataDir, "bank-data.json");

// Function to load bank info
function loadBankInfo() {
  try {
    if (fs.existsSync(bankDataPath)) {
      const data = fs.readFileSync(bankDataPath, "utf8");
      return JSON.parse(data);
    } else {
      // If file doesn't exist, create with default values
      const defaultData = {
        bankName: "",
        holderName: "",
        accountNumber: "",
      };
      fs.writeFileSync(bankDataPath, JSON.stringify(defaultData, null, 2));
      return defaultData;
    }
  } catch (e) {
    console.error("Error loading bank data:", e);
    return {
      bankName: "",
      holderName: "",
      accountNumber: "",
    };
  }
}

// Function to save bank info
function saveBankInfo(data) {
  try {
    fs.writeFileSync(bankDataPath, JSON.stringify(data, null, 2));
    return true;
  } catch (e) {
    console.error("Error saving bank data:", e);
    return false;
  }
}

// Load initial bank info
let bankInfo = loadBankInfo();

module.exports = [
  {
    command: ["setaza"],
    alias: ["setbank"],
    description: "Set bank account information",
    category: "Owner",
    async execute(m, { text, isOwner, reply }) {
      try {
        if (!isOwner) return reply("📛 This command is restricted to owners only.");

        if (!text || text.trim() === "") {
          return reply("❌ *Missing Bank Info!*\n\nUse:\n`.setaza Holder | Bank | Account`\nExample:\n`.setaza John Doe | GTBank | 0123456789`");
        }

        const parts = text.split("|").map((p) => p.trim());
        if (parts.length !== 3) {
          return reply("❌ *Invalid Format!*\n\nUse:\n`.setaza Jane Doe | GTBank | 0123456789`");
        }

        let [holderName, bankName, accountNumber] = parts;
        holderName = holderName.toUpperCase();
        bankName = bankName.toUpperCase();

        if (!/^\d+$/.test(accountNumber)) {
          return reply("❌ Account number must be numeric.\nExample:\n`.setaza patron | GTBank | 0123456789`");
        }

        bankInfo = { holderName, bankName, accountNumber };

        if (!saveBankInfo(bankInfo)) {
          return reply("❌ Error saving bank information. Please try again.");
        }

        return reply(
          `🏦 *BANK DETAILS SAVED*\n\n` +
          `🚹 *${bankInfo.holderName}*\n` +
          `🔢 *${bankInfo.accountNumber}*\n` +
          `🏦 *${bankInfo.bankName}*\n\n` +
          `Use .aza to view this information.`
        );
      } catch (e) {
        console.error("Set bank info error:", e);
        return reply("❌ An error occurred while setting bank info.");
      }
    },
  },

  {
    command: ["aza"],
    alias: ["bank"],
    description: "Get bank account information",
    category: "Info",
    async execute(m, { reply }) {
      try {
        bankInfo = loadBankInfo();

        if (!bankInfo.bankName || !bankInfo.holderName || !bankInfo.accountNumber) {
          return reply("❌ Bank info not set yet.\nUse `.setaza Holder | Bank | Account` first.");
        }

        return reply(
          `🏦 *BANK DETAILS*\n\n` +
          `🚹 *${bankInfo.holderName}*\n` +
          `🔢 *${bankInfo.accountNumber}*\n` +
          `🏦 *${bankInfo.bankName}*\n\n` +
          `*SEND SCREENSHOT AFTER PAYMENT*`
        );
      } catch (e) {
        console.error("Get bank info error:", e);
        return reply("❌ An error occurred while fetching bank info.");
      }
    },
  },

  {
    command: ["clearaza"],
    alias: ["resetbank"],
    description: "Clear saved bank account information",
    category: "Owner",
    async execute(m, { isOwner, reply }) {
      try {
        if (!isOwner) return reply("📛 This command is restricted to owners only.");

        bankInfo = { bankName: "", holderName: "", accountNumber: "" };
        if (fs.existsSync(bankDataPath)) fs.unlinkSync(bankDataPath);

        // Recreate empty file
        saveBankInfo(bankInfo);

        return reply("✅ Bank information has been cleared.");
      } catch (e) {
        console.error("Clear bank info error:", e);
        return reply("❌ An error occurred while clearing bank info.");
      }
    },
  },
];
