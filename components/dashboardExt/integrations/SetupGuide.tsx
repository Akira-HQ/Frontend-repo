"use client"
import React, { useState, useMemo } from "react";
import { Copy, Code, X } from "lucide-react";
import { useAppContext } from "../../AppContext";
// Assuming UseAPI is needed for potential future use, but removed from current logic
// import { UseAPI } from "@/components/hooks/UseAPI"; 

// ⚡ We only need the core component, not the tab components or logic ⚡
import OnboardingFlow from "./Onboarding";

// Assuming NEON_PURPLE, ACCENT_BLUE, and NEON_GRADIENT are imported constants

interface SetupGuidePanelProps {
  integrationName: string;
  onClose: () => void;
  storeId: string | undefined;
  snippetToken: string | undefined;
}

// Finalized, universal JS code structure - CLEANED FOR TYPESCRIPT ERRORS
const SNIPPET_TEMPLATE = `
<script>
  window.akiraConfig = {
    storeId: '{{STORE_ID_PLACEHOLDER}}',
    snippetToken: '{{SNIPPET_TOKEN_PLACEHOLDER}}',
    apiHost: 'http://localhost:8000', // adjust for prod
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
        
        console.log('[AKIRA LOG - ' + eventType + ']', eventData); 

        // HTTP POST Request for Event Ingestion
        fetch(config.apiHost + '/api/v1/events/capture', { 
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Akira-Token': config.snippetToken 
            },
            body: JSON.stringify(eventData)
        })
        .then(response => {
            if (response.status !== 202) {
                response.text().then(text => console.error('[AKIRA ERROR] Event failed: ' + text));
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
            console.log('[AKIRA WS] Connected as User: ' + USER_ID); // Fixed interpolation
            socket.emit('registerStore', { storeId: STORE_ID, snippetToken: config.snippetToken });
        });

        // Listener for Real-Time Actions pushed from the Akira Brain
        socket.on('akiraAction', (data) => {
            console.log('[AKIRA INTERVENTION] Received action: ' + data.action.type); // Fixed interpolation
            if (data.action.type === 'DISPLAY_POPUP_OFFER') {
                alert('AKIRA OFFER: ' + data.action.data.message + ' | Code: ' + data.action.data.code); // Fixed interpolation
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

    console.log('Akira AI: Monitoring initialized for Store ID ' + STORE_ID); // Fixed interpolation
})();
</script>

`;


const SetupGuidePanel: React.FC<SetupGuidePanelProps> = ({
  integrationName,
  onClose,
  storeId,
  snippetToken,
}) => {
  const { addToast } = useAppContext();
  // Removed UseAPI call since submission logic is simplified/removed

  // ⚡ Removed all configuration states (apiConfig, scraperConfig, loading, activeTab) ⚡

  const dynamicSnippet = useMemo(() => {
    if (!storeId || !snippetToken) return ``;
    return SNIPPET_TEMPLATE
      .replace("{{STORE_ID_PLACEHOLDER}}", storeId)
      .replace("{{SNIPPET_TOKEN_PLACEHOLDER}}", snippetToken);
  }, [storeId, snippetToken]);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text).then(() => {
      addToast(`${label} copied to clipboard!`, "success");
    });
  };


  return (
    // ⚡ Fixed: Modal wrapper confined to parent container ⚡
    <div className="absolute bottom-0 top-0 inset-0 bg-gray-950/95 backdrop-blur-md z-40 p-8 flex flex-col h-full w-full overflow-y-auto">

      {/* Header */}
      <div className="flex justify-between items-center pb-4 border-b border-gray-800 flex-shrink-0">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <Code className="w-5 h-5 text-[#FFB300]" /> Setup Guide: {integrationName}
        </h3>
        <button type="button" onClick={onClose} className="text-gray-400 hover:text-white transition p-1"><X className="w-6 h-6" /></button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto mt-4 space-y-6 text-gray-400 pr-2 custom-scrollbar">

        {/* Step 1: Mandatory Snippet */}
        <h4 className="text-lg font-semibold text-white border-b border-gray-800 pb-2">1. Core Tracking Snippet</h4>
        <p className="text-sm">
          Copy this personalized code and paste it right before the closing `&lt;/body&gt;` tag on every page of your custom site. This enables real-time event tracking and intervention.
        </p>
        <div className="relative bg-gray-800 rounded-lg p-4 text-xs font-mono overflow-x-auto border border-gray-700">
          <pre className="whitespace-pre-wrap">{dynamicSnippet}</pre>
          <button type="button" onClick={() => handleCopy(dynamicSnippet, 'Snippet')} className="absolute top-2 right-2 text-gray-500 hover:text-white p-1 rounded transition"><Copy className="w-4 h-4" /></button>
        </div>

        {/* ⚡ INTEGRATED ONBOARDING FLOW ⚡ */}
        <h4 className="text-lg font-semibold text-white border-b border-gray-800 pb-2 mt-8">2. Guided Integration & Setup</h4>

        <OnboardingFlow />

      </div>
      {/* FIX 3: Custom Scrollbar CSS */}
      <style>{`
          .custom-scrollbar::-webkit-scrollbar { width: 6px; }
          .custom-scrollbar::-webkit-scrollbar-track { background: #111; }
          .custom-scrollbar::-webkit-scrollbar-thumb { background: #374151; border-radius: 10px; }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #4b5563; }
        `}</style>
    </div>
  );
};

export default SetupGuidePanel;