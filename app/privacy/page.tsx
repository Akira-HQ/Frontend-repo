"use client";
import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

// Utility component for collapsible sections
interface CollapsibleSectionProps {
  title: string;
  children: React.ReactNode;
  initialOpen?: boolean;
}

const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({ title, children, initialOpen = false }) => {
  const [isOpen, setIsOpen] = useState(initialOpen);

  return (
    <div className="border-b border-gray-800 py-4">
      <button
        // Accent color matching the Hero Section's primary color (purple/indigo)
        className="flex justify-between items-center w-full text-left text-xl font-semibold text-white hover:text-[#FFB300] transition-colors"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <span>{title}</span>
        {/* Icon color now white/gray for better contrast */}
        {isOpen ? <ChevronUp className="w-5 h-5 text-gray-400 transition-transform" /> : <ChevronDown className="w-5 h-5 text-gray-400 transition-transform" />}
      </button>
      {isOpen && (
        <div className="mt-3 text-gray-400 prose prose-invert max-w-none">
          {children}
        </div>
      )}
    </div>
  );
};

// Component to render the data tables
interface TableData {
  category: string;
  examples: string;
  purpose: string;
}

interface DataTableProps {
  title: string;
  data: TableData[];
}

const DataTable: React.FC<DataTableProps> = ({ title, data }) => (
  <div className="my-6 p-4 bg-gray-900 rounded-lg border border-gray-800">
    <h4 className="text-lg font-bold text-gray-200 mb-3">{title}</h4>
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-800">
        <thead className="bg-gray-800">
          <tr>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-300">Category of Data</th>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-300">Examples of Data</th>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-300">Purpose/Description</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-800">
          {data.map((row, index) => (
            <tr key={index} className="hover:bg-gray-800/50">
              <td className="px-4 py-2 text-sm font-medium text-gray-100">{row.category}</td>
              <td className="px-4 py-2 text-sm text-gray-300">{row.examples}</td>
              <td className="px-4 py-2 text-sm text-gray-300">{row.purpose}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);


const ownerData: TableData[] = [
  { category: 'Account & Contact Data', examples: 'Name, work email address, phone number, company name, billing address.', purpose: 'Account creation, identity verification, service notifications, and direct business communication.' },
  { category: 'Billing & Payment Data', examples: 'Billing history, payment method details (tokenized and processed by a third-party payment provider, not stored directly by Akira AI).', purpose: 'Processing subscription fees, managing billing cycles, and providing invoices.' },
  { category: 'AI Configuration Data', examples: 'Brand Voice & Tone Settings, API keys/credentials for e-commerce platforms (e.g., Shopify), policy documents (Shipping, Returns, FAQ text).', purpose: 'To fine-tune the core AI model\'s output (RAG system) to match your store\'s policies, voice, and operational details.' },
];

const customerData: TableData[] = [
  { category: 'E-commerce Product Data', examples: 'Product descriptions, pricing, inventory levels, SKUs, product images, collections, and meta-data.', purpose: 'Core RAG Functionality: To index this data into our vector database (PostgreSQL + pgvector) so the AI can retrieve accurate, real-time information to answer customer questions and generate convincing product explanations.' },
  { category: 'Conversation Logs', examples: 'Transcripts of chat sessions between your customers and the Akira AI Chat Widget, including timestamps, customer inputs, and AI responses.', purpose: 'Service Improvement & Dashboard Reporting: To review AI performance, generate the metrics seen in your Admin Dashboard, and continually refine the conversational model.' },
  { category: 'Customer Interaction Data', examples: 'Customer names, emails, order history, and cart contents (only when shared with Akira via the integration).', purpose: 'Proactive Sales & Personalization: To enable the AI to make intelligent product recommendations and follow up on abandoned carts.' },
];

const usageData: TableData[] = [
  { category: 'Service Usage Data', examples: 'IP address, browser type, operating system, pages viewed on the Admin Dashboard, time spent on the page, and feature interactions (e.g., clicks on "Enhance with AI").', purpose: 'Monitoring platform health, security, identifying usage trends, and improving the Admin Dashboard user experience.' },
  { category: 'Cookies & Tracking', examples: 'Standard web cookies and similar tracking technologies.', purpose: 'Authentication (keeping you logged in to the Dashboard), session management, and analytics (details in our separate Cookie Policy).' },
];

const usagePurposeData: TableData[] = [
  { category: 'Service Delivery', examples: 'To operate, maintain, and manage the core features of Akira AI, including the Admin Dashboard and the live chat widget.', purpose: 'All data types in Sections 1A, 1B, and 1C.' },
  { category: 'AI Model Grounding (RAG)', examples: 'To ensure the AI provides accurate, non-hallucinated answers that are strictly grounded in your store\'s specific E-commerce Product Data and policy documents.', purpose: 'E-commerce Product Data, AI Configuration Data.' },
  { category: 'Proactive Sales', examples: 'To analyze customer intent and product data to provide personalized, intelligent product recommendations and engage customers effectively.', purpose: 'E-commerce Product Data, Customer Interaction Data, Conversation Logs.' },
  { category: 'Product Improvement & Training', examples: 'We use aggregated, anonymized, or de-identified Conversation Logs to continuously train, fine-tune, and improve the accuracy, safety, and human-like nature of the core AI models (LLMs).', purpose: 'Conversation Logs (anonymized), E-commerce Product Data (aggregated).' },
  { category: 'Billing & Account Management', examples: 'To process payments, manage your subscription level, and enforce service limits (like the Monthly Limit Update you see on the dashboard).', purpose: 'Account & Contact Data, Billing & Payment Data, Service Usage Data.' },
  { category: 'Legal & Security', examples: 'To prevent fraudulent activity, enforce our Terms of Service, and comply with legal obligations, court orders, and government requests.', purpose: 'All data types.' },
];


const PrivacyPolicyPage: React.FC = () => {
  return (
    // Set the darkest background to match the landing page
    <div className="min-h-screen bg-gray-950 text-gray-400 p-4 sm:p-8">
      <div className="max-w-4xl mx-auto pt-20">
        <header className="pb-6 border-b border-gray-800 mb-6">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-2 leading-tight">
            {/* Gradient Title matching the Hero Section style */}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#A500FF] to-[#FFB300]">
              Akira AI Privacy Policy
            </span>
          </h1>
          <p className="text-lg text-gray-300">Autonomous sales management for e-commerce, powered by intelligent AI.</p>
          <div className="mt-2 text-sm text-gray-500">
            <p><strong>Effective Date:</strong> January 1, 2026</p>
            <p><strong>Last Updated:</strong> January 1, 2026</p>
          </div>
        </header>

        <section className="space-y-6">
          <p className="text-base leading-relaxed">
            This Privacy Policy explains how <strong>Akira</strong> collects, uses, protects, and discloses information when you use our AI-powered e-commerce manager SaaS platform ("Service") and related services.
          </p>
          <p className="text-base leading-relaxed">
            We operate as a Business-to-Business (B2B) service, primarily processing data on behalf of our e-commerce shop owner customers. This Policy addresses two distinct categories of data:
          </p>
          <ul className="list-disc list-inside ml-4 space-y-1">
            <li><strong className="text-white">Owner Data:</strong> Personal and business information you provide to set up and manage your Akira AI account.</li>
            <li><strong className="text-white">Customer Data:</strong> Information related to your end-customers and products, which we process to provide the core AI service.</li>
          </ul>

          {/* Section 1: Information We Collect */}
          <CollapsibleSection title="1. Information We Collect" initialOpen={false}>
            <p className="mt-2">We collect information from three primary sources: directly from the Shop Owner, automatically through service usage, and via integration with your e-commerce platform.</p>

            <h3 className="text-xl font-bold text-gray-200 mt-6 mb-3">1A. Owner Data (Information provided by Shop Owners)</h3>
            <p>This data is collected directly from you when you register for an account or configure the Service.</p>
            <DataTable title="Owner Data Categories" data={ownerData} />

            <h3 className="text-xl font-bold text-gray-200 mt-6 mb-3">1B. Customer Data (Information we process on your behalf)</h3>
            <p>This data is ingested from your integrated e-commerce platform (e.g., Shopify) to power Akira's core AI functions (RAG system, recommendations, sales). You are the <strong className="text-white">Data Controller</strong> of this information, and Akira AI is the <strong className="text-white">Data Processor</strong>.</p>
            <DataTable title="Customer Data Categories" data={customerData} />

            <h3 className="text-xl font-bold text-gray-200 mt-6 mb-3">1C. Automatically Collected Data (Usage Data)</h3>
            <p>When you or your customers use the Service, we automatically collect usage information.</p>
            <DataTable title="Usage Data Categories" data={usageData} />
          </CollapsibleSection>

          {/* Section 2: How We Use the Information */}
          <CollapsibleSection title="2. How We Use the Information (Purposes of Processing)" initialOpen={false}>
            <p className="mt-2">We use the collected information based on our contractual relationship with you and our legitimate interest in providing and improving a cutting-edge AI service.</p>
            <DataTable title="Purposes of Processing" data={usagePurposeData} />
          </CollapsibleSection>

          {/* Section 3: Data Sharing and Third-Party Disclosures (REVISED) */}
          <CollapsibleSection title="3. Data Sharing and Third-Party Disclosures">
            <div className="space-y-4">
              <p>We may share your data (Owner Data) and Customer Data with third-party service providers only to the extent necessary to operate, maintain, and improve the Service, or when legally required.</p>

              <h4 className="text-lg font-bold text-gray-300">3.1. AI Capability Service Providers (Critical for Function)</h4>
              <p>Akira AI relies on external generative artificial intelligence (AI) services to provide its core capabilities, such as product explanations and conversational sales engagement.</p>
              <ul className="list-disc list-inside ml-4 space-y-2">
                <li><strong className="text-white">Generative AI Provider:</strong> For the MVP phase, we utilize AI capabilities provided by **Google (e.g., Gemini API)** to process conversational inputs and generate human-like responses, effectively serving as Akira’s conversational engine.</li>
                <li><strong className="text-white">Data Protection in AI Processing:</strong> We ensure that all conversational and product context data sent to these providers is strictly used to generate the response for that specific customer interaction. We have contractual protections in place to prevent the use of your Customer Data or Personal Data for general, foundational model training by the provider.</li>
                <li><strong className="text-white">Data Minimization:</strong> We implement specialized processes to ensure only the necessary, de-identified or anonymized conversational text, combined with your store's proprietary data (product details, policies), is sent for AI processing.</li>
              </ul>

              <h4 className="text-lg font-bold text-gray-300">3.2. Essential Operational Providers</h4>
              <p>We use the following third-party categories to manage our technical and business operations:</p>
              <ul className="list-disc list-inside ml-4 space-y-2">
                <li><strong className="text-white">Cloud Hosting & Infrastructure:</strong> Providers (e.g., AWS, Google Cloud, Azure) host our backend application, databases, and secure search indexing (for product knowledge) to ensure the service is fast and reliable.</li>
                <li><strong className="text-white">Payment Processing:</strong> Dedicated payment providers handle all billing and payment card information. We never store raw payment card details ourselves.</li>
                <li><strong className="text-white">Analytics & Performance Monitoring:</strong> Services that track Service Usage Data (Section 1C) to help us diagnose issues, optimize platform performance, and understand user behavior.</li>
              </ul>

              <h4 className="text-lg font-bold text-gray-300">3.3. Legal Disclosures</h4>
              <p>We may disclose your information if required to do so by law or in the good faith belief that such action is necessary to:</p>
              <ul className="list-disc list-inside ml-4 space-y-2">
                <li>Comply with a legal obligation or request (e.g., subpoena or court order).</li>
                <li>Protect and defend the rights or property of Akira AI.</li>
                <li>Prevent or investigate possible wrongdoing in connection with the Service.</li>
              </ul>
            </div>
          </CollapsibleSection>

          {/* Section 4: Data Storage, Security, and Retention (NEW CONTENT) */}
          <CollapsibleSection title="4. Data Storage, Security, and Retention">
            <div className="space-y-4">
              <h4 className="text-lg font-bold text-gray-300">4.1. Security Measures</h4>
              <p>We implement robust technical and organizational measures designed to protect data against accidental, unlawful, or unauthorized loss, access, disclosure, alteration, or destruction. Key measures include:</p>
              <ul className="list-disc list-inside ml-4 space-y-2">
                <li><strong className="text-white">Encryption:</strong> All data is encrypted both **in transit** (using SSL/TLS) and **at rest** (on disk, including the PostgreSQL database and vector embeddings).</li>
                <li><strong className="text-white">Access Control:</strong> Access to Owner Data and Customer Data is strictly limited to authorized personnel who require access for development, maintenance, and support, and is governed by strong authentication and the principle of least privilege.</li>
                <li><strong className="text-white">Vulnerability Management:</strong> We regularly monitor our system for security vulnerabilities and apply updates promptly.</li>
              </ul>

              <h4 className="text-lg font-bold text-gray-300">4.2. Data Retention Policy</h4>
              <p>We retain your Owner Data and Customer Data only for as long as your account is active and reasonably necessary to provide you with the Service.</p>
              <ul className="list-disc list-inside ml-4 space-y-2">
                <li><strong className="text-white">Account Termination:</strong> If you terminate your account, we will initiate the deletion of your Owner Data and Customer Data within **90 days**.</li>
                <li><strong className="text-white">Exceptions:</strong> We may retain some data (e.g., transactional records, invoices, or de-identified data) for a longer period if necessary for legal compliance (e.g., tax or accounting laws), resolving disputes, or enforcing our agreements.</li>
                <li><strong className="text-white">AI Model Training Data:</strong> We may retain **anonymized and aggregated Conversation Logs** indefinitely for continuous AI model training and performance analysis (as detailed in Section 2), provided this data cannot reasonably be linked back to individual customers or transactions.</li>
              </ul>
            </div>
          </CollapsibleSection>

          {/* TO BE COMPLETED SECTIONS GO HERE */}
          <CollapsibleSection title="5. Your Rights and Choices">
            <p className="text-sm italic">This section will outline the rights of Owners (access, correction, deletion) and how to exercise those rights. [Placeholder Content]</p>
          </CollapsibleSection>

          <CollapsibleSection title="6. Changes to this Privacy Policy">
            <p className="text-sm italic">This section will describe how and when we notify you of policy changes. [Placeholder Content]</p>
          </CollapsibleSection>

          <CollapsibleSection title="7. Contact Us">
            <p className="text-sm italic">This section will include the dedicated contact information for privacy-related inquiries. [Placeholder Content]</p>
          </CollapsibleSection>

        </section>

        <footer className="mt-12 pt-6 border-t border-gray-800 text-center text-xs text-gray-500">
          <p className="italic">Disclaimer: This is a policy draft based on your product features and is not legal advice. Please consult with a legal professional before publishing to ensure full compliance with all applicable laws.</p>
          <p className="mt-1">&copy; {new Date().getFullYear()} Akira AI. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;