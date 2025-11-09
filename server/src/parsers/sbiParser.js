
export function parseSbiStatement(text) {
  try {
    text = text.replace(/\r/g, "").trim();

    const dateMatches = text.match(
      /\b(\d{2}\s+(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+\d{4})\b/g
    );

    let statement_date = null;
    let payment_due_date = null;

    if (dateMatches && dateMatches.length >= 2) {
      statement_date = convertSbiDate(dateMatches[0]);
      payment_due_date = convertSbiDate(dateMatches[1]);
    }

    const cardNumberMatch = text.match(/XXXX\s+XXXX\s+XXXX\s+XX(\d{2})/);
    const card_last4 = cardNumberMatch ? cardNumberMatch[1] : null;

    const amountMatches = text.match(/\b(\d{1,3}(?:,\d{3})*\.\d{2})\b/g);

    let total_dues = null;
    let minimum_amount_due = null;

    if (amountMatches && amountMatches.length >= 2) {

      total_dues = amountMatches[0];
      minimum_amount_due = amountMatches[1];
    }

    const result = {
      provider: "State Bank of India",
      statement_date,
      card_last4,
      payment_due_date,
      total_dues,
      minimum_amount_due,
    };

    const extractedFields = Object.values(result).filter(
      (val) => val !== null && val !== "State Bank of India"
    );

    if (extractedFields.length === 0) {
      throw new Error("Unable to extract any data from the statement");
    }

    return result;
  } catch (error) {
    throw new Error(`SBI Parser Error: ${error.message}`);
  }
}


function convertSbiDate(dateStr) {
  const monthMap = {
    Jan: "01",
    Feb: "02",
    Mar: "03",
    Apr: "04",
    May: "05",
    Jun: "06",
    Jul: "07",
    Aug: "08",
    Sep: "09",
    Oct: "10",
    Nov: "11",
    Dec: "12",
  };

  // Parse "08 Jan 2018"
  const match = dateStr.match(/(\d{2})\s+([A-Za-z]{3})\s+(\d{4})/);
  if (match) {
    const day = match[1];
    const month = monthMap[match[2]];
    const year = match[3];
    return `${day}/${month}/${year}`;
  }

  return dateStr;
}


export function isSbiStatement(text) {
  const sbiIdentifiers = [
    /SBI\s+Card/i,
    /State\s+Bank\s+of\s+India/i,
    /sbicard\.com/i,
    /GSTIN\s+of\s+SBI\s+Card/i,
  ];

  return sbiIdentifiers.some((pattern) => pattern.test(text));
}
