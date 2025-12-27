"use client";
import React, { useEffect } from 'react';
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
  const { addToast, setUser, user, syncQuotas } = useAppContext();
  const { callApi } = UseAPI();

  // --- 1. NEURAL LINK (WebSocket) ---
  // Listens for backend signals that the store connection is physically verified
  // useEffect(() => {
  //   if (typeof window !== "undefined") {
  //     const token = localStorage.getItem("token");
  //     if (!token || !user) return;

  //     const ws = new WebSocket(`${process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8000'}?token=${token}&type=dashboard`);

  //     ws.onmessage = (event) => {
  //       const data = JSON.parse(event.data);
  //       // If a Shopify webhook or auth flow completes in the background
  //       if (data.type === "STORE_CONNECTED" || data.type === "INTEGRATION_VERIFIED") {
  //         syncQuotas(); // Refresh user state to reflect the new store status
  //         addToast(data.message || "Store successfully linked!", "success");
  //       }
  //     };

  //     return () => ws.close();
  //   }
  // }, [user, syncQuotas, addToast]);

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
        // --- SHOPIFY FLOW ---
        addToast("Initiating Shopify connection...", "loading");

        const response = await callApi("/shopify/auth", "POST", {
          url: normalizedUrl,
          platform: 'SHOPIFY',
        });

        if (response.oauthUrl) {
          // Redirect to Shopify App Installation page
          window.location.href = response.oauthUrl;
          return;
        } else {
          throw new Error("Missing Shopify authorization URL from server.");
        }

      } else {
        // --- CUSTOM SITE / OTHERS ---
        addToast("Creating custom store record...", "loading");

        const response = await callApi("/create-store", "POST", {
          url: normalizedUrl,
          platform: platform.toUpperCase(),
        });

        // Update local user state with new store details
        setUser(response.data);

        // Aligned with Robust DB plan logic
        const userPlan = response.data?.plan || user?.plan || 'FREE';

        if (userPlan.toUpperCase() === 'FREE') {
          addToast("Free plan activated! Welcome to your dashboard.", "success");
          router.push(`/dashboard?view=integrations`);
        } else {
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
      : "Finalize & Launch Cliva";

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

      {!isInputReady && (
        <p className="text-gray-500 text-sm mt-3 flex items-center justify-center gap-1">
          <Lock className="w-4 h-4" /> Select platform and enter URL to enable connection.
        </p>
      )}
    </>
  );
};

export default StoreConnector;