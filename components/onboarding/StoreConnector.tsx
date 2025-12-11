// --- StoreConnector.tsx (FINAL ADJUSTED CODE) ---

"use client";
import React from 'react';
import { useRouter } from 'next/navigation';
import { useAppContext } from '../AppContext';
import { UseAPI } from '../hooks/UseAPI';
import Button from '../Button';
import { Lock } from 'lucide-react';
import { formatUrl } from './FormatUrl';

interface StoreConnectorProps {
  platform: string;
  url: string;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  onValidatedSubmit: (e: React.FormEvent) => Promise<void>;
}

const StoreConnector: React.FC<StoreConnectorProps> = ({
  platform,
  url,
  loading,
  setLoading,
  onValidatedSubmit
}) => {
  const router = useRouter();
  const { addToast, setUser } = useAppContext();
  const { callApi } = UseAPI();

  const handleConnection = async (e: React.FormEvent) => {
    // Prevent the parent form's default submission side-effects
    e.preventDefault();

    // Manual validation (since we bypass the parent form's submit handler)
    if (!platform || !url) {
      addToast("Please select a platform and enter the URL.", "error");
      return;
    }

    setLoading(true);

    const normalizedUrl = formatUrl(url, platform);

    try {
      if (platform.toLowerCase() === 'shopify') {

        // --- SHOPIFY: REDIRECT TO AUTHENTICATION ---

        addToast("Initiating Shopify connection...", "loading");

        // ⚡ MODIFIED: Endpoint is now just /shopify/auth ⚡
        const response = await callApi("/shopify/auth", "POST", {
          url: normalizedUrl,
          platform: 'SHOPIFY',
        });

        if (response.oauthUrl) {
          window.location.href = response.oauthUrl;
          return;
        } else {
          throw new Error("Missing Shopify authorization URL from server.");
        }

      } else {

        // --- CUSTOM SITE / OTHERS: DIRECT API CALL ---

        addToast("Creating custom store record...", "loading");

        // ⚡ MODIFIED: Endpoint is now just /create-store ⚡
        const response = await callApi("/create-store", "POST", {
          url: normalizedUrl,
          platform: platform.toUpperCase(),
        });

        setUser(response.data);

        addToast("Store connected. Redirecting to Integration Hub.", "success");
        router.push(`/dashboard?view=integrations`);
      }
    } catch (error: any) {
      addToast(error.message || `Failed to connect ${platform} store.`, "error");
    } finally {
      setLoading(false);
    }
  };

  const isInputReady = url && platform;
  const buttonText = loading
    ? "Connecting..."
    : platform === 'shopify'
      ? "Connect with Shopify"
      : "Finalize & Launch Akira";

  return (
    <>
      <Button
        type="submit"
        className="w-full font-semibold mt-6"
        onClick={() => handleConnection}
        disabled={loading || !isInputReady}
      >
        {buttonText}
      </Button>

      {/* Optional Lock/Info */}
      {!isInputReady && (
        <p className="text-gray-500 text-sm mt-3 flex items-center justify-center gap-1">
          <Lock className="w-4 h-4" /> Select platform and enter URL to enable connection.
        </p>
      )}
    </>
  );
};

export default StoreConnector;