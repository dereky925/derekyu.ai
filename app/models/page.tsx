import type { Metadata } from "next";
import { ModelsPageContent } from "@/components/models-page-content";

export const metadata: Metadata = {
  title: "Models",
  description:
    "Interactive Onshape CAD assemblies by Derek Yu — orbit hardware in the browser.",
  alternates: { canonical: "/models" },
};

export default function ModelsPage() {
  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-6 pb-24 pt-20 sm:pt-28">
      <ModelsPageContent />
    </main>
  );
}
