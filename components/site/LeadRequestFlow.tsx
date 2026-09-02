"use client";

import { useState } from "react";
import { Diagnostic } from "@/components/site/Diagnostic";
import { LeadCapture } from "@/components/site/LeadCapture";

export function LeadRequestFlow({ id, privacyPolicyHref }: { id?: string; privacyPolicyHref?: string }) {
  const [leadId, setLeadId] = useState<string>();
  return <div className="lead-request-flow"><LeadCapture id={id} onLeadCreated={setLeadId} privacyPolicyHref={privacyPolicyHref} />{leadId ? <Diagnostic leadId={leadId} /> : null}</div>;
}
