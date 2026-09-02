import { randomUUID } from "node:crypto";

import { LeadError } from "@/lib/leads/errors";
import { GoogleSheetsLeadRepository } from "@/lib/leads/google-sheets-repository";
import type { LeadRepository } from "@/lib/leads/repository";
import { applyDiagnosticUpdate, isOpaqueId, nextDiagnosticStatus, validateDiagnosticState } from "@/lib/leads/validation";
import type { CreateLeadCommand, LeadRecord, LeadUpdateCommand } from "@/types/leads";

const pendingCreations = new Map<string, Promise<LeadRecord>>();

export class LeadService {
  constructor(private readonly repository?: LeadRepository) {}

  async createLead(command: Omit<CreateLeadCommand, "id">): Promise<LeadRecord> {
    const existingPending = pendingCreations.get(command.idempotencyKey);
    if (existingPending) return existingPending;
    const operation = this.createUniqueLead(command);
    pendingCreations.set(command.idempotencyKey, operation);
    try {
      return await operation;
    } finally {
      pendingCreations.delete(command.idempotencyKey);
    }
  }

  async updateLead(id: string, update: LeadUpdateCommand, completeDiagnostic = false): Promise<LeadRecord> {
    if (!isOpaqueId(id)) throw new LeadError("NOT_FOUND", "No hemos encontrado esta solicitud.");
    const current = await this.getRepository().findById(id);
    if (!current) throw new LeadError("NOT_FOUND", "No hemos encontrado esta solicitud.");
    const combined = update.diagnostic ? applyDiagnosticUpdate(current, update.diagnostic) : current;
    validateDiagnosticState(combined, completeDiagnostic);
    const hasDiagnosticModification = Boolean(update.diagnostic && Object.keys(update.diagnostic).length);
    const diagnosticStatus = completeDiagnostic ? "completed" : current.diagnosticStatus === "completed" && hasDiagnosticModification ? "in_progress" : nextDiagnosticStatus(current.diagnosticStatus, hasDiagnosticModification);
    const updated = await this.getRepository().updateLead(id, { ...update, diagnostic: hasDiagnosticModification ? combined : undefined, diagnosticStatus });
    if (!updated) throw new LeadError("NOT_FOUND", "No hemos encontrado esta solicitud.");
    return updated;
  }

  private async createUniqueLead(command: Omit<CreateLeadCommand, "id">): Promise<LeadRecord> {
    const repository = this.getRepository();
    const existing = await repository.findByIdempotencyKey(command.idempotencyKey);
    if (existing) return existing;
    return repository.createLead({ ...command, id: randomUUID() });
  }

  private getRepository(): LeadRepository {
    return this.repository ?? new GoogleSheetsLeadRepository();
  }
}
