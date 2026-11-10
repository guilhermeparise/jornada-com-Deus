"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";

type JourneyRow = {
  day_number: number;
  completed: boolean;
};

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

export default function Home() {
  const [completedDays, setCompletedDays] = useState<number[]>([]);
  const [userName, setUserName] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const today = useMemo(() => new Date(), []);
  const formattedDate = new Intl.DateTimeFormat("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
  }).format(today);
  const progress = Math.round((completedDays.length / 30) * 100);
  const nextDay = dias.findIndex((_, index) => !completedDays.includes(index + 1)) + 1;
  const recommendedDay = nextDay > 0 ? nextDay : 30;
  const allCompleted = completedDays.length === 30;

  useEffect(() => {
    let active = true;

    async function loadDashboard() {
      setLoading(true);
      setLoadError("");

      try {
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError) throw authError;

        if (!user) {
          if (active) {
            setCompletedDays([]);
            setLoadError("Entre na sua conta para acompanhar seu progresso.");
          }
          return;
        }

        const metadataName = user.user_metadata?.full_name || user.user_metadata?.name;
        const emailName = user.email?.split("@")[0];
        if (active) setUserName(typeof metadataName === "string" ? metadataName : (emailName || ""));

        const { data, error } = await supabase
          .from("journey_progress")
          .select("day_number, completed")
          .eq("user_id", user.id)
          .eq("completed", true);

        if (error) throw error;

        const validDays = ((data || []) as JourneyRow[])
          .map((row) => row.day_number)
          .filter((day) => Number.isInteger(day) && day >= 1 && day <= 30);

        if (active) setCompletedDays([...new Set(validDays)]);
      } catch (error) {
        console.error("Erro ao carregar a tela inicial:", error);
        if (active) setLoadError("Não foi possível carregar seu progresso. Atualize a página para tentar novamente.");
      } finally {
        if (active) setLoading(false);
      }
    }

    loadDashboard();
    return () => {
      active = false;
    };
  }, []);

  const greeting = userName ? `Olá, ${userName}.` : "Olá, seja bem-vindo.";

  return (
    <main className="min-h-screen bg-[#F5F0E7] pb-28 text-[#302820]">
      <div className="mx-auto max-w-md px-5 pt-9">
        <header className="mb-9 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm capitalize text-[#897D6D]">{formattedDate}</p>
            <h1 className="mt-2 font-serif text-3xl">{greeting}</h1>
            <p className="mt-1 text-sm text-[#897D6D]">Que hoje seja um dia de conexão com Deus.</p>
          </div>
          <Link href="/perfil" aria-label="Abrir perfil" className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#E7DED0] text-xl text-[#78664F]">♡</Link>
        </header>

        <section className="rounded-3xl bg-[#78664F] p-6 text-[#FFFDF8] shadow-lg">
          <p className="text-xs tracking-[3px] opacity-80">SUA JORNADA</p>
          <h2 className="mt-4 font-serif text-3xl leading-tight">Um dia de cada vez,<br />mais perto de Deus.</h2>
          <p className="mt-3 text-sm leading-relaxed opacity-80">Pequenos momentos com Deus podem transformar sua caminhada.</p>

          <div className="mt-7 flex items-center justify-between">
            <div>
              <p className="text-sm opacity-80">Seu progresso</p>
              <p className="mt-1 text-2xl font-semibold">{loading ? "—" : `${completedDays.length} de 30 dias`}</p>
            </div>
            <div className="flex h-16 w-16 items-center justify-center rounded-full border-4 border-[#C9B89F]">
              <span className="text-sm font-semibold">{loading ? "—" : `${progress}%`}</span>
            </div>
          </div>
          <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-white/20">
            <div className="h-full rounded-full bg-[#E7DED0] transition-all duration-500" style={{ width: `${loading ? 0 : progress}%` }} />
          </div>
          <Link href={`/jornada/${recommendedDay}`} className="mt-6 block w-full rounded-xl bg-[#F5F0E7] py-4 text-center font-medium text-[#554735] transition hover:opacity-90">
            {allCompleted ? "Revisar minha jornada →" : "Continuar minha jornada →"}
          </Link>
          {loadError && <p className="mt-3 text-xs leading-5 text-white/90">{loadError} <Link href="/login" className="underline">Entrar</Link></p>}
        </section>

        <section className="mt-9">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-serif text-2xl">Seu momento de hoje</h2>
            <span className="text-xs text-[#897D6D]">DIA {String(recommendedDay).padStart(2, "0")}</span>
          </div>
          <div className="rounded-2xl bg-[#E7DED0] p-5">
            <p className="text-xs tracking-widest text-[#78664F]">DEVOCIONAL DA JORNADA</p>
            <h3 className="mt-3 font-serif text-2xl">{allCompleted ? "Uma vida com Deus" : dias[recommendedDay - 1]}</h3>
            <p className="mt-2 text-sm leading-relaxed text-[#716657]">Separe alguns minutos para ler, refletir, orar e dar o próximo passo na sua caminhada.</p>
            <Link href={`/jornada/${recommendedDay}`} className="mt-5 inline-flex min-h-11 items-center rounded-xl border border-[#78664F]/40 px-5 py-3 text-sm transition hover:bg-white/40">Abrir devocional →</Link>
          </div>
        </section>

        <section className="mt-9">
          <h2 className="mb-4 font-serif text-2xl">Palavra para sua caminhada</h2>
          <div className="rounded-2xl border border-[#E7DED0] bg-[#FFFCF6] p-6">
            <p className="text-xs tracking-widest text-[#897D6D]">UMA REFLEXÃO PARA VOCÊ</p>
            <p className="mt-4 font-serif text-xl leading-relaxed">“Não precisa resolver toda a sua vida hoje. Apenas dê o próximo passo com fé.”</p>
            <p className="mt-5 text-xs text-[#897D6D]">Reflexão original · Jornada com Deus</p>
          </div>
        </section>

        <section className="mt-9">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-serif text-2xl">Sua caminhada</h2>
            <Link href="/jornada" className="text-xs text-[#78664F] underline">Ver os 30 dias</Link>
          </div>
          <div className="space-y-3">
            {dias.slice(0, 3).map((title, index) => {
              const dayNumber = index + 1;
              const done = completedDays.includes(dayNumber);
              return (
                <Link key={dayNumber} href={`/jornada/${dayNumber}`} className="flex min-h-[68px] items-center gap-4 rounded-xl bg-[#FFFCF6] p-4 transition hover:bg-white">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#E7DED0] text-sm">{done ? "✓" : String(dayNumber).padStart(2, "0")}</div>
                  <div className="flex-1">
                    <p className="text-xs text-[#897D6D]">DIA {String(dayNumber).padStart(2, "0")}</p>
                    <p className="mt-1 text-sm font-medium">{title}</p>
                  </div>
                  <span className="text-[#78664F]">{done ? "Concluído" : "›"}</span>
                </Link>
              );
            })}
          </div>
        </section>

        <nav className="fixed inset-x-0 bottom-0 z-20 border-t border-[#E7DED0] bg-[#FFFCF6]/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md">
          <div className="mx-auto grid max-w-md grid-cols-4 py-3">
            <Link href="/" aria-current="page" className="flex min-h-11 flex-col items-center justify-center gap-1 text-xs font-semibold text-[#78664F]"><span className="text-xl">⌂</span>Início</Link>
            <Link href="/biblia" className="flex min-h-11 flex-col items-center justify-center gap-1 text-xs text-[#A09688]"><span className="text-xl">▤</span>Bíblia</Link>
            <Link href="/oracoes" className="flex min-h-11 flex-col items-center justify-center gap-1 text-xs text-[#A09688]"><span className="text-xl">♡</span>Orações</Link>
            <Link href="/perfil" className="flex min-h-11 flex-col items-center justify-center gap-1 text-xs text-[#A09688]"><span className="text-xl">○</span>Perfil</Link>
          </div>
        </nav>
      </div>
    </main>
  );
}
