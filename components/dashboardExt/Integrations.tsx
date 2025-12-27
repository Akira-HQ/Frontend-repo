"use client";
import React, { useState, useMemo, useEffect } from "react";
import {
  CheckCircle,
  Zap,
  MessageSquare,
  ShoppingCart,
  Lock,
  Globe,
  RefreshCw,
  XCircle,
} from "lucide-react";
import { useAppContext } from "../AppContext";
import SetupGuidePanel from "./integrations/SetupGuide";
import ConfirmModal from "../notifications/CTAAlerts";

const NEON_PURPLE = "#A500FF";
const NEON_ORANGE = "#FFB300";
const ACCENT_BLUE = "#00A7FF";

type IntegrationStatus = "connected" | "error" | "pending" | "planned";

interface Integration {
  id: string;
  name: string;
  icon: React.FC<any>;
  status: IntegrationStatus;
  details: string;
  actionLabel: string;
  actionColor: string;
  subStatus?: string;
}

const MOCK_INTEGRATIONS: Integration[] = [
  {
    id: "shopify",
    name: "Shopify (Primary E-comm)",
    icon: ShoppingCart,
    status: "connected",
    details: "Status: Healthy.",
    subStatus: "Last webhook received: 1m ago.",
    actionLabel: "Disconnect",
    actionColor: "bg-green-600",
  },
  {
    id: "whatsapp",
    name: "WhatsApp Business API",
    icon: MessageSquare,
    status: "pending",
    details: "Setup required to enable sales conversations.",
    subStatus: "Not active: Setup required.",
    actionLabel: "Setup Now",
    actionColor: `bg-[${NEON_PURPLE}]`,
  },
  {
    id: "generic_web",
    name: "Generic Web Hook",
    icon: Globe,
    status: "pending",
    details: "For custom sites without platform plugins (requires JS snippet).",
    subStatus: "Not active: Requires code injection.",
    actionLabel: "Get Snippet",
    actionColor: `bg-[${ACCENT_BLUE}]`,
  },
  {
    id: "ai_core",
    name: "Cliva AI Core (Gemini)",
    icon: Zap,
    status: "connected",
    details: "Core conversational and intent engine. Data is anonymized.",
    subStatus: "Security audited.",
    actionLabel: "View Audit Logs",
    actionColor: "bg-gray-800",
  },
];

// --- Sub-Component: IntegrationItem ---
interface IntegrationItemProps {
  integration: Integration;
  onAction: (id: string, status: IntegrationStatus) => void;
  isDisabled: boolean;
}

