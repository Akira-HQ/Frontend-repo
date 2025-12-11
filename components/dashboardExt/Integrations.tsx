"use client";
import React, { useState, useMemo } from "react";
import {
  CheckCircle,
  Zap,
  MessageSquare,
  ShoppingCart,
  Lock,
  Globe,
  RefreshCw,
  XCircle,
  AlertTriangle,
  X,
  Copy,
  Code,
} from "lucide-react";
import { useAppContext } from "../AppContext";
import SetupGuidePanel from "./integrations/SetupGuide";
import ConfirmModal from "../notifications/CTAAlerts";

// ⚡ 1. IMPORT THE EXTERNAL COMPONENT ⚡

// Assuming User and related interfaces are imported from AppContext/types

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

// --- DATA ---
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
    name: "Akira AI Core (Gemini)",
    icon: Zap,
    status: "connected",
    details: "Core conversational and intent engine. Data is anonymized.",
    subStatus: "Security audited.",
    actionLabel: "View Audit Logs",
    actionColor: "bg-gray-800",
  },
];



// --- 2. IntegrationItem Component (Modular Piece) ---
interface IntegrationItemProps {
  integration: Integration;
  onAction: (id: string, status: IntegrationStatus) => void;
  isDisabled: boolean; // ⚡ NEW PROP
}

const getStatusIndicator = (status: IntegrationStatus, isDisabled: boolean) => {
  if (isDisabled) return <Lock className="w-5 h-5 text-gray-500" />; // Lock icon for inaccessibility
  switch (status) {
    case "connected":
      return <CheckCircle className="w-5 h-5 text-green-400" />;
    case "pending":
      return <RefreshCw className="w-5 h-5 text-yellow-400 animate-spin" />;
    case "error":
      return <XCircle className="w-5 h-5 text-red-400" />;
    case "planned":
    default:
      return <Lock className="w-5 h-5 text-gray-500" />;
  }
};

