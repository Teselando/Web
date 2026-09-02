import type { CommercialOutcome } from "@/types/content";
import type { CreateLeadCommand, LeadRecord, LeadUpdateCommand } from "@/types/leads";

export interface LeadRepository {
  createLead(command: CreateLeadCommand): Promise<LeadRecord>;
  findById(id: string): Promise<LeadRecord | null>;
  findByIdempotencyKey(idempotencyKey: string): Promise<LeadRecord | null>;
  updateLead(id: string, update: LeadUpdateCommand): Promise<LeadRecord | null>;
  updateCommercialOutcome(id: string, outcome: Partial<CommercialOutcome>): Promise<LeadRecord | null>;
}
