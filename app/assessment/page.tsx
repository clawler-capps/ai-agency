import type { Metadata } from "next";
import AssessmentForm from "@/components/assessment/AssessmentForm";

export const metadata: Metadata = {
  title: "Free AI Opportunity Assessment — Capps AI",
  description:
    "Answer 7 quick questions about your business and get an instant snapshot of where AI can save you the most time and money.",
};

export default function AssessmentPage() {
  return (
    <div className="min-h-screen pt-20 bg-primary-dark">
      <div className="max-w-3xl mx-auto section-padding">
        <AssessmentForm />
      </div>
    </div>
  );
}
