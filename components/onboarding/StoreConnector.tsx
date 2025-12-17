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
  // ⚡ Ensure 'user' is destructured from context ⚡
  const { addToast, setUser, user } = useAppContext();
  const { callApi } = UseAPI();

  const handleConnection = async (e: React.FormEvent) => {
    if (e && typeof e.preventDefault === 'function') {
      e.preventDefault();
    }

    if (!platform || !url) {
      addToast("Please select a platform and enter the URL.", "error");
      return;
    }

    setLoading(true);

    const normalizedUrl = formatUrl(url, platform);

    try {
      if (platform.toLowerCase() === 'shopify') {

        // --- SHOPIFY FLOW (Auth initiated) ---
        addToast("Initiating Shopify connection...", "loading");

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

        const response = await callApi("/create-store", "POST", {
          url: normalizedUrl,
          platform: platform.toUpperCase(),
        });

        setUser(response.data);

        // ⚡ CHECK FOR FREE PLAN BEFORE REDIRECTING TO PAYMENT ⚡
        const userPlan = response.data?.plan || user?.plan || 'basic';

        if (userPlan.toLowerCase() === 'free') {
          // DIRECT TO DASHBOARD: Skip payment wall for free users
          addToast("Free plan activated! Welcome to your dashboard.", "success");
          router.push(`/dashboard?view=integrations`);
        } else {
          // REDIRECT TO PAYMENT: Paid plan requires payment wall
          addToast("Store connected. Redirecting to billing.", "success");
          router.push(`/register/payment-wall?plan=${userPlan}&store=${normalizedUrl}`);
        }
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
        onClick={() => handleConnection({} as React.FormEvent)}
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