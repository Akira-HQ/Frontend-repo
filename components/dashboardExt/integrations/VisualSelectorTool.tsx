"use client";
import React, { useRef, useState } from "react";
import { MousePointer, CheckCircle2 } from "lucide-react";

interface VisualSelectorToolProps {
  platform: string | null;
  onComplete: (mapping: Record<string, string>) => void;
}

const VisualSelectorTool: React.FC<VisualSelectorToolProps> = ({
  platform,
  onComplete,
}) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const [mapping, setMapping] = useState<any>({
    productCard: null,
    productImage: null,
    productTitle: null,
    productPrice: null,
    addToCartButton: null,
  });

  const [activeField, setActiveField] =
    useState<keyof typeof mapping | null>(null);

  const startSelectorMode = (fieldName: keyof typeof mapping) => {
    setActiveField(fieldName);

    const iframe = iframeRef.current;
    if (!iframe) return;

    const doc = iframe.contentDocument;
    if (!doc) return;

    doc.querySelectorAll("*").forEach((el) => {
      const element = el as HTMLElement;

      // reset outlines
      element.style.outline = "";

      // Hover highlight
      element.onmouseenter = (e: MouseEvent) => {
        e.stopPropagation();
        (e.target as HTMLElement).style.outline = "2px solid #FFB02E";
      };

      element.onmouseleave = (e: MouseEvent) => {
        (e.target as HTMLElement).style.outline = "";
      };

      // Click to select
      element.onclick = (e: MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        const targetEl = e.target as HTMLElement;
        const selector = generateUniqueSelector(targetEl);

        setMapping((prev: any) => ({
          ...prev,
          [fieldName]: selector,
        }));

        setActiveField(null);
        resetHoverEvents(doc);
      };
    });
  };

  const resetHoverEvents = (doc: Document) => {
    doc.querySelectorAll("*").forEach((el) => {
      const element = el as HTMLElement;
      element.onmouseenter = null;
      element.onmouseleave = null;
      element.onclick = null;
      element.style.outline = "";
    });
  };

  const generateUniqueSelector = (element: HTMLElement): string => {
    if (element.id) return `#${element.id}`;
    if (element.className)
      return (
        "." +
        element.className
          .toString()
          .trim()
          .replace(/\s+/g, ".")
      );

    return element.tagName.toLowerCase();
  };

  const handleSubmit = () => {
    onComplete(mapping);
  };

  return (
    <div className="w-full mt-10">
      <h2 className="text-xl font-semibold text-[#FFB02E] mb-3 flex items-center gap-2">
        <MousePointer className="w-5 h-5" />
        Auto Selector Mapping (No-Code)
      </h2>

      {/* URL Input */}
      <div className="flex gap-2 mb-3">
        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="flex-1 bg-[#0E0E0F] text-white px-4 py-2 border border-[#2A2A2D] rounded-lg focus:border-[#FFB02E]"
          placeholder="https://yourcustomsite.com"
        />
        <button
          className="bg-[#FFB02E] text-black px-4 py-2 rounded-lg"
          onClick={() => setLoading(true)}
        >
          Load
        </button>
      </div>

      {/* Iframe */}
      <div className="w-full border border-[#2A2A2D] rounded-xl overflow-hidden h-[600px] bg-[#0E0E0F]">
        {loading ? (
          <iframe
            ref={iframeRef}
            src={url}
            onLoad={() => setLoading(false)}
            className="w-full h-full"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[#7A7A7A]">
            Enter a URL and click Load
          </div>
        )}
      </div>

      {/* Selector Buttons */}
      <div className="mt-6 bg-[#1A1A1C] border border-[#2A2A2D] p-4 rounded-xl">
        <h3 className="text-lg text-white mb-4">Click a field to select on site:</h3>

        <div className="grid grid-cols-2 gap-3">
          {Object.keys(mapping).map((key) => (
            <button
              key={key}
              className={`px-4 py-2 rounded-lg border ${mapping[key]
                  ? "border-green-500 bg-green-600/20 text-green-300"
                  : "border-[#2A2A2D] text-white"
                }`}
              onClick={() =>
                startSelectorMode(key as keyof typeof mapping)
              }
            >
              {mapping[key] ? (
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  {key} selected
                </span>
              ) : (
                `Select ${key}`
              )}
            </button>
          ))}
        </div>

        <button
          className="mt-6 bg-[#FFB02E] text-black px-6 py-2 rounded-lg font-medium"
          onClick={handleSubmit}
        >
          Save Mapping
        </button>
      </div>
    </div>
  );
};

export default VisualSelectorTool;
