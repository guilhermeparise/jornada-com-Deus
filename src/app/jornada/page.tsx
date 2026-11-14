"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { getCurrentStreak, getLocalDateKey, isDateKey } from "@/lib/devotional-dates";
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
  const [completedDates, setCompletedDates] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [todayKey, setTodayKey] = useState("");
  const [carregado, setCarregado] = useState(false);
  const [progressWarning, setProgressWarning] = useState("");

  useEffect(() => {
  const today = getLocalDateKey();
  setTodayKey(today);
  setSelectedDate(today);

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
        .from("devotional_entries")
        .select("devotional_date")
        .eq("user_id", user.id)
        .eq("completed", true);

      if (error && error.code !== "PGRST205") throw error;
      if (error?.code === "PGRST205") {
        setProgressWarning("O calendário novo ainda não foi ativado no Supabase. Por enquanto, estou mostrando as conclusões antigas.");
      }

      const { data: legacyData } = await supabase
        .from("journey_progress")
        .select("day_number, completed_at")
        .eq("user_id", user.id)
        .eq("completed", true);
      setConcluidos((legacyData || []).map((item) => item.day_number));

      const dailyDates = (data || []).map((item) => item.devotional_date);
      const legacyDates = (legacyData || [])
        .map((item) => item.completed_at ? getLocalDateKey(new Date(item.completed_at)) : "")
        .filter(isDateKey);
      setCompletedDates([...new Set([...dailyDates, ...legacyDates])]);
    } catch (error) {
      console.error("Erro ao carregar progresso:", error);
    } finally {
      setCarregado(true);
    }
  }

  carregarProgresso();
}, []);

  const totalConcluidos = concluidos.length;
  const streak = getCurrentStreak(completedDates, todayKey);

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

        <section className="mb-8 rounded-3xl bg-[#78664F] p-6 text-white">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm text-white/75">Sua sequência de fé</p>
              <p className="mt-1 font-serif text-3xl">{carregado ? `${streak} ${streak === 1 ? "dia" : "dias"}` : "—"} 🔥</p>
            </div>
            <p className="text-right text-sm text-white/75">{totalConcluidos} devocionais<br />concluídos</p>
          </div>
          <p className="mt-4 text-xs leading-5 text-white/75">Entre na sua conta e conclua o devocional do dia para manter o foguinho aceso.</p>
        </section>

        {progressWarning && (
          <p role="status" className="mb-6 rounded-xl border border-[#D9C8BB] bg-[#FBF8F2] p-4 text-sm leading-6 text-[#78664F]">
            {progressWarning}
          </p>
        )}

        <section className="mb-8 rounded-3xl border border-[#E7DED0] bg-[#FFFCF6] p-6">
          <label htmlFor="devotional-date" className="text-xs font-semibold uppercase tracking-[0.16em] text-[#78664F]">Escolha um dia do calendário</label>
          <input
            id="devotional-date"
            type="date"
            value={selectedDate}
            max={todayKey || undefined}
            onChange={(event) => setSelectedDate(event.target.value)}
            className="mt-3 min-h-12 w-full rounded-xl border border-[#E7DED0] bg-[#F5F0E7] px-4 text-sm outline-none focus:border-[#78664F]"
          />
          <Link href={selectedDate ? `/jornada/${selectedDate}` : "/"} aria-disabled={!selectedDate} className="mt-4 flex min-h-12 items-center justify-center rounded-xl bg-[#78664F] px-5 text-sm font-medium text-white transition hover:opacity-90 aria-disabled:opacity-50">
            Abrir devocional deste dia →
          </Link>
        </section>

        <section className="mb-8 rounded-3xl bg-[#E7DED0] p-6">
          <div className="mb-5">
            <p className="text-sm text-[#78664F]">Total de devocionais concluídos</p>
            <p className="mt-1 font-serif text-3xl">
              {carregado ? totalConcluidos : "—"}
            </p>
          </div>

          <p className="mt-4 text-xs leading-5 text-[#78664F]">
            Dias concluídos ao longo da sua caminhada, sem limite de mês ou de calendário.
          </p>
        </section>

        <section className="mb-8">
          <div className="mb-4">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#78664F]">
              Continue sua jornada
            </p>
          </div>

          <Link
            href={selectedDate ? `/jornada/${selectedDate}` : "/"}
            aria-disabled={!selectedDate}
            className="flex items-center justify-between gap-4 rounded-3xl bg-[#78664F] p-5 text-[#F5F0E7] transition hover:opacity-90"
          >
            <div>
              <p className="text-xs opacity-75">
                Próximo encontro · {selectedDate}
              </p>

              <h2 className="mt-2 font-serif text-2xl">
                Devocional do dia escolhido
              </h2>

              <p className="mt-2 text-sm opacity-80">
                Reserve alguns minutos para estar com Deus.
              </p>
            </div>

            <span className="text-3xl">→</span>
          </Link>
        </section>

        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-serif text-2xl">Temas da jornada</h2>
            <span className="text-xs text-[#78664F]">
              {totalConcluidos} devocionais concluídos
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
