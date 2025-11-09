
export function parseAxisStatement(text) {
  try {
    text = text.replace(/\r/g, "").trim();

    const datesLineMatch = text.match(
      /(\d{2}\/\d{2}\/\d{4})\s*-\s*(\d{2}\/\d{2}\/\d{4})(\d{2}\/\d{2}\/\d{4})(\d{2}\/\d{2}\/\d{4})/
    );

    const statement_date = datesLineMatch ? datesLineMatch[4] : null;

    const payment_due_date = datesLineMatch ? datesLineMatch[3] : null;

    // Pattern: "440006******9354" or "Card No:440006******9354"
    const cardNumberMatch = text.match(/\d{6}\*+(\d{4})/);
    const card_last4 = cardNumberMatch ? cardNumberMatch[1] : null;

    // Pattern: "15,564.03   Dr1,320.00   Dr"
    // total Payment Due is first, Minimum Payment Due is second
    const amountsMatch = text.match(
      /(\d{1,3}(?:,\d{3})*\.\d{2})\s+Dr(\d{1,3}(?:,\d{3})*\.\d{2})\s+Dr/
    );
    const total_dues = amountsMatch ? amountsMatch[1] : null;
    const minimum_amount_due = amountsMatch ? amountsMatch[2] : null;

    const result = {
      provider: "Axis Bank",
      statement_date,
      card_last4,
      payment_due_date,
      total_dues,
      minimum_amount_due,
    };

    const extractedFields = Object.values(result).filter(
      (val) => val !== null && val !== "Axis Bank"
    );

    if (extractedFields.length === 0) {
      throw new Error("Unable to extract any data from the statement");
    }

    return result;
  } catch (error) {
    throw new Error(`Axis Parser Error: ${error.message}`);
  }
}


export function isAxisStatement(text) {
  const axisIdentifiers = [
    /Axis\s+Bank/i,
    /axisbank\.com/i,
    /Flipkart\s+Axis\s+Bank/i,
  ];

  return axisIdentifiers.some((pattern) => pattern.test(text));
}
