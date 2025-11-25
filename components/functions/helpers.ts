import { useRouter } from "next/navigation";
import { NextRouter } from "next/router";

export const handleCtaClick = (planName: string, href?: string) => {
  console.log(`Starting trial or viewing plans for: ${planName}`);
  // In a real app, this would trigger navigation or a signup modal
};
