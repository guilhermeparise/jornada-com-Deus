
import { Suspense } from "react";
import DevocionalClient from "./DevocionalClient";

type PageProps = {
  params: Promise<{ dia: string }>;
};

async function ConteudoDevocional({ params }: PageProps) {
  const { dia } = await params;

  return <DevocionalClient dia={dia} />;
}

export default function Page({ params }: PageProps) {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-[#F5F0E7] flex items-center justify-center text-[#78664F]">
          Carregando seu devocional...
        </main>
      }
    >
      <ConteudoDevocional params={params} />
    </Suspense>
  );
}
