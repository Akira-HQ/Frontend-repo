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
  AlertTriangle,
  X,
  Copy,
  Code,
} from "lucide-react";
import { useAppContext } from "../AppContext";



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
// (Your MOCK_INTEGRATIONS array is used directly)
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

// --- 1. Custom Confirmation Modal (Reused) ---
// (Your ConfirmModal component remains here)
interface ConfirmModalProps {
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
}
const ConfirmModal: React.FC<ConfirmModalProps> = ({
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = "Confirm",
  cancelText = "Cancel",
}) => {
  // ... (ConfirmModal implementation) ...
  return (
    <div className="fixed inset-0 z-[9000] flex items-center justify-center bg-gray-950/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-sm bg-gray-900 rounded-2xl border border-gray-800 shadow-2xl shadow-purple-900/50 p-6 transform transition-all duration-300 scale-100">
        <div className="flex items-start space-x-3 border-b border-gray-800 pb-4">
          <AlertTriangle className="w-6 h-6 text-red-500 flex-shrink-0" />
          <h3 className="text-xl font-bold text-white flex-1">{title}</h3>
          <button
            onClick={onCancel}
            className="text-gray-500 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="mt-4">
          <p className="text-sm text-gray-400">{message}</p>
        </div>
        <div className="mt-6 flex justify-end space-x-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm font-semibold rounded-lg text-gray-400 bg-gray-800 hover:bg-gray-700 transition"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 text-sm font-bold rounded-lg text-white bg-gradient-to-r from-[${ACCENT_BLUE}] to-[${NEON_PURPLE}] hover:from-[${NEON_PURPLE}] hover:to-[${NEON_ORANGE}] transition shadow-md shadow-purple-900/50`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

// --- 2. IntegrationItem Component (Modular Piece) ---
// (Your IntegrationItem component remains here)
interface IntegrationItemProps {
  integration: Integration;
  onAction: (id: string, status: IntegrationStatus) => void;
}

const getStatusIndicator = (status: IntegrationStatus) => {
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
}) => {
  const Icon = integration.icon;
  const isActionDisabled = integration.status === "planned";

  return (
    <div
      key={integration.id}
      className="p-5 bg-gray-900 rounded-xl border border-gray-800 shadow-md flex flex-col justify-between transition duration-300 hover:border-[#A500FF]"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Icon className="w-7 h-7 text-[#00A7FF]" />
          <h3 className="text-lg font-semibold text-white">
            {integration.name}
          </h3>
        </div>
        {getStatusIndicator(integration.status)}
      </div>

      <p className="text-sm text-gray-400 mt-3 flex-grow">
        {integration.details}
      </p>

      {integration.subStatus && (
        <p className="text-xs text-gray-500 mt-1 italic">
          {integration.subStatus}
        </p>
      )}

      <button
        onClick={() => onAction(integration.id, integration.status)}
        disabled={isActionDisabled}
        className={`mt-4 w-full py-2 text-sm font-bold rounded-lg text-white transition duration-200 
                            ${
                              isActionDisabled
                                ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                                : `bg-gradient-to-r from-[${ACCENT_BLUE}] to-[${NEON_PURPLE}] hover:from-[${NEON_PURPLE}] hover:to-[${NEON_ORANGE}] shadow-md shadow-purple-900/50`
                            }
                        `}
      >
        {integration.actionLabel}
      </button>
    </div>
  );
};

// ----------------------------------------------------------------------------------
// ⚡ CORE FIX: Dynamic Snippet and Setup Guide Component
// ----------------------------------------------------------------------------------

// Finalized, universal JS code structure (stored as a template literal)
const SNIPPET_TEMPLATE = `
<script>
  window.akiraConfig = {
    // 🔑 Dynamic Values Injected from Dashboard:
    storeId: '{{STORE_ID_PLACEHOLDER}}', 
    snippetToken: '{{SNIPPET_TOKEN_PLACEHOLDER}}', 
    // 🛠️ Adjust your host to match your server (using 8000 for local dev)
    apiHost: 'http://localhost:8000', 
    wsHost: 'ws://localhost:8000' 
  };
</script>


<script>
(function () {
    const config = window.akiraConfig;
    if (!config || !config.storeId) {
        console.error('Akira AI: Configuration missing. Monitoring not active.');
        return;
    }

    const STORE_ID = config.storeId;
    let USER_ID = localStorage.getItem('akira_user_id');
    if (!USER_ID) {
        USER_ID = 'anon_' + Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
        localStorage.setItem('akira_user_id', USER_ID);
    }
    
    // --- CORE EVENT SENDER FUNCTION (Exposed Globally) ---
    function sendEvent(eventType, payload = {}, productId = null) {
        const eventData = {
            storeId: STORE_ID,
            eventType: eventType,
            userId: USER_ID,
            productId: productId,
            payload: payload
        };
        
        console.log(\`[AKIRA LOG - \${eventType}] \`, eventData);

        // ⚡ FIX: Added the necessary leading slash for the API path ⚡
        fetch(\`\${config.apiHost}/events/capture\`, { 
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Akira-Token': config.snippetToken 
            },
            body: JSON.stringify(eventData)
        })
        .then(response => {
            if (response.status !== 202) {
                response.text().then(text => console.error(\`[AKIRA ERROR] Event failed \${eventType}: \${text}\`));
            }
        })
        .catch(error => {
            console.error('[AKIRA ERROR] Network issue during event capture:', error);
        });
    }

    // --- A. WebSocket Integration ---
    if (typeof io !== 'undefined') {
        const socket = io(config.wsHost, {
            query: { storeId: STORE_ID, token: config.snippetToken, userId: USER_ID }
        });

        socket.on('connect', () => {
            console.log(\`[AKIRA WS] Connected as User: \${USER_ID}\`);
            socket.emit('registerStore', { storeId: STORE_ID, snippetToken: config.snippetToken });
        });

        // Listener for Real-Time Actions pushed from the Akira Brain
        socket.on('akuraAction', (data) => {
            console.log(\`[AKIRA INTERVENTION] Received action: \${data.action.type}\`);
            if (data.action.type === 'DISPLAY_POPUP_OFFER') {
                alert(\`AKIRA OFFER: \${data.action.data.message} | Code: \${data.action.data.code}\`);
            }
        });
    }


    // --- B. AUTOMATIC EVENT TRACKING ---

    // 1. Initial Page View Tracking
    sendEvent('page_view', { 
        pagePath: window.location.pathname, 
        referrer: document.referrer 
    });

    // 2. Generic Click Listener for Add to Cart 
    // User must use class 'akira-track-add-to-cart' AND include 'data-product-id'
    document.addEventListener('click', (event) => {
        const element = event.target.closest('.akira-track-add-to-cart, button[data-product-id]'); 
        
        if (element) {
             const productId = element.dataset.productId; 
             const productName = element.dataset.productName || element.textContent; 

             if (productId) {
                 sendEvent('add_to_cart', { productName: productName }, productId);
             } else {
                 console.warn("Akira AI: Clicked button is missing data-product-id. Event skipped.");
             }
        }
    });

    // --- C. EXPOSED GLOBAL API ---
    window.akiraTrack = sendEvent;

    console.log(\`Akira AI: Monitoring initialized for Store ID \${STORE_ID}\`);
})();
</script>
`;

interface SetupGuidePanelProps {
  integrationName: string;
  onClose: () => void;
  storeId: string | undefined;
  snippetToken: string | undefined;
}

const SetupGuidePanel: React.FC<SetupGuidePanelProps> = ({
  integrationName,
  onClose,
  storeId,
  snippetToken,
}) => {
  const { addToast } = useAppContext();

  // ⚡ DYNAMIC SNIPPET GENERATION ⚡
  const dynamicSnippet = useMemo(() => {
    if (!storeId || !snippetToken) {
      return ``;
    }
    return SNIPPET_TEMPLATE.replace(
      "{{STORE_ID_PLACEHOLDER}}",
      storeId,
    ).replace("{{SNIPPET_TOKEN_PLACEHOLDER}}", snippetToken);
  }, [storeId, snippetToken]);

  const handleCopy = () => {
    navigator.clipboard.writeText(dynamicSnippet).then(() => {
      addToast("Code snippet copied to clipboard!", "success");
    });
  };

  return (
    <div className="absolute inset-0 bg-gray-950/95 backdrop-blur-md z-40 p-8 flex flex-col">
      <div className="flex justify-between items-center pb-4 border-b border-gray-800 flex-shrink-0">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <Code className="w-5 h-5 text-[#FFB300]" /> Setup Guide:{" "}
          {integrationName}
        </h3>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-white transition p-1"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto mt-4 space-y-6 text-gray-400 pr-2 custom-scrollbar">
        <p className="text-sm">
          Copy the personalized code below and paste it into your website's main
          JavaScript file or right before the closing `&lt;/body&gt;` tag.
        </p>

        <h4 className="text-lg font-semibold text-white">
          1. Your Personalized Tracking Snippet
        </h4>
        <p className="text-sm">
          This snippet contains your unique **Store ID** (`{storeId || "N/A"}`)
          and **Token**, securing your data pipeline.
        </p>

        {/* Code Block */}
        <div className="relative bg-gray-800 rounded-lg p-4 text-xs font-mono overflow-x-auto border border-gray-700">
          <pre className="whitespace-pre-wrap">{dynamicSnippet}</pre>
          <button
            onClick={handleCopy}
            className="absolute top-2 right-2 text-gray-500 hover:text-white p-1 rounded transition"
          >
            <Copy className="w-4 h-4" />
          </button>
        </div>

        <h4 className="text-lg font-semibold text-white">
          2. Actionable Tracking Setup (Client-Side)
        </h4>
        <p className="text-sm">
          For **Add to Cart** events to fire correctly, modify your buttons to
          include the class and product ID:
        </p>
        <div className="bg-gray-800 rounded-lg p-3 text-xs font-mono text-[#00A7FF] border border-gray-700">
          &lt;button class="
          <span className="text-yellow-400">akira-track-add-to-cart</span>"
          data-product-id="
          <span className="text-yellow-400">YOUR_PRODUCT_ID</span>"&gt;Add to
          Cart&lt;/button&gt;
        </div>

        <ul className="list-disc list-inside ml-4 space-y-2 text-sm pt-4">
          <li>
            <span className="font-semibold text-[#FFB300]">
              Product Page View:
            </span>{" "}
            (Automatic) Fires on every page load.
          </li>
          <li>
            <span className="font-semibold text-[#FFB300]">Add to Cart:</span>{" "}
            Fires only when the button has the required class/attribute.
          </li>
          <li>
            <span className="font-semibold text-[#FFB300]">
              Checkout Start:
            </span>{" "}
            Use <code>window.akiraTrack('checkout_start', {"{...}"})</code> in
            your checkout script.
          </li>
        </ul>

        <h4 className="text-lg font-semibold text-white">
          3. Verify Connection
        </h4>
        <p className="text-sm">
          Once the snippet is live, return here. Akira will automatically verify
          the connection and begin indexing your products for the AI Training
          Center.
        </p>
      </div>
      {/* FIX 3: Corrected style block syntax */}
      <style>{`
                .custom-scrollbar::-webkit-scrollbar { width: 6px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: #111; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #374151; border-radius: 10px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #4b5563; }
            `}</style>
    </div>
  );
};

// --- 4. IntegrationsHub Component (The Orchestrator) ---

const IntegrationsHub: React.FC = () => {
  // ⚡ MOCK/REAL USER CONTEXT FETCHING ⚡
  const { user } = useAppContext(); // ⚠️ REPLACE with your actual useAppContext call!

  const { addToast } = useAppContext();
  const [integrations, setIntegrations] = useState(MOCK_INTEGRATIONS);
  const [modalOpen, setModalOpen] = useState(false);
  const [setupGuideOpen, setSetupGuideOpen] = useState<boolean>(false);
  const [selectedIntegrationId, setSelectedIntegrationId] = useState<
    string | null
  >(null);

  // Memoize the necessary store data
  const storeId = user?.store?.storeId;
  const snippetToken = user?.store?.snippetToken;

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
      setSetupGuideOpen(true);
      setSelectedIntegrationId(id);
    } else if (status === "planned") {
      addToast(`You have joined the waitlist for ${id}.`, "info");
    }
  };

  return (
    <div className="py-4 px-2 w-full h-full text-white pt-10 ml-6 relative">
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
          {MOCK_INTEGRATIONS.map((integration) => (
            <IntegrationItem
              key={integration.id}
              integration={integration}
              onAction={handleAction}
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

      {/* NEW: Setup Guide Overlay */}
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
