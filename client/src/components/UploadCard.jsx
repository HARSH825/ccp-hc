import { useState } from "react";
import { Upload, File, X, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

const UploadCard = ({ onParse, loading, error }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [detectedBank, setDetectedBank] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === "application/pdf") {
      setSelectedFile(file);
      detectBank(file);
    } else {
      alert("Please select a PDF file");
      e.target.value = null;
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type === "application/pdf") {
      setSelectedFile(file);
      detectBank(file);
    } else {
      alert("Please select a PDF file");
    }
  };

  const detectBank = (file) => {
    const filename = file.name.toLowerCase();
    if (filename.includes("hdfc")) setDetectedBank("hdfc");
    else if (filename.includes("icici")) setDetectedBank("icici");
    else if (filename.includes("axis")) setDetectedBank("axis");
    else if (filename.includes("sbi")) setDetectedBank("sbi");
    else if (filename.includes("kotak")) setDetectedBank("kotak");
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setDetectedBank(null);
  };

  const handleParse = () => {
    if (!selectedFile) {
      alert("Please select a PDF file first");
      return;
    }
    onParse(selectedFile, detectedBank);
  };

  const bankDisplayNames = {
    hdfc: "HDFC Bank",
    icici: "ICICI Bank",
    axis: "Axis Bank",
    sbi: "State Bank of India",
    kotak: "Kotak Mahindra Bank",
  };

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        {error && (
          <div role="alert" className="alert alert-error mb-4">
            <AlertCircle className="w-5 h-5" />
            <span>{error}</span>
          </div>
        )}

        {/* Success Detection - GREEN */}
        {detectedBank && !error && (
          <div role="alert" className="alert alert-success mb-4">
            <CheckCircle2 className="w-5 h-5" />
            <span>
              Successfully detected: <strong>{bankDisplayNames[detectedBank]}</strong>
            </span>
          </div>
        )}

        {/* File Selected View */}
        {selectedFile ? (
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 bg-base-200 rounded-lg">
              <File className="w-8 h-8" />
              <div className="flex-1">
                <p className="font-medium">{selectedFile.name}</p>
                <p className="text-sm opacity-60">
                  {(selectedFile.size / 1024).toFixed(2)} KB
                </p>
              </div>
              <button
                className="btn btn-ghost btn-sm btn-circle"
                onClick={handleRemoveFile}
                disabled={loading}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <button
              className="btn btn-neutral btn-block"
              onClick={handleParse}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Processing...
                </>
              ) : (
                "Parse Statement"
              )}
            </button>
          </div>
        ) : (
          /* Upload Area */
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-lg p-12 text-center transition-all ${isDragging ? "border-primary bg-primary/10" : "border-base-300"
              }`}
          >
            <Upload className="w-16 h-16 mx-auto mb-4 opacity-40" />
            <label htmlFor="file-upload" className="cursor-pointer">
              <span className="link link-primary font-semibold">Choose a file</span>
              <span className="opacity-70"> or drag and drop</span>
            </label>
            <input
              id="file-upload"
              type="file"
              accept="application/pdf"
              onChange={handleFileChange}
              className="hidden"
            />
            <p className="text-sm opacity-60 mt-2">PDF files only (Max 10MB)</p>
          </div>
        )}

        {/* Security Note */}
        <p className="text-xs text-center opacity-60 mt-4">
          Your data is processed securely and not stored on our servers
        </p>
      </div>
    </div>
  );
};

export default UploadCard;
