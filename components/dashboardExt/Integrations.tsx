'use client'
import React, { useState, useEffect } from 'react'
import { CheckCircle, Zap, MessageSquare, ShoppingCart, Lock, Globe, RefreshCw, XCircle, AlertTriangle, X } from 'lucide-react';
import ConfirmModal from '../notifications/CTAAlerts';

// --- MOCK DEPENDENCIES (Internalized for safe compilation) ---
const useAppContext = () => ({
  addToast: (message: string, type: string) => console.log(`[MOCK TOAST] ${type}: ${message}`),
});
// End Mock

// --- STYLING CONSTANTS ---
const NEON_PURPLE = "#A500FF";
const NEON_ORANGE = "#FFB300";
const ACCENT_BLUE = "#00A7FF";

// --- TYPES ---
type IntegrationStatus = 'connected' | 'error' | 'pending' | 'planned';

interface Integration {
  id: string;
  name: string;
  icon: React.FC<any>;
  status: IntegrationStatus;
  details: string;
  actionLabel: string;
  actionColor: string;
  subStatus?: string; // NEW: Detailed status line
}

// --- DATA (Enhanced for Management Context) ---
const MOCK_INTEGRATIONS: Integration[] = [
  {
    id: 'shopify',
    name: 'Shopify (Primary E-comm)',
    icon: ShoppingCart,
    status: 'connected',
    details: 'Real-time data flow is healthy. RAG system is fully indexed and operational.',
    subStatus: 'Last webhook received: 1 minute ago.', // NEW detail for visibility
    actionLabel: 'Manage/Disconnect',
    actionColor: 'bg-green-600',
  },
  {
    id: 'whatsapp',
    name: 'WhatsApp Business API',
    icon: MessageSquare,
    status: 'pending',
    details: 'Enables proactive abandoned cart follow-up and instant chat sales via Meta.',
    subStatus: 'Not active: Setup required.', // NEW detail for visibility
    actionLabel: 'Setup Now',
    actionColor: `bg-[${NEON_PURPLE}]`,
  },
  {
    id: 'woocommerce',
    name: 'WooCommerce',
    icon: ShoppingCart,
    status: 'planned',
    details: 'Auxiliary e-commerce channel. Planned integration for Q1 2026.',
    subStatus: 'Future development pipeline.',
    actionLabel: 'Join Waitlist',
    actionColor: 'bg-gray-600',
  },
  {
    id: 'ai_core',
    name: 'Akira AI Core (Gemini)',
    icon: Zap,
    status: 'connected',
    details: 'Core conversational and intent engine. Data is anonymized before leaving secure VPC.',
    subStatus: 'Security audited.',
    actionLabel: 'View Audit Logs', // Changed to reflect audit focus
    actionColor: 'bg-gray-800',
  },
];



// --- 2. IntegrationItem Component (Modular Piece) ---

interface IntegrationItemProps {
  integration: Integration;
  onAction: (id: string, status: IntegrationStatus) => void;
}

const getStatusIndicator = (status: IntegrationStatus) => {
  switch (status) {
    case 'connected': return <CheckCircle className="w-5 h-5 text-green-400" />;
    case 'pending': return <RefreshCw className="w-5 h-5 text-yellow-400 animate-spin" />;
    case 'error': return <XCircle className="w-5 h-5 text-red-400" />;
    case 'planned':
    default: return <Lock className="w-5 h-5 text-gray-500" />;
  }
};

