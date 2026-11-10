"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
const dias = [
  "Começar com Deus",
  "Você pode recomeçar",
  "Deus conhece seu coração",
  "Aproximar-se de Deus",
  "Aprender a entregar",
  "O valor do silêncio",
  "Descansar em Deus",
  "Quando a ansiedade aparece",
  "Não tenha medo",
  "Confiar mesmo sem entender",
  "Aprender a esperar",
  "A fé em tempos difíceis",
  "Deus é seu refúgio",
  "Um coração confiante",
  "Sua identidade em Deus",
  "O poder do perdão",
  "Um coração agradecido",
  "Descobrindo seu propósito",
  "Aprender a amar",
  "A força da oração",
  "Permanecer em Deus",
  "Desenvolver disciplina",
  "A importância da Palavra",
  "Escolher o que edifica",
  "Ser paciente",
  "Viver com humildade",
  "Ter um coração obediente",
  "Ser luz",
  "Continuar caminhando",
  "Uma vida com Deus",
];

export default function JornadaPage() {
  const [concluidos, setConcluidos] = useState<number[]>([]);
  const [carregado, setCarregado] = useState(false);

  useEffect(() => {
  async function carregarProgresso() {
    try {
      const { data: { user }, error: authError } =
        await supabase.auth.getUser();

      if (authError) throw authError;

      if (!user) {
        setConcluidos([]);
        return;
      }

      const { data, error } = await supabase
        .from("journey_progress")
        .select("day_number")
        .eq("user_id", user.id)
        .eq("completed", true);

      if (error) throw error;

      setConcluidos(
        (data || []).map((item) => item.day_number)
      );
    } catch (error) {
      console.error("Erro ao carregar progresso:", error);
    } finally {
      setCarregado(true);
    }
  }

  carregarProgresso();
}, []);

  const totalConcluidos = concluidos.length;
  const porcentagem = Math.round((totalConcluidos / 30) * 100);

  const proximoDia = dias.findIndex(
    (_, index) => !concluidos.includes(index + 1)
  ) + 1;

  const diaRecomendado = proximoDia > 0 ? proximoDia : 30;

  return (
    <main className="min-h-screen bg-[#F5F0E7] px-5 pb-12 pt-8 text-[#302820]">
      <div className="mx-auto max-w-2xl">

        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-2 text-sm text-[#78664F] transition hover:opacity-70"
        >
          <span>←</span>
          Voltar ao início
        </Link>

        <header className="mb-8">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#78664F]">
            Sua caminhada espiritual
          </p>

          <h1 className="font-serif text-4xl leading-tight">
            Jornada com Deus
          </h1>

          <p className="mt-3 max-w-md text-sm leading-6 text-[#78664F]">
            Um dia de cada vez, construindo uma vida mais próxima de Deus.
          </p>
        </header>

        <section className="mb-8 rounded-3xl bg-[#E7DED0] p-6">
          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <p className="text-sm text-[#78664F]">Seu progresso</p>
              <p className="mt-1 font-serif text-3xl">
                {carregado ? `${porcentagem}%` : "—"}
              </p>
            </div>

            <div className="text-right">
              <p className="text-sm text-[#78664F]">Dias concluídos</p>
              <p className="mt-1 text-xl font-semibold">
                {carregado ? `${totalConcluidos}/30` : "—"}
              </p>
            </div>
          </div>

          <div className="h-3 overflow-hidden rounded-full bg-[#F5F0E7]">
            <div
              className="h-full rounded-full bg-[#78664F] transition-all duration-700"
              style={{ width: `${carregado ? porcentagem : 0}%` }}
            />
          </div>

          <p className="mt-4 text-xs leading-5 text-[#78664F]">
            Cada momento com Deus é um passo importante. Continue no seu ritmo.
          </p>
        </section>

        <section className="mb-8">
          <div className="mb-4">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#78664F]">
              Continue sua jornada
            </p>
          </div>

          <Link
            href={`/jornada/${diaRecomendado}`}
            className="flex items-center justify-between gap-4 rounded-3xl bg-[#78664F] p-5 text-[#F5F0E7] transition hover:opacity-90"
          >
            <div>
              <p className="text-xs opacity-75">
                {totalConcluidos === 30
                  ? "Jornada concluída"
                  : `Próximo passo · Dia ${diaRecomendado}`}
              </p>

              <h2 className="mt-2 font-serif text-2xl">
                {totalConcluidos === 30
                  ? "Reviva sua caminhada"
                  : dias[diaRecomendado - 1]}
              </h2>

              <p className="mt-2 text-sm opacity-80">
                {totalConcluidos === 30
                  ? "Você pode revisitar qualquer dia."
                  : "Reserve alguns minutos para estar com Deus."}
              </p>
            </div>

            <span className="text-3xl">→</span>
          </Link>
        </section>

        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-serif text-2xl">Os 30 dias</h2>
            <span className="text-xs text-[#78664F]">
              {totalConcluidos} de 30 concluídos
            </span>
          </div>

          <div className="space-y-3">
            {dias.map((titulo, index) => {
              const numero = index + 1;
              const concluido = concluidos.includes(numero);

              return (
                <Link
                  key={numero}
                  href={`/jornada/${numero}`}
                  className="flex min-h-[76px] items-center gap-4 rounded-2xl border border-[#E7DED0] bg-white/60 px-4 py-4 transition hover:bg-white"
                >
                  <div
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${
                      concluido
                        ? "bg-[#78664F] text-white"
                        : "bg-[#E7DED0] text-[#78664F]"
                    }`}
                  >
                    {concluido ? "✓" : String(numero).padStart(2, "0")}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] uppercase tracking-wider text-[#78664F]">
                      Dia {numero}
                    </p>

                    <h3 className="mt-1 font-medium">
                      {titulo}
                    </h3>
                  </div>

                  <div className="shrink-0 text-right">
                    {concluido ? (
                      <span className="text-xs font-medium text-[#78664F]">
                        Concluído
                      </span>
                    ) : (
                      <span className="text-lg text-[#78664F]">›</span>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        <footer className="mt-10 rounded-2xl border border-[#E7DED0] p-5 text-center">
          <p className="font-serif text-lg">
            “Um dia de cada vez.”
          </p>
          <p className="mt-2 text-xs text-[#78664F]">
            Sua caminhada não precisa ser perfeita. Apenas continue.
          </p>
        </footer>

      </div>
    </main>
  );
}