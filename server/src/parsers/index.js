
import { parseHdfcStatement, isHdfcStatement } from "./hdfcParser.js";
import { parseIciciStatement, isIciciStatement } from "./iciciParser.js";
import { parseAxisStatement, isAxisStatement } from "./axisParser.js";
import { parseSbiStatement, isSbiStatement } from "./sbiParser.js";
import { parseKotakStatement, isKotakStatement } from "./kotakParser.js";

const SUPPORTED_BANKS = {
  hdfc: {
    name: "HDFC Bank",
    parser: parseHdfcStatement,
    detector: isHdfcStatement,
    keywords: ["hdfc", "HDFC", "Hdfc"],
  },
  icici: {
    name: "ICICI Bank",
    parser: parseIciciStatement,
    detector: isIciciStatement,
    keywords: ["icici", "ICICI", "Icici", "icicibank"],
  },
  axis: {
    name: "Axis Bank",
    parser: parseAxisStatement,
    detector: isAxisStatement,
    keywords: ["axis", "AXIS", "Axis", "axisbank"],
  },
  sbi: {
    name: "State Bank of India",
    parser: parseSbiStatement,
    detector: isSbiStatement,
    keywords: ["sbi", "SBI", "Sbi", "State Bank", "sbicard"],
  },
  kotak: {
    name: "Kotak Mahindra Bank",
    parser: parseKotakStatement,
    detector: isKotakStatement,
    keywords: ["kotak", "KOTAK", "Kotak", "Mahindra"],
  },
};


function normalizeBankName(bankName) {
  if (bankName in SUPPORTED_BANKS) {
    return bankName;
  }

  const lowerName = bankName.toLowerCase();
  for (const [key, config] of Object.entries(SUPPORTED_BANKS)) {
    if (config.name.toLowerCase() === lowerName) {
      return key;
    }
  }

  return null;
}

export function getParser(bankName) {
  const normalizedName = normalizeBankName(bankName);
  const bankConfig = SUPPORTED_BANKS[normalizedName];

  if (!bankConfig) {
    throw new Error(`Bank "${bankName}" is not supported`);
  }

  if (!bankConfig.parser) {
    throw new Error(`Parser for "${bankName}" is not yet implemented`);
  }

  return bankConfig.parser;
}

export function isBankSupported(bankName) {
  return normalizeBankName(bankName) !== null;
}

export function isParserAvailable(bankName) {
  const normalizedName = normalizeBankName(bankName);
  const bankConfig = SUPPORTED_BANKS[normalizedName];
  return bankConfig && bankConfig.parser !== null;
}


export function getSupportedBanks() {
  return Object.keys(SUPPORTED_BANKS);
}

export function getAvailableParsers() {
  return Object.entries(SUPPORTED_BANKS)
    .filter(([_, config]) => config.parser !== null)
    .map(([name, _]) => name);
}


export function detectBank(text) {
  // console.log("\nStarting bank detection...");

  for (const [bankKey, config] of Object.entries(SUPPORTED_BANKS)) {
    const foundKeyword = config.keywords.find(keyword => text.includes(keyword));

    if (foundKeyword) {
      console.log(`DETECTED: ${config.name} (${bankKey}) - Found keyword: "${foundKeyword}"`);
      return bankKey;
    }
  }

  console.log(` No bank detected. Searched keywords:`,
    Object.entries(SUPPORTED_BANKS).map(([key, cfg]) => `${key}: [${cfg.keywords.join(', ')}]`)
  );

  return null;
}