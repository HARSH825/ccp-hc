import { CheckCircle } from "lucide-react";

const ResultTable = ({ data }) => {
  if (!data) return null;

  const formatCurrency = (amount) => {
    if (!amount) return "N/A";

    // Remove commas and parse the number
    const numericAmount = parseFloat(amount.toString().replace(/,/g, ''));

    if (isNaN(numericAmount)) return "N/A";

    // Format with Indian locale
    return `₹${numericAmount.toLocaleString("en-IN")}`;
  };

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        {/* Success Header - GREEN */}
        <div role="alert" className="alert alert-success">
          <CheckCircle className="w-6 h-6" />
          <span className="font-semibold">Successfully extracted data from your statement</span>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto mt-6">
          <table className="table table-zebra">
            <tbody>
              <tr>
                <th>Bank Provider</th>
                <td>{data.provider || "N/A"}</td>
              </tr>
              <tr>
                <th>Card Number (Last 4)</th>
                <td className="font-mono">•••• •••• •••• {data.card_last4 || "****"}</td>
              </tr>
              <tr>
                <th>Statement Date</th>
                <td>{data.statement_date || "N/A"}</td>
              </tr>
              <tr>
                <th>Payment Due Date</th>
                <td>{data.payment_due_date || "N/A"}</td>
              </tr>
              <tr>
                <th>Total Amount Due</th>
                <td className="font-bold text-success">{formatCurrency(data.total_dues)}</td>
              </tr>
              <tr>
                <th>Minimum Amount Due</th>
                <td className="font-semibold">{formatCurrency(data.minimum_amount_due)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="text-xs opacity-60 text-center mt-4">
          Data extracted on {new Date().toLocaleDateString()} at{" "}
          {new Date().toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
};

export default ResultTable;
