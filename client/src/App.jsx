import { useState } from "react";
import Navbar from "./components/Navbar";
import UploadCard from "./components/UploadCard";
import ResultTable from "./components/ResultTable";
import { Zap, Shield, Building2, Lock, Gauge } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

function App() {
  const [showResults, setShowResults] = useState(false);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const validateParsedData = (parsed) => {
    if (!parsed || typeof parsed !== 'object') {
      return { isValid: false, message: "Invalid response from server" };
    }

    const criticalFields = [
      'provider',
      'statement_date',
      'card_last4',
      'payment_due_date',
      'total_dues',
      'minimum_amount_due'
    ];

    for (const field of criticalFields) {
      const value = parsed[field];

      if (
        value === null ||
        value === undefined ||
        value === '' ||
        value === '0' ||
        value === 0 ||
        value === '0.00' ||
        value === 'N/A'
      ) {
        return {
          isValid: false,
          message: "Bank not supported or unable to extract data. Please ensure your statement is from a supported bank (HDFC, ICICI, Axis, SBI, Kotak)."
        };
      }
    }

    return { isValid: true };
  };

  const handleParse = async (file, bank) => {
    setLoading(true);
    setError(null);
    setShowResults(false);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("bank", bank);

      const response = await fetch(`${API_URL}/parse-statement`, {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        // Validate the parsed data
        const validation = validateParsedData(result.parsed);

        if (!validation.isValid) {
          setError(validation.message);
          return;
        }

        setData(result.parsed);
        setShowResults(true);
        setTimeout(() => {
          document.getElementById("results")?.scrollIntoView({ behavior: "smooth" });
        }, 100);
      } else {
        setError(result.error || "Failed to parse statement");
      }
    } catch (err) {
      console.error("API call failed:", err);
      setError("Failed to connect to the server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-base-200">
      <Navbar />

      <main className="container mx-auto px-4 py-12 max-w-5xl">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4">
            Parse Your Credit Card Statement
          </h1>
          <p className="text-xl text-base-content/70 max-w-2xl mx-auto">
            Upload your credit card statement and extract all the important details in seconds.
            Fast, secure, and accurate.
          </p>
        </div>

        {/* Feature Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <div className="card bg-base-100 shadow-sm">
            <div className="card-body p-4 text-center">
              <Building2 className="w-6 h-6 mx-auto mb-2" />
              <p className="text-xs font-semibold">Auto-detect Banks</p>
            </div>
          </div>

          <div className="card bg-base-100 shadow-sm">
            <div className="card-body p-4 text-center">
              <Shield className="w-6 h-6 mx-auto mb-2" />
              <p className="text-xs font-semibold">Supports HDFC, ICICI, Axis, SBI, Kotak</p>
            </div>
          </div>

          <div className="card bg-base-100 shadow-sm">
            <div className="card-body p-4 text-center">
              <Gauge className="w-6 h-6 mx-auto mb-2" />
              <p className="text-xs font-semibold">Latency &lt;100ms</p>
            </div>
          </div>

          <div className="card bg-base-100 shadow-sm">
            <div className="card-body p-4 text-center">
              <Zap className="w-6 h-6 mx-auto mb-2" />
              <p className="text-xs font-semibold">20x Faster than LLM</p>
            </div>
          </div>

          <div className="card bg-base-100 shadow-sm">
            <div className="card-body p-4 text-center">
              <Lock className="w-6 h-6 mx-auto mb-2" />
              <p className="text-xs font-semibold">No Privacy Concerns</p>
            </div>
          </div>
        </div>

        {/* Upload Card */}
        <div className="mb-8">
          <UploadCard
            onParse={handleParse}
            loading={loading}
            error={error}
          />
        </div>

        {/* Results Section */}
        {showResults && (
          <div id="results">
            <ResultTable data={data} />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="footer footer-center p-10 text-base-content">
        <aside>
          <p className="text-sm opacity-70">
            No external Dependecy . Your data is processed securely and never stored or passed .
          </p>
          <p className="text-xs opacity-60 mt-2">
            No external dependencies • No LLM • Complete privacy
          </p>
        </aside>
      </footer>
    </div>
  );
}

export default App;
