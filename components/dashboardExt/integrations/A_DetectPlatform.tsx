"use client";
import React, { useState } from "react";
import { Loader2, Globe, CheckCircle2, AlertCircle } from "lucide-react";
import { UseAPI } from "@/components/hooks/UseAPI"; // adjust path if different

interface DetectPlatformProps {
  onDetected: (platform: string) => void;
}

const DetectPlatform: React.FC<DetectPlatformProps> = ({ onDetected }) => {
  const { callApi } = UseAPI();
  const [domain, setDomain] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<null | string>(null);
  const [error, setError] = useState<string | null>(null);

  const detectPlatform = async () => {
    if (!domain.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      // Now we call your Express endpoint via the unified hook
      const data = await callApi("/detect", "POST", { domain });

      if (data?.platform) {
        setResult(data.platform);
        onDetected(data.platform);
      } else {
        setError("Unknown platform. Try manual setup.");
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Unable to check the site. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto bg-[#1A1A1C] border border-[#2A2A2D] p-6 rounded-2xl shadow-lg">
      <h2 className="text-2xl font-semibold text-[#FFB02E] mb-4 flex items-center gap-2">
        <Globe className="w-6 h-6" />
        Detect Your Platform
      </h2>

      <p className="text-[#CFCFCF] text-sm mb-4">
        Enter your website URL and Cliva will automatically detect whether
        you're using Shopify, WooCommerce, WordPress, or a custom site.
      </p>

      {/* Input + Button */}
      <div className="flex gap-3">
        <input
          className="flex-1 bg-[#0E0E0F] border border-[#2A2A2D] text-white placeholder:text-[#7A7A7A] px-4 py-2 rounded-lg outline-none focus:border-[#FFB02E]"
          placeholder="https://yourstore.com"
          value={domain}
          onChange={(e) => setDomain(e.target.value)}
        />

        <button
          className="bg-[#FFB02E] text-black font-medium px-4 py-2 rounded-lg hover:bg-[#e79b21] transition disabled:opacity-50"
          onClick={detectPlatform}
          disabled={loading}
        >
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            "Detect"
          )}
        </button>
      </div>

      {/* Detected Platform */}
      {result && (
        <div className="mt-5 flex items-center gap-3 p-3 bg-[#0E0E0F] border border-[#2A2A2D] rounded-xl">
          <CheckCircle2 className="w-5 h-5 text-green-400" />
          <p className="text-[#CFCFCF]">
            Detected Platform:{" "}
            <span className="text-white font-medium uppercase">{result}</span>
          </p>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mt-5 flex items-center gap-3 p-3 bg-[#0E0E0F] border border-red-700/40 rounded-xl">
          <AlertCircle className="w-5 h-5 text-red-400" />
          <p className="text-red-300 text-sm">{error}</p>
        </div>
      )}
    </div>
  );
};

export default DetectPlatform;
