import type { Metadata } from "next";
import AssessmentForm from "@/components/assessment/AssessmentForm";
import ChatWidget from "@/components/ChatWidget";
import { questions } from "@/components/assessment/questions";

export const metadata: Metadata = {
  title: "Free AI Opportunity Snapshot | Sacramento AI Agency",
  description: `Answer ${questions.length} quick questions about your business and get a snapshot of where AI can save you the most time and money.`,
};

export default function AssessmentPage() {
  return (
    <div className="min-h-screen pt-20 bg-primary-dark">
      <ChatWidget />
      <div className="max-w-3xl mx-auto section-padding">
        <AssessmentForm />
      </div>
    </div>
  );
}
