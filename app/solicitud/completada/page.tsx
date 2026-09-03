import type { Metadata } from "next";
import { Completion } from "@/components/completion";
export const metadata: Metadata = { title: "Solicitud completada", robots: { index: false, follow: false } };
export default function Page() { return <Completion />; }
