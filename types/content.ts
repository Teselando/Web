export type ClaimCapability = "companyIdentity" | "contactDetails" | "guarantees" | "professorEvidence" | "teamEvidence" | "trustpilot" | "realPhotography" | "socialLinks";
export type CapabilityState = "pending" | "available";
export type CapabilityConfig = Record<ClaimCapability, CapabilityState>;
export type LeadContext = { landingPath?: string; sourcePage?: string; utmCampaign?: string; utmContent?: string; utmMedium?: string; utmSource?: string };
export type CommercialOutcome = { convertedAt?: string; firstClassAt?: string; leadStatus?: "new" | "qualified" | "converted" | "lost"; lossReason?: string };
