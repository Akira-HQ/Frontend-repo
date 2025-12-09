"use client";
import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

// Utility component for collapsible sections (reused from Privacy Policy style)
interface CollapsibleSectionProps {
  title: string;
  children: React.ReactNode;
  initialOpen?: boolean;
}

const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({
  title,
  children,
  initialOpen = false,
}) => {
  const [isOpen, setIsOpen] = useState(initialOpen);

  return (
    <div className="border-b border-gray-800 py-4">
      <button
        className="flex justify-between items-center w-full text-left text-xl font-semibold text-white hover:text-[#FFB300] transition-colors"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <span>{title}</span>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-gray-400 transition-transform" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-400 transition-transform" />
        )}
      </button>
      {isOpen && (
        <div className="mt-3 text-gray-400 prose prose-invert max-w-none">
          {children}
        </div>
      )}
    </div>
  );
};

// Main Component
const page: React.FC = () => {
  return (
    // Set the darkest background to match the landing page
    <div className="min-h-screen bg-gray-950 text-gray-400 p-4 sm:p-8">
      <div className="max-w-4xl mx-auto pt-20">
        <header className="pb-6 border-b border-gray-800 mb-6">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-2 leading-tight">
            {/* Gradient Title matching the Hero Section style */}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#A500FF] to-[#FFB300]">
              Akira AI Terms of Service
            </span>
          </h1>
          <p className="text-lg text-gray-300">
            Governing your use of the Akira AI sales management platform.
          </p>
          <div className="mt-2 text-sm text-gray-500">
            <p>
              <strong>Effective Date:</strong> January 1, 2026
            </p>
            <p>
              <strong>Last Updated:</strong> January 1, 2026
            </p>
          </div>
        </header>

        <section className="space-y-6">
          <p className="text-base leading-relaxed">
            These Terms of Service ("Terms") constitute a legally binding
            agreement between you, the **Shop Owner** (referred to as "User" or
            "you"), and **Akira AI** ("Akira," "we," "us," or "our") concerning
            your access to and use of the Akira AI e-commerce manager SaaS
            platform ("Service").
          </p>

          {/* Section 1: Acceptance of Terms */}
          <CollapsibleSection title="1. Acceptance of Terms" initialOpen={true}>
            <p>
              By accessing or using the Service, you confirm that you have read,
              understood, and agree to be bound by these Terms, which include
              our Privacy Policy. If you do not agree with all of these Terms,
              then you are expressly prohibited from using the Service and must
              discontinue use immediately.
            </p>
            <ul className="list-disc list-inside ml-4 space-y-2 mt-3">
              <li>You must be at least 18 years old to use the Service.</li>
              <li>
                You represent that you have the full legal authority to enter
                into these Terms on behalf of the business you register.
              </li>
            </ul>
          </CollapsibleSection>

          {/* Section 2: Service Provision and Scope */}
          <CollapsibleSection title="2. Service Provision and Scope">
            <h4 className="text-lg font-bold text-gray-300 mt-2">
              2.1. The Akira AI Service
            </h4>
            <p>
              The Service is an AI-powered e-commerce management tool that
              provides conversational sales and support, product knowledge
              retrieval, and performance analytics via a live chat widget and an
              Admin Dashboard.
            </p>

            <h4 className="text-lg font-bold text-gray-300 mt-4">
              2.2. License to Use the Service
            </h4>
            <p>
              We grant you a revocable, non-exclusive, non-transferable, limited
              license to access and use the Service solely for your internal
              business purposes of managing your e-commerce store, subject to
              your compliance with these Terms.
            </p>

            <h4 className="text-lg font-bold text-gray-300 mt-4">
              2.3. AI Accuracy and Limitations (Crucial Disclaimer)
            </h4>
            <p>
              You acknowledge that Akira AI utilizes complex generative models.
              While we use advanced RAG systems to ground responses in your
              store data, the AI may occasionally generate information that is
              inaccurate, incomplete, or biased (known as **"hallucinations"**).
              You agree:
            </p>
            <ul className="list-disc list-inside ml-4 space-y-2">
              <li>
                You are solely responsible for reviewing and verifying all
                AI-generated output before acting upon it or relying on it.
              </li>
              <li>
                Akira AI does not guarantee the accuracy, completeness, or
                effectiveness of any sales recommendations or customer service
                responses generated by the Service.
              </li>
            </ul>
          </CollapsibleSection>

          {/* Section 3: Subscription, Billing, and Usage */}
          <CollapsibleSection title="3. Subscription, Billing, and Usage">
            <h4 className="text-lg font-bold text-gray-300 mt-2">
              3.1. Fees and Billing
            </h4>
            <p>
              You agree to pay all subscription fees and charges associated with
              your selected plan on a recurring basis (monthly or annually). All
              fees are payable in advance and are non-refundable, except as
              expressly provided otherwise by law.
            </p>

            <h4 className="text-lg font-bold text-gray-300 mt-4">
              3.2. Usage Limits
            </h4>
            <p>
              Your use of the Service is subject to specific usage limits (e.g.,
              maximum monthly interactions, API calls, or supported products),
              as defined by your subscription tier. You are responsible for
              monitoring your usage via the Admin Dashboard. If you exceed these
              limits, we reserve the right to charge overage fees or suspend the
              Service until you upgrade your plan.
            </p>

            <h4 className="text-lg font-bold text-gray-300 mt-4">
              3.3. Price Changes
            </h4>
            <p>
              We reserve the right to change the prices of our subscriptions.
              Any price changes will take effect at the beginning of the next
              subscription period following notice to you.
            </p>
          </CollapsibleSection>

          {/* Section 4: User Obligations and Prohibited Conduct */}
          <CollapsibleSection title="4. User Obligations and Prohibited Conduct">
            <p>
              You agree not to access or use the Service for any purpose that is
              unlawful or prohibited by these Terms. Prohibited activities
              include, but are not limited to:
            </p>
            <ul className="list-disc list-inside ml-4 space-y-2 mt-3">
              <li>
                <strong className="text-white">Misrepresentation:</strong>{" "}
                Attempting to mislead end-customers into believing the AI is a
                human employee.
              </li>
              <li>
                <strong className="text-white">Illegal Content:</strong> Using
                the Service to generate, transmit, or process any unlawful,
                harmful, defamatory, or hateful content.
              </li>
              <li>
                <strong className="text-white">Technical Misconduct:</strong>{" "}
                Reverse engineering, decompiling, or otherwise attempting to
                discover the source code of the Service or the underlying AI
                models.
              </li>
              <li>
                <strong className="text-white">Abuse:</strong> Engaging in
                activity designed to overload, harm, or impair the Service's
                functionality.
              </li>
            </ul>
          </CollapsibleSection>

          {/* Section 5: Intellectual Property (IP) */}
          <CollapsibleSection title="5. Intellectual Property (IP)">
            <h4 className="text-lg font-bold text-gray-300 mt-2">
              5.1. Akira AI IP
            </h4>
            <p>
              Akira AI retains all intellectual property rights in and to the
              Service, including all software, AI models, technology, and
              proprietary algorithms used to power the RAG system and chat
              widget. The "Akira AI" name and logo are trademarks of Akira AI.
            </p>

            <h4 className="text-lg font-bold text-gray-300 mt-4">
              5.2. User Content Ownership
            </h4>
            <p>
              You retain all ownership rights to your **E-commerce Product
              Data** (product descriptions, images, SKUs) and **Customer Data**
              (order history, conversation logs) uploaded to or generated by the
              Service ("User Content").
            </p>

            <h4 className="text-lg font-bold text-gray-300 mt-4">
              5.3. License to Akira AI
            </h4>
            <p>
              You grant Akira AI a worldwide, non-exclusive, royalty-free,
              transferable license to use, reproduce, modify, and display the
              User Content solely for the purpose of operating, improving, and
              providing the Service to you (e.g., model training, performance
              analytics).
            </p>
          </CollapsibleSection>

          {/* Section 6: Termination */}
          <CollapsibleSection title="6. Termination">
            <p>
              These Terms remain in full force and effect while you use the
              Service. Either party may terminate these Terms and the Service
              subscription at any time.
            </p>
            <ul className="list-disc list-inside ml-4 space-y-2 mt-3">
              <li>
                <strong className="text-white">Termination by User:</strong> You
                may cancel your subscription at any time via the Admin
                Dashboard.
              </li>
              <li>
                <strong className="text-white">Termination by Akira AI:</strong>{" "}
                We may suspend or terminate your access immediately if you
                breach these Terms (e.g., failure to pay fees, prohibited
                conduct).
              </li>
              <li>
                <strong className="text-white">Effect of Termination:</strong>{" "}
                Upon termination, your license to use the Service ceases. Data
                retention and deletion will be handled in accordance with
                Section 4.2 of the Privacy Policy (deletion within 90 days).
              </li>
            </ul>
          </CollapsibleSection>

          {/* Section 7: Disclaimers and Limitation of Liability */}
          <CollapsibleSection title="7. Disclaimers and Limitation of Liability">
            <h4 className="text-lg font-bold text-gray-300 mt-2">
              7.1. Service Disclaimers
            </h4>
            <p>
              THE SERVICE IS PROVIDED ON AN "AS-IS" AND "AS-AVAILABLE" BASIS.
              AKIRA AI EXPRESSLY DISCLAIMS ALL WARRANTIES, WHETHER EXPRESS OR
              IMPLIED, INCLUDING, WITHOUT LIMITATION, ANY WARRANTY OF
              MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, OR
              NON-INFRINGEMENT. WE DO NOT GUARANTEE THAT THE SERVICE WILL BE
              UNINTERRUPTED, ERROR-FREE, SECURE, OR ACHIEVE ANY SPECIFIC SALES
              RESULTS OR PERFORMANCE LEVELS.
            </p>

            <h4 className="text-lg font-bold text-gray-300 mt-4">
              7.2. Limitation of Liability
            </h4>
            <p>
              IN NO EVENT WILL AKIRA AI OR ITS DIRECTORS, EMPLOYEES, OR AGENTS
              BE LIABLE TO YOU OR ANY THIRD PARTY FOR ANY DIRECT, INDIRECT,
              CONSEQUENTIAL, EXEMPLARY, INCIDENTAL, SPECIAL, OR PUNITIVE
              DAMAGES, INCLUDING LOST PROFIT, LOST REVENUE, LOSS OF DATA, OR
              OTHER DAMAGES ARISING FROM YOUR USE OF THE SERVICE, EVEN IF WE
              HAVE BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES. OUR TOTAL
              LIABILITY TO YOU FOR ANY CAUSE WHATSOEVER SHALL AT ALL TIMES BE
              LIMITED TO THE AMOUNT PAID, IF ANY, BY YOU TO US FOR THE SERVICE
              DURING THE SIX (6) MONTH PERIOD PRIOR TO ANY CAUSE OF ACTION
              ARISING.
            </p>
          </CollapsibleSection>

          {/* Section 8: Governing Law and Dispute Resolution */}
          <CollapsibleSection title="8. Governing Law and Dispute Resolution">
            <p>
              These Terms shall be governed by and defined by the laws of
              [Insert Governing Jurisdiction], without regard to its conflict of
              law principles. Any legal action or proceeding arising under these
              Terms will be brought exclusively in the federal or state courts
              located in [Insert Specific Venue City and State/Country].
            </p>
          </CollapsibleSection>

          {/* Section 9: Contact Information */}
          <CollapsibleSection title="9. Contact Information">
            <p>
              For questions or concerns regarding the Service or these Terms,
              please contact us at:
            </p>
            <ul className="list-disc list-inside ml-4 space-y-2 mt-3">
              <li>
                <strong className="text-white">Email:</strong>{" "}
                support@akira-ai.com
              </li>
              <li>
                <strong className="text-white">Mailing Address:</strong> [Insert
                Legal Company Mailing Address]
              </li>
            </ul>
          </CollapsibleSection>
        </section>

        <footer className="mt-12 pt-6 border-t border-gray-800 text-center text-xs text-gray-500">
          <p className="italic">
            Disclaimer: This is a terms of service draft based on your product
            features and is not legal advice. You must consult with a legal
            professional before publishing to ensure full compliance with all
            applicable laws and to properly manage risk.
          </p>
          <p className="mt-1">
            &copy; {new Date().getFullYear()} Akira AI. All rights reserved.
          </p>
        </footer>
      </div>
    </div>
  );
};

export default page;
