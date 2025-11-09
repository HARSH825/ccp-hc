
export function parseHdfcStatement(text) {
  try {
    text = text.replace(/\r/g, "").trim();

    // (DD/MM/YYYY format)
    const statementDateMatch = text.match(
      /Statement Date[:\s]*([0-9]{2}\/[0-9]{2}\/[0-9]{4})/i
    );
    const statement_date = statementDateMatch ? statementDateMatch[1] : null;

    const cardNumberMatch = text.match(/Card No[:\s]*[0-9Xx\s]+(\d{4})/i);
    const card_last4 = cardNumberMatch ? cardNumberMatch[1] : null;

    // Pattern: "Payment Due DateTotal DuesMinimum Amount Due\n12/11/202483,794.004,240.00"
    let payment_due_date = null;
    let total_dues = null;
    let minimum_amount_due = null;

    // "12/11/202483,794.004,240.00"
    const tablePattern =
      /Payment\s*Due\s*Date.*?Total\s*Dues.*?Minimum\s*Amount\s*Due\s*\n?\s*(\d{2}\/\d{2}\/\d{4})\s*(\d{1,3},\d{3}\.\d{2})\s*(\d{1,3},\d{3}\.\d{2})/i;
    const tableMatch = text.match(tablePattern);

    if (tableMatch) {
      payment_due_date = tableMatch[1];
      total_dues = tableMatch[2];
      minimum_amount_due = tableMatch[3];
    } else {
      const dueDateMatch = text.match(/Payment Due Date[:\s]+([\d/]+)/i);
      payment_due_date = dueDateMatch ? dueDateMatch[1] : null;

      const totalDuesMatch = text.match(/Total Dues[:\s]+([0-9,]+\.\d{2})/i);
      total_dues = totalDuesMatch ? totalDuesMatch[1] : null;

      const minimumDueMatch = text.match(
        /Minimum Amount Due[:\s]+([0-9,]+\.\d{2})/i
      );
      minimum_amount_due = minimumDueMatch ? minimumDueMatch[1] : null;
    }

    const result = {
      provider: "HDFC Bank",
      statement_date,
      card_last4,
      payment_due_date,
      total_dues,
      minimum_amount_due,
    };

    const extractedFields = Object.values(result).filter(
      (val) => val !== null && val !== "HDFC Bank"
    );

    if (extractedFields.length === 0) {
      throw new Error("Unable to extract any data from the statement");
    }

    return result;
  } catch (error) {
    throw new Error(`HDFC Parser Error: ${error.message}`);
  }
}


export function isHdfcStatement(text) {
  const hdfcIdentifiers = [/HDFC\s+BANK/i, /hdfc/i];

  return hdfcIdentifiers.some((pattern) => pattern.test(text));
}
