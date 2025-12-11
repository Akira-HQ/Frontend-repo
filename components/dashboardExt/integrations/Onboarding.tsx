"use client";
import React, { useState } from "react";
import { Zap, CheckCircle2, ChevronRight } from "lucide-react";
import DetectPlatform from "./A_DetectPlatform";
import ScriptInstallerTool from "./ScriptInstallerTool";
import VisualSelectorTool from "./VisualSelectorTool";

// Assuming these are the correct import paths for your three tools

// Mock Store ID for demonstration purposes (replace with actual user store ID from context)
const MOCK_STORE_ID = "store_demo_12345";

type OnboardingStep = "DETECT_PLATFORM" | "SCRIPT_INSTALL" | "PRODUCT_MAP" | "COMPLETE";

const OnboardingFlow: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<OnboardingStep>("DETECT_PLATFORM");
  const [detectedPlatform, setDetectedPlatform] = useState<string | null>(null);
  const [isScriptVerified, setIsScriptVerified] = useState(false);
  const [mappingResult, setMappingResult] = useState<Record<string, string> | null>(null);

  // Placeholder to simulate handling the detected platform from the first tool
  const handlePlatformDetected = (platform: string) => {
    setDetectedPlatform(platform.toUpperCase());
    // If it's a known platform (like SHOPIFY), skip mapping step for now
    if (platform.toUpperCase() === 'SHOPIFY') {
      setCurrentStep("SCRIPT_INSTALL");
    } else {
      // If it's CUSTOM or unknown, go to the script install step, 
      // where we would eventually decide on the product map method.
      setCurrentStep("SCRIPT_INSTALL");
    }
  };

  // Placeholder to handle when script installation is verified
  const handleScriptVerified = (isVerified: boolean) => {
    setIsScriptVerified(isVerified);
    if (isVerified) {
      // After script install, if it's a Custom site, go to product mapping
      if (detectedPlatform === 'CUSTOM') {
        setCurrentStep("PRODUCT_MAP");
      } else {
        // For other platforms, we assume success or go to next module
        setCurrentStep("COMPLETE");
      }
    }
  };

  // Placeholder to handle the final product mapping result
  const handleMappingComplete = (mapping: Record<string, string>) => {
    setMappingResult(mapping);
    setCurrentStep("COMPLETE");
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case "DETECT_PLATFORM":
        return (
          <DetectPlatform onDetected={handlePlatformDetected} />
        );

      case "SCRIPT_INSTALL":
        return (
          <div className="flex flex-col items-center space-y-6">
            <h3 className="text-xl font-bold text-white">Step 2: Install Core Tracking Script</h3>
            <ScriptInstallerTool
              storeId={MOCK_STORE_ID}
              // This would be replaced with actual verification logic hook
            />
            <button
              onClick={() => handleScriptVerified(true)}
              className="text-blue-400 hover:text-blue-300 text-sm flex items-center gap-1"
            >
              <ChevronRight className="w-4 h-4" /> Skip verification for demo
            </button>
          </div>
        );

      case "PRODUCT_MAP":
        if (detectedPlatform === 'CUSTOM') {
          // Only use the visual tool for custom sites requiring mapping
          return (
            <div className="flex flex-col items-center space-y-6">
              <h3 className="text-xl font-bold text-white">Step 3: Map Products (Visual Scraper)</h3>
              <VisualSelectorTool
                platform={detectedPlatform}
                onComplete={handleMappingComplete}
              />
            </div>
          );
        }
        return null; // Should not happen if logic is correct

      case "COMPLETE":
        return (
          <div className="flex flex-col items-center justify-center h-[400px] text-center p-8 bg-[#1A1A1C] rounded-2xl">
            <CheckCircle2 className="w-12 h-12 text-green-500 mb-4" />
            <h3 className="text-3xl font-bold text-white mb-2">Setup Complete!</h3>
            <p className="text-[#CFCFCF]">Akira is now tracking events and syncing products for your **{detectedPlatform}** store.</p>
            {mappingResult && (
              <p className="text-xs text-gray-400 mt-2">Product Mapping Saved: {Object.keys(mappingResult).length} selectors confirmed.</p>
            )}
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#0E0E0F] p-10 flex justify-center items-start">
      <div className="w-full max-w-4xl">
        <header className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-[#FFB02E] flex items-center justify-center gap-3">
            <Zap className="w-8 h-8" /> Akira AI Onboarding Wizard
          </h1>
          <p className="text-[#CFCFCF] mt-2">A simple path to activating your store's AI intelligence.</p>
        </header>

        {renderStepContent()}
      </div>
    </div>
  );
};

export default OnboardingFlow;