const IntegrationItem: React.FC<IntegrationItemProps> = ({ integration, onAction }) => {
  const Icon = integration.icon;
  const isActionDisabled = integration.status === 'planned';

  return (
    <div
      key={integration.id}
      className='p-5 bg-gray-900 rounded-xl border border-gray-800 shadow-md flex flex-col justify-between transition duration-300 hover:border-[#A500FF]'
    >
      <div className='flex items-center justify-between'>
        <div className='flex items-center space-x-3'>
          <Icon className='w-7 h-7 text-[#00A7FF]' />
          <h3 className='text-lg font-semibold text-white'>{integration.name}</h3>
        </div>
        {getStatusIndicator(integration.status)}
      </div>

      <p className='text-sm text-gray-400 mt-3 flex-grow'>{integration.details}</p>

      {/* NEW: Sub-Status Line for management context */}
      {integration.subStatus && (
        <p className='text-xs text-gray-500 mt-1 italic'>{integration.subStatus}</p>
      )}

      <button
        onClick={() => onAction(integration.id, integration.status)}
        disabled={isActionDisabled}
        className={`mt-4 w-full py-2 text-sm font-bold rounded-lg text-white transition duration-200 
                    ${isActionDisabled
            ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
            : `bg-gradient-to-r from-[${ACCENT_BLUE}] to-[${NEON_PURPLE}] hover:from-[${NEON_PURPLE}] hover:to-[${NEON_ORANGE}] shadow-md shadow-purple-900/50`
          }
                `}
      >
        {integration.actionLabel}
      </button>
    </div>
  );
};

// --- 3. IntegrationsHub Component (The Orchestrator) ---

const IntegrationsHub: React.FC = () => {
  const { addToast } = useAppContext();
  const [integrations, setIntegrations] = useState(MOCK_INTEGRATIONS);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedIntegrationId, setSelectedIntegrationId] = useState<string | null>(null);

  const handleDisconnectConfirm = (id: string) => {
    // Find the specific integration to update its status
    setIntegrations(prev => prev.map(i =>
      i.id === id ? {
        ...i,
        status: 'error',
        actionLabel: 'Reconnect',
        actionColor: 'bg-red-600',
        details: 'Connection manually terminated by user. Data sync paused.',
        subStatus: 'Action required.' // Update subStatus on error
      } : i
    ));
    addToast(`Integration ${id} disconnected. Data sync paused.`, 'error');
    setModalOpen(false);
    setSelectedIntegrationId(null);
  };

  const handleAction = (id: string, status: IntegrationStatus) => {
    console.log(`Action triggered for: ${id}. Current Status: ${status}`);

    // Logic for triggering the custom modal for sensitive actions (Disconnect/Manage)
    if (status === 'connected' && id !== 'ai_core') {
      setSelectedIntegrationId(id);
      setModalOpen(true);
      return;
    }

    // Logic for reconnecting/setup actions
    if (status === 'pending' || status === 'error') {
      // Simulate successful connection immediately after clicking setup
      setIntegrations(prev => prev.map(i =>
        i.id === id ? { ...i, status: 'connected', actionLabel: 'Manage Webhooks', actionColor: 'bg-green-600', details: 'Active and syncing in real-time.', subStatus: 'Last check: less than 1 minute ago.' } : i
      ));
      addToast(`Integration successful! ${id} is now connected.`, 'success');

    } else if (status === 'planned') {
      addToast(`You have joined the waitlist for ${id}. We'll notify you when available.`, 'info');
    } else if (id === 'ai_core' && status === 'connected') {
      addToast(`Opening Gemini audit logs...`, 'info');
    }
  };

  return (
    <div className='py-4 px-2 w-full h-full text-white pt-10 ml-6'>
      <h1 className='text-3xl font-bold mb-4'>Integrations Hub</h1>
      <p className='text-gray-400 mb-8 max-w-2xl'>
        Connect your e-commerce platforms and messaging channels to activate Akira's full sales potential.
      </p>

      <div className='bg-[#0b0b0b] rounded-xl p-6 shadow-2xl border border-gray-800'>
        <h2 className='text-xl font-bold mb-6 border-b border-gray-800 pb-3 flex items-center gap-2'>
          <Globe className='w-5 h-5 text-[#FFB300]' /> Connected Platforms & Future Roadmap
        </h2>

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
          {integrations.map((integration) => (
            <IntegrationItem
              key={integration.id}
              integration={integration}
              onAction={handleAction}
            />
          ))}
        </div>
      </div>

      {/* Custom Modal Rendering (for Connected status actions) */}
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
    </div>
  );
};

export default IntegrationsHub;