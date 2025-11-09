
export function parseKotakStatement(text) {
  try {
    text = text.replace(/\r/g, "").trim();


    const statementDateMatch = text.match(
      /StatementDate(\d{2}-[A-Za-z]{3}-\d{4})/
    );

    let statement_date = null;
    if (statementDateMatch) {
      statement_date = convertKotakDate(statementDateMatch[1]);
    }

    const cardNumberMatch = text.match(/PrimaryCardNumber\d{4}X+(\d{4})/);
    const card_last4 = cardNumberMatch ? cardNumberMatch[1] : null;

    const dueDateMatch = text.match(/Remembertopayby(\d{2}-[A-Za-z]{3}-\d{4})/);

    let payment_due_date = null;
    if (dueDateMatch) {
      payment_due_date = convertKotakDate(dueDateMatch[1]);
    } else if (
      text.includes("Nopaymentrequired") ||
      text.includes("No payment required")
    ) {
      payment_due_date = "N/A";
    }


    const totalDuesMatch = text.match(
      /TotalAmountDue\(TAD\)Rs\.([\d,]+\.\d{2})/
    );
    const total_dues = totalDuesMatch ? totalDuesMatch[1] : null;


    const minimumDueMatch = text.match(
      /MinimumAmountDue\(MAD\)Rs\.([\d,]+\.\d{2})/
    );
    const minimum_amount_due = minimumDueMatch ? minimumDueMatch[1] : null;

    const result = {
      provider: "Kotak Mahindra Bank",
      statement_date,
      card_last4,
      payment_due_date,
      total_dues,
      minimum_amount_due,
    };

    const extractedFields = Object.values(result).filter(
      (val) => val !== null && val !== "Kotak Mahindra Bank"
    );

    if (extractedFields.length === 0) {
      throw new Error("Unable to extract any data from the statement");
    }

    return result;
  } catch (error) {
    throw new Error(`Kotak Parser Error: ${error.message}`);
  }
}


function convertKotakDate(dateStr) {
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

  const match = dateStr.match(/(\d{2})-([A-Za-z]{3})-(\d{4})/);
  if (match) {
    const day = match[1];
    const month = monthMap[match[2]];
    const year = match[3];
    return `${day}/${month}/${year}`;
  }

  return dateStr;
}


export function isKotakStatement(text) {
  const kotakIdentifiers = [
    /Kotak\s+Mahindra\s+Bank/i,
    /kotak\.com/i,
    /PrimaryCardNumber/i,
    /CustomerRelationshipNumber/i,
  ];

  return kotakIdentifiers.some((pattern) => pattern.test(text));
}
