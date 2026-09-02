import type { CapabilityConfig } from "@/types/content";

// Claims are opt-in: pending data must never render as evidence or a promise.
export const capabilities: CapabilityConfig = { companyIdentity: "pending", contactDetails: "pending", guarantees: "pending", professorEvidence: "pending", realPhotography: "pending", socialLinks: "pending", teamEvidence: "pending", trustpilot: "pending" };

export function isCapabilityAvailable(capability: keyof CapabilityConfig): boolean {
  return capabilities[capability] === "available";
}
