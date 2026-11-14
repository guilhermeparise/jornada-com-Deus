"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { getCurrentStreak, getDevotionalNumber, getLocalDateKey, shiftDateKey } from "@/lib/devotional-dates";

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
  const [completedDates, setCompletedDates] = useState<string[]>([]);
  const [totalCompleted, setTotalCompleted] = useState(0);
  const [userName, setUserName] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const [today, setToday] = useState<Date | null>(null);

  useEffect(() => {
    setToday(new Date());
  }, []);

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
            setCompletedDates([]);
            setLoadError("Entre na sua conta para acompanhar seu progresso.");
          }
          return;
        }

        const metadataName = user.user_metadata?.full_name || user.user_metadata?.name;
        const emailName = user.email?.split("@")[0];
        if (active) setUserName(typeof metadataName === "string" ? metadataName : (emailName || ""));

        const { data, error } = await supabase
          .from("devotional_entries")
          .select("devotional_date")
          .eq("user_id", user.id)
          .eq("completed", true);

        if (error && error.code !== "PGRST205") throw error;
        // Removido o tratamento que exibia o erro de "calendário não ativado"

        const { data: legacyData, error: legacyError } = await supabase
  .from("journey_progress")
  .select("day_number, completed_at")
  .eq("user_id", user.id)
  .eq("completed", true);

if (legacyError) {
  console.warn("Não foi possível carregar conclusões antigas:", legacyError);
}

if (active) {
  setTotalCompleted(
    new Set((legacyData || []).map((row) => row.day_number)).size
  );
}
        if (legacyError) console.warn("Não foi possível carregar conclusões antigas:", legacyError);

        const dailyDates = (data || []).map((row) => row.devotional_date);
        const legacyDates = (legacyData || [])
          .map((row) => row.completed_at ? getLocalDateKey(new Date(row.completed_at)) : "")
          .filter((dateKey) => /^\d{4}-\d{2}-\d{2}$/.test(dateKey));
        if (active) setCompletedDates([...new Set([...dailyDates, ...legacyDates])]);
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

  if (!today) {
    return (
      <main className="min-h-screen bg-[#F5F0E7] flex items-center justify-center text-[#78664F]">
        Carregando sua jornada...
      </main>
    );
  }

  const formattedDate = new Intl.DateTimeFormat("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
  }).format(today);
  const todayKey = getLocalDateKey(today);
  const todayDevotionalNumber = getDevotionalNumber(todayKey, dias.length) + 1;
  const todayCompleted = completedDates.includes(todayKey);
  const currentStreak = getCurrentStreak(completedDates, todayKey);
  const recentDates = [todayKey, shiftDateKey(todayKey, -1), shiftDateKey(todayKey, -2)];

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
              <p className="text-sm opacity-80">Sua sequência</p>
              <p className="mt-1 text-2xl font-semibold">{loading ? "—" : `${currentStreak} ${currentStreak === 1 ? "dia" : "dias"} seguidos`}</p>
            </div>
            <div className="flex h-16 w-16 items-center justify-center rounded-full border-4 border-[#C9B89F] text-2xl" aria-label={`${currentStreak} dias seguidos`}>
              <span>{loading ? "—" : "🔥"}</span>
            </div>
          </div>
          <p className="mt-2 text-xs opacity-75">
            {loading ? "Carregando seu histórico..." : `${totalCompleted} ${totalCompleted === 1 ? "devocional concluído" : "devocionais concluídos"} no total`}
          </p>
          <p className="mt-4 text-xs opacity-80">{todayCompleted ? "Devocional de hoje concluído. Amanhã tem mais." : "Complete o devocional de hoje para manter seu foguinho."}</p>
          <Link href={`/jornada/${todayKey}`} className="mt-5 block w-full rounded-xl bg-[#F5F0E7] py-4 text-center font-medium text-[#554735] transition hover:opacity-90">
            {todayCompleted ? "Revisar meu devocional →" : "Fazer devocional de hoje →"}
          </Link>
          {loadError && <p className="mt-3 text-xs leading-5 text-white/90">{loadError}{loadError.startsWith("Entre na sua conta") && <> <Link href="/login" className="underline">Entrar</Link></>}</p>}
        </section>

        <Link href="/venda" className="mt-4 flex min-h-12 items-center justify-center rounded-xl border border-[#78664F]/25 bg-[#FFFCF6] px-4 text-sm font-medium text-[#78664F] transition hover:bg-white">
          Conheça a jornada completa · R$ 39,90
        </Link>

        <section className="mt-9">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-serif text-2xl">Seu momento de hoje</h2>
            <span className="text-xs text-[#897D6D]">HOJE · DIA {String(todayDevotionalNumber).padStart(2, "0")}</span>
          </div>
          <div className="rounded-2xl bg-[#E7DED0] p-5">
            <p className="text-xs tracking-widest text-[#78664F]">DEVOCIONAL DA JORNADA</p>
            <h3 className="mt-3 font-serif text-2xl">{dias[todayDevotionalNumber - 1]}</h3>
            <p className="mt-2 text-sm leading-relaxed text-[#716657]">Separe alguns minutos para ler, refletir, orar e dar o próximo passo na sua caminhada.</p>
            <Link href={`/jornada/${todayKey}`} className="mt-5 inline-flex min-h-11 items-center rounded-xl border border-[#78664F]/40 px-5 py-3 text-sm transition hover:bg-white/40">Abrir devocional →</Link>
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
            <Link href="/jornada" className="text-xs text-[#78664F] underline">Abrir calendário</Link>
          </div>
          <div className="space-y-3">
            {recentDates.map((dateKey) => {
              const dayNumber = getDevotionalNumber(dateKey, dias.length) + 1;
              const done = completedDates.includes(dateKey);
              return (
                <Link key={dateKey} href={`/jornada/${dateKey}`} className="flex min-h-[68px] items-center gap-4 rounded-xl bg-[#FFFCF6] p-4 transition hover:bg-white">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#E7DED0] text-sm">{done ? "✓" : String(dayNumber).padStart(2, "0")}</div>
                  <div className="flex-1">
                    <p className="text-xs text-[#897D6D]">{new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "short" }).format(new Date(`${dateKey}T12:00:00Z`))}</p>
                    <p className="mt-1 text-sm font-medium">{dias[dayNumber - 1]}</p>
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
