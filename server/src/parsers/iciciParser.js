
export function parseIciciStatement(text) {
  try {
    text = text.replace(/\r/g, "").trim();


    const statementDateMatch = text.match(
      /STATEMENT\s+DATE\s+([A-Za-z]+\s+\d{1,2},\s+\d{4})/i
    );
    let statement_date = null;
    if (statementDateMatch) {
      const dateStr = statementDateMatch[1];
      const date = new Date(dateStr);
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear();
      statement_date = `${day}/${month}/${year}`;
    }

    const cardNumberMatch = text.match(/\d{4}X+(\d{4})/);
    const card_last4 = cardNumberMatch ? cardNumberMatch[1] : null;

    const dueDateMatch = text.match(
      /PAYMENT\s+DUE\s+DATE\s+([A-Za-z]+\s+\d{1,2},\s+\d{4})/i
    );
    let payment_due_date = null;
    if (dueDateMatch) {
      const dateStr = dueDateMatch[1];
      const date = new Date(dateStr);
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear();
      payment_due_date = `${day}/${month}/${year}`;
    }

    const totalDuesMatch = text.match(
      /Total\s+Amount\s+due\s+`([0-9,]+\.\d{2})/i
    );
    const total_dues = totalDuesMatch ? totalDuesMatch[1] : null;

    const minimumDueMatch = text.match(
      /Minimum\s+Amount\s+due\s+`([0-9,]+\.\d{2})/i
    );
    const minimum_amount_due = minimumDueMatch ? minimumDueMatch[1] : null;

    const result = {
      provider: "ICICI Bank",
      statement_date,
      card_last4,
      payment_due_date,
      total_dues,
      minimum_amount_due,
    };

    const extractedFields = Object.values(result).filter(
      (val) => val !== null && val !== "ICICI Bank"
    );

    if (extractedFields.length === 0) {
      throw new Error("Unable to extract any data from the statement");
    }

    return result;
  } catch (error) {
    throw new Error(`ICICI Parser Error: ${error.message}`);
  }
}


export function isIciciStatement(text) {
  const iciciIdentifiers = [
    /ICICI\s+BANK/i,
    /icicibank\.com/i,
    /CREDIT\s+CARD\s+STATEMENT/i,
  ];

  return iciciIdentifiers.some((pattern) => pattern.test(text));
}
