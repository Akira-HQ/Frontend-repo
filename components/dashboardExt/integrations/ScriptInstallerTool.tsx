"use client";
import React, { useState } from "react";
import { Copy, CheckCircle2 } from "lucide-react";

interface ScriptInstallerToolProps {
  storeId: string;
}

const ScriptInstallerTool: React.FC<ScriptInstallerToolProps> = ({ storeId }) => {
  const [copied, setCopied] = useState(false);
  const [verified, setVerified] = useState<null | boolean>(null);

  const clivaScript = `<script src="https://cliva.ai/widget.js" data-store-id="${storeId}" async></script>`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(clivaScript);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const verifyInstallation = async () => {
    try {
      // Replace this with your backend verification logic
      const res = await fetch(`/api/verify-script?storeId=${storeId}`);
      const data = await res.json();
      setVerified(data.installed);
    } catch (err) {
      console.error(err);
      setVerified(false);
    }
  };

  return (
    <div className="w-full mt-10">
      <h2 className="text-xl font-semibold text-[#FFB02E] mb-3">Cliva Script Installer</h2>

      <p className="text-white mb-3">
        Copy and paste the following script into your store's &lt;head&gt; section:
      </p>

      <div className="flex items-center gap-2 mb-4">
        <input
          type="text"
          readOnly
          value={clivaScript}
          className="flex-1 px-4 py-2 rounded-lg bg-[#0E0E0F] text-white border border-[#2A2A2D] focus:outline-none"
        />
        <button
          onClick={copyToClipboard}
          className={`px-4 py-2 rounded-lg ${copied ? "bg-green-600 text-white" : "bg-[#FFB02E] text-black"
            }`}
        >
          {copied ? (
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" /> Copied
            </span>
          ) : (
            <span className="flex items-center gap-1">
              <Copy className="w-4 h-4" /> Copy
            </span>
          )}
        </button>
      </div>

      <button
        onClick={verifyInstallation}
        className="mt-2 bg-[#FFB02E] text-black px-6 py-2 rounded-lg font-medium"
      >
        Verify Installation
      </button>

      {verified !== null && (
        <p
          className={`mt-3 font-medium ${verified ? "text-green-400" : "text-red-400"
            }`}
        >
          {verified
            ? "✅ Script installed successfully!"
            : "❌ Script not detected on your store."}
        </p>
      )}
    </div>
  );
};

export default ScriptInstallerTool;