const IntegrationItem: React.FC<IntegrationItemProps> = ({
  integration,
  onAction,
  isDisabled, // ⚡ Use new prop
}) => {
  const Icon = integration.icon;
  // Check if the item is disabled by platform OR by its original 'planned' status
  const isActionDisabled = integration.status === "planned" || isDisabled;

  // Dynamic button styles for platform lock
  const buttonClassName = isActionDisabled
    ? "bg-gray-700 text-gray-400 cursor-not-allowed"
    : `bg-gradient-to-r from-[${ACCENT_BLUE}] to-[${NEON_PURPLE}] hover:from-[${NEON_PURPLE}] hover:to-[${NEON_ORANGE}] shadow-md shadow-purple-900/50`;

  // Dynamic card opacity for visual feedback (Visible but disabled)
  const cardOpacity = isDisabled ? 'opacity-50' : 'opacity-100'; // Keep card visible, only dampen
  const cardCursor = isDisabled ? 'cursor-default' : 'cursor-pointer'; // Disable card interaction
  const cardBorder = isDisabled ? 'border-gray-800' : 'border-gray-800';

  return (
    <div
      key={integration.id}
      className={`p-5 bg-gray-900 rounded-xl border ${cardBorder} shadow-md flex flex-col justify-between transition duration-300 ${cardOpacity} ${cardCursor}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Icon className={`w-7 h-7 ${isDisabled ? 'text-gray-500' : 'text-[#00A7FF]'}`} />
          <h3 className={`text-lg font-semibold ${isDisabled ? 'text-gray-500' : 'text-white'}`}>
            {integration.name}
          </h3>
        </div>
        {getStatusIndicator(integration.status, isDisabled)}
      </div>

      <p className="text-sm text-gray-400 mt-3 flex-grow">
        {isDisabled
          ? `Locked: This integration is designed for the ${integration.name} platform.`
          : integration.details
        }
      </p>

      {integration.subStatus && !isDisabled && (
        <p className="text-xs text-gray-500 mt-1 italic">
          {integration.subStatus}
        </p>
      )}

      <button
        onClick={() => {
          if (!isDisabled) onAction(integration.id, integration.status);
        }}
        disabled={isActionDisabled}
        className={`mt-4 w-full py-2 text-sm font-bold rounded-lg text-white transition duration-200 ${buttonClassName}`}
      >
        {isDisabled ? "Platform Mismatch" : integration.actionLabel}
      </button>
    </div>
  );
};

// --- 3. Integration Setup Guide Panel ---
// The component definition is now EXTERNAL. We remove the local definition.

interface SetupGuidePanelProps {
  integrationName: string;
  onClose: () => void;
  storeId: string | undefined;
  snippetToken: string | undefined;
}

// --- 4. IntegrationsHub Component (The Orchestrator) ---

const IntegrationsHub: React.FC = () => {
  const { user } = useAppContext();
  const { addToast } = useAppContext();
  const [integrations, setIntegrations] = useState(MOCK_INTEGRATIONS);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [setupGuideOpen, setSetupGuideOpen] = useState<boolean>(false);
  const [selectedIntegrationId, setSelectedIntegrationId] = useState<
    string | null
  >(null);

  // Get the user's platform from context (ensure uppercase from DB is handled)
  const userPlatform = user?.store?.platform?.toUpperCase();

  // Define constants for platform checks
  const isCustomPlatform = userPlatform === 'CUSTOM';
  const isShopifyPlatform = userPlatform === 'SHOPIFY';
  const isWhatsAppBusinessPlatform = userPlatform === 'WHATSAPP_BUSINESS';
  // Note: isWooCommercePlatform is not needed here as it will default to isDisabled=true

  // Memoize the necessary store data
  const storeId = user?.store?.storeId;
  const snippetToken = user?.store?.snippetToken;

  // ⚡ FINALIZED INTEGRATION LOCKING LOGIC ⚡
  const integrationsWithStatus = useMemo(() => {
    return MOCK_INTEGRATIONS.map(integration => {
      let isDisabled = false;
      let requiresPlatform = '';

      switch (integration.id) {
        case 'generic_web':
          // ONLY ACTIONABLE if the platform is CUSTOM
          isDisabled = !isCustomPlatform;
          requiresPlatform = 'Custom Site';
          break;
        case 'shopify':
          // ONLY ACTIONABLE if the platform is SHOPIFY
          isDisabled = !isShopifyPlatform;
          requiresPlatform = 'Shopify';
          break;
        case 'whatsapp':
          // ONLY ACTIONABLE if the platform is WHATSAPP_BUSINESS (or whichever platform is the chat hub)
          isDisabled = !isWhatsAppBusinessPlatform;
          requiresPlatform = 'WhatsApp Business';
          break;
        case 'ai_core':
          // Always accessible, regardless of store platform
          isDisabled = false;
          break;
        default:
          // Default lock for all others
          isDisabled = true;
          requiresPlatform = 'Your Current Platform';
          break;
      }

      // Apply the custom locked message detail
      const lockedDetails = `Locked: This integration is designed for the ${requiresPlatform} platform.`;

      // Check if the integration should have its details overridden due to locking
      const detailsOverride = isDisabled ? {
        details: lockedDetails,
        actionLabel: "Platform Mismatch",
      } : {};

      // Return a new object that includes the calculated disabled status and potentially overridden details
      return {
        ...integration,
        ...detailsOverride, // Overrides original details/actionLabel if locked
        isDisabled: isDisabled,
      };
    });
  }, [userPlatform]); // Recalculate if userPlatform changes


  const handleDisconnectConfirm = (id: string) => {
    // ... (Disconnect logic)
    setIntegrations((prev) =>
      prev.map((i) =>
        i.id === id
          ? {
            ...i,
            status: "error",
            actionLabel: "Reconnect",
            actionColor: "bg-red-600",
            details:
              "Connection manually terminated by user. Data sync paused.",
            subStatus: "Action required.",
          }
          : i,
      ),
    );
    addToast(`Integration ${id} disconnected. Data sync paused.`, "error");
    setModalOpen(false);
    setSelectedIntegrationId(null);
  };

  const handleAction = (id: string, status: IntegrationStatus) => {
    // 1. Get the current integration object from the calculated list
    const integration = integrationsWithStatus.find(i => i.id === id);

    if (integration?.isDisabled) {
      // If the item is marked as disabled (Platform Mismatch), do nothing and alert user.
      addToast(`Integration locked: Requires the ${integration.name} platform.`, "error");
      return;
    }

    console.log(`Action triggered for: ${id}. Current Status: ${status}`);

    if (status === "connected") {
      if (id === "shopify") {
        setSelectedIntegrationId(id);
        setModalOpen(true);
      } else if (id === "ai_core") {
        addToast(`Opening Gemini audit logs...`, "info");
      }
      return;
    }

    // Handle Get Snippet/Setup Now action
    if (status === "pending" || status === "error") {
      if (!storeId || !snippetToken) {
        // If user data is missing, alert the user to complete their profile/store creation first.
        addToast("Please complete your store registration first.", "info");
        return;
      }
      // ⚡ 2. TRIGGER THE SETUP GUIDE OVERLAY ⚡
      setSetupGuideOpen(true);
      setSelectedIntegrationId(id);
    } else if (status === "planned") {
      addToast(`You have joined the waitlist for ${id}.`, "info");
    }
  };

  return (
    <div className="py-4 px-2 w-full h-full text-white pt-10 ml-6 relative ">
      <h1 className="text-3xl font-bold mb-4">Integrations Hub</h1>
      <p className="text-gray-400 mb-8 max-w-2xl">
        Connect your e-commerce platforms and messaging channels to activate
        Akira's full sales potential.
      </p>

      <div className="bg-[#0b0b0b] rounded-xl p-6 shadow-2xl border border-gray-800">
        <h2 className="text-xl font-bold mb-6 border-b border-gray-800 pb-3 flex items-center gap-2">
          <Globe className="w-5 h-5 text-[#FFB300]" /> Connected Platforms &
          Future Roadmap
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {integrationsWithStatus.map((integration) => (
            <IntegrationItem
              key={integration.id}
              integration={integration}
              onAction={handleAction}
              isDisabled={integration.isDisabled} // ⚡ Pass the disabled status
            />
          ))}
        </div>
      </div>

      {/* Custom Modal Rendering (for sensitive Disconnect action) */}
      {modalOpen && selectedIntegrationId && (
        <ConfirmModal
          title={`Disconnect ${selectedIntegrationId.toUpperCase()}?`}
          message={`This is a sensitive action. Disconnecting this platform will stop all real-time data sync, RAG updates, and AI sales activity immediately. Are you sure you want to proceed?`}
          onConfirm={() => handleDisconnectConfirm(selectedIntegrationId)}
          onCancel={() => setModalOpen(false)}
          confirmText={`Yes, Disconnect ${selectedIntegrationId.toUpperCase()}`}
          cancelText="Keep Connected"
        />
      )}

      {/* ⚡ 3. RENDER THE IMPORTED SetupGuide COMPONENT ⚡ */}
      {setupGuideOpen && selectedIntegrationId && (
        <SetupGuidePanel
          integrationName={
            MOCK_INTEGRATIONS.find((i) => i.id === selectedIntegrationId)
              ?.name || "Integration"
          }
          onClose={() => setSetupGuideOpen(false)}
          storeId={storeId}
          snippetToken={snippetToken}
        />
      )}
    </div>
  );
};

export default IntegrationsHub;