const IntegrationItem: React.FC<IntegrationItemProps> = ({
  integration,
  onAction,
  isDisabled,
}) => {
  const Icon = integration.icon;
  const isActionDisabled = integration.status === "planned" || isDisabled;

  const buttonClassName = isActionDisabled
    ? "bg-gray-700 text-gray-400 cursor-not-allowed"
    : `bg-gradient-to-r from-[${ACCENT_BLUE}] to-[${NEON_PURPLE}] hover:from-[${NEON_PURPLE}] hover:to-[${NEON_ORANGE}] shadow-md shadow-purple-900/50`;

  return (
    <div className={`p-5 bg-gray-900 rounded-xl border border-gray-800 shadow-md flex flex-col justify-between transition duration-300 ${isDisabled ? 'opacity-50 cursor-default' : 'opacity-100 cursor-pointer'}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Icon className={`w-7 h-7 ${isDisabled ? 'text-gray-500' : 'text-[#00A7FF]'}`} />
          <h3 className={`text-lg font-semibold ${isDisabled ? 'text-gray-500' : 'text-white'}`}>{integration.name}</h3>
        </div>
        {isDisabled ? <Lock className="w-5 h-5 text-gray-500" /> : (
          integration.status === "connected" ? <CheckCircle className="w-5 h-5 text-green-400" /> :
            integration.status === "pending" ? <RefreshCw className="w-5 h-5 text-yellow-400 animate-spin" /> :
              <XCircle className="w-5 h-5 text-red-400" />
        )}
      </div>
      <p className="text-sm text-gray-400 mt-3 flex-grow">{integration.details}</p>
      <button
        onClick={() => !isDisabled && onAction(integration.id, integration.status)}
        disabled={isActionDisabled}
        className={`mt-4 w-full py-2 text-sm font-bold rounded-lg text-white transition duration-200 ${buttonClassName}`}
      >
        {isDisabled ? "Platform Mismatch" : integration.actionLabel}
      </button>
    </div>
  );
};

// --- Main Component: IntegrationsHub ---
const IntegrationsHub: React.FC = () => {
  const { user, addToast, syncQuotas } = useAppContext();
  const [integrations, setIntegrations] = useState(MOCK_INTEGRATIONS);
  const [modalOpen, setModalOpen] = useState(false);
  const [setupGuideOpen, setSetupGuideOpen] = useState(false);
  const [selectedIntegrationId, setSelectedIntegrationId] = useState<string | null>(null);

  const userPlatform = user?.store?.platform?.toUpperCase();
  const storeId = user?.store?.id; // Updated to match robust DB
  const snippetToken = user?.store?.snippetToken;

  // --- 1. NEURAL LINK (WebSocket) ---
  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (!token || !user) return;

      const ws = new WebSocket(`${process.env.NEXT_PUBLIC_WS_URL}?token=${token}&type=dashboard`);

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        // Refresh if an integration was verified or changed in the background
        if (data.type === "INTEGRATION_VERIFIED" || data.type === "QUOTA_UPDATE") {
          syncQuotas(); // Re-fetch user/store state
          addToast(data.message || "Connection Verified!", "success");
        }
      };

      return () => ws.close();
    }
  }, [user?.id, syncQuotas, addToast]);

  // --- 2. INTEGRATION LOCKING LOGIC ---
  const integrationsWithStatus = useMemo(() => {
    return MOCK_INTEGRATIONS.map(integration => {
      let isDisabled = false;
      let requiresPlatform = '';

      switch (integration.id) {
        case 'generic_web':
          isDisabled = userPlatform !== 'CUSTOM';
          requiresPlatform = 'Custom Site';
          break;
        case 'shopify':
          isDisabled = userPlatform !== 'SHOPIFY';
          requiresPlatform = 'Shopify';
          break;
        case 'whatsapp':
          isDisabled = userPlatform !== 'WHATSAPP_BUSINESS';
          requiresPlatform = 'WhatsApp Business';
          break;
        case 'ai_core':
          isDisabled = false;
          break;
        default:
          isDisabled = true;
          requiresPlatform = 'Your Current Platform';
          break;
      }

      return {
        ...integration,
        details: isDisabled ? `Locked: This integration is designed for the ${requiresPlatform} platform.` : integration.details,
        actionLabel: isDisabled ? "Platform Mismatch" : integration.actionLabel,
        isDisabled,
      };
    });
  }, [userPlatform]);

  const handleAction = (id: string, status: IntegrationStatus) => {
    const integration = integrationsWithStatus.find(i => i.id === id);
    if (integration?.isDisabled) {
      addToast(`Integration locked: Requires the ${integration.name} platform.`, "error");
      return;
    }

    if (status === "connected") {
      if (id === "shopify") {
        setSelectedIntegrationId(id);
        setModalOpen(true);
      } else if (id === "ai_core") {
        addToast(`Opening Gemini audit logs...`, "info");
      }
      return;
    }

    if (status === "pending" || status === "error") {
      if (!storeId || !snippetToken) {
        addToast("Please complete your store registration first.", "info");
        return;
      }
      setSetupGuideOpen(true);
      setSelectedIntegrationId(id);
    }
  };

  const handleDisconnectConfirm = (id: string) => {
    addToast(`Integration ${id} disconnected. Data sync paused.`, "error");
    setModalOpen(false);
    setSelectedIntegrationId(null);
    // In production, call your /products/disconnect-store endpoint here
  };

  return (
    <div className="py-4 px-2 w-full h-full text-white pt-10 ml-6 relative ">
      <h1 className="text-3xl font-bold mb-4">Integrations Hub</h1>
      <p className="text-gray-400 mb-8 max-w-2xl">
        Connect your e-commerce platforms and messaging channels to activate Cliva's full sales potential.
      </p>

      <div className="bg-[#0b0b0b] rounded-xl p-6 shadow-2xl border border-gray-800">
        <h2 className="text-xl font-bold mb-6 border-b border-gray-800 pb-3 flex items-center gap-2">
          <Globe className="w-5 h-5 text-[#FFB300]" /> Connected Platforms & Future Roadmap
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {integrationsWithStatus.map((integration) => (
            <IntegrationItem
              key={integration.id}
              integration={integration}
              onAction={handleAction}
              isDisabled={integration.isDisabled}
            />
          ))}
        </div>
      </div>

      {modalOpen && selectedIntegrationId && (
        <ConfirmModal
          title={`Disconnect ${selectedIntegrationId.toUpperCase()}?`}
          message={`This is a sensitive action. Disconnecting this platform will stop all real-time data sync, RAG updates, and AI sales activity immediately.`}
          onConfirm={() => handleDisconnectConfirm(selectedIntegrationId)}
          onCancel={() => setModalOpen(false)}
          confirmText={`Yes, Disconnect ${selectedIntegrationId.toUpperCase()}`}
          cancelText="Keep Connected"
        />
      )}

      {setupGuideOpen && selectedIntegrationId && (
        <SetupGuidePanel
          integrationName={MOCK_INTEGRATIONS.find((i) => i.id === selectedIntegrationId)?.name || "Integration"}
          onClose={() => setSetupGuideOpen(false)}
          storeId={storeId}
          snippetToken={snippetToken}
        />
      )}
    </div>
  );
};

export default IntegrationsHub;