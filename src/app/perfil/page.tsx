
"use client";

import { useEffect, useState } from "react";
import {
  ArrowLeft,
  UserRound,
  Mail,
  Pencil,
  Save,
  X,
  LogOut,
  Heart,
  CheckCircle2,
  BookHeart,
  Loader2,
  CalendarDays,
  Camera,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

type Profile = {
  full_name: string | null;
  avatar_url: string | null;
};

export default function PerfilPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [userId, setUserId] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [originalName, setOriginalName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [editing, setEditing] = useState(false);

  const [completedDays, setCompletedDays] = useState(0);
  const [prayerCount, setPrayerCount] = useState(0);
  const [answeredCount, setAnsweredCount] = useState(0);

  async function loadProfile() {
    setLoading(true);
    setError("");

    const { data: authData, error: authError } =
      await supabase.auth.getUser();

    if (authError || !authData.user) {
      router.replace("/login");
      return;
    }

    const user = authData.user;
    setUserId(user.id);
    setEmail(user.email || "");

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("full_name, avatar_url")
      .eq("id", user.id)
      .maybeSingle();

    if (profileError) {
      setError("Não foi possível carregar seu perfil.");
    }

    const savedName = profile?.full_name || user.user_metadata?.full_name || user.user_metadata?.name || "";

    setName(savedName);
    setOriginalName(savedName);
    setAvatarUrl(profile?.avatar_url || user.user_metadata?.avatar_url || user.user_metadata?.picture || "");

    // Criar o perfil no banco caso ainda não exista
    if (!profile && !profileError) {
      const { error: insertError } = await supabase
        .from("profiles")
        .insert({
          id: user.id,
          full_name: savedName,
          avatar_url: user.user_metadata?.avatar_url || user.user_metadata?.picture || null,
        });

      if (insertError) {
        setError("Não foi possível inicializar seu perfil.");
      }
    }

    const { data: journeyData, error: journeyError } = await supabase
      .from("journey_progress")
      .select("day_number, completed")
      .eq("user_id", user.id)
      .eq("completed", true);

    if (!journeyError) {
      setCompletedDays(journeyData?.length || 0);
    }

    const { data: prayerData, error: prayerError } = await supabase
      .from("prayer_requests")
      .select("id, answered")
      .eq("user_id", user.id);

    if (!prayerError) {
      setPrayerCount(prayerData?.length || 0);
      setAnsweredCount(
        prayerData?.filter((prayer) => prayer.answered).length || 0
      );
    }

    setLoading(false);
  }

  useEffect(() => {
    loadProfile();
  }, []);

  async function saveName() {
    if (!name.trim()) {
      setError("Digite seu nome antes de salvar.");
      return;
    }

    if (!userId) return;

    setSaving(true);
    setError("");

    const { error: saveError } = await supabase
      .from("profiles")
      .upsert({
        id: userId,
        full_name: name.trim(),
        avatar_url: avatarUrl || null,
        updated_at: new Date().toISOString(),
      });

    if (saveError) {
      setError("Não foi possível salvar seu nome. Tente novamente.");
    } else {
      setName(name.trim());
      setOriginalName(name.trim());
      setEditing(false);
    }

    setSaving(false);
  }

  async function logout() {
    const confirmed = window.confirm("Deseja realmente sair da sua conta?");
    if (!confirmed) return;

    const { error: logoutError } = await supabase.auth.signOut();

    if (logoutError) {
      setError("Não foi possível sair da conta.");
      return;
    }

    router.replace("/login");
    router.refresh();
  }

  const progress = Math.round((completedDays / 30) * 100);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F5F0E7]">
        <Loader2 className="animate-spin text-[#78664F]" size={30} />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F5F0E7] pb-12 text-[#302820]">
      <div className="mx-auto max-w-3xl px-5 pt-8 sm:px-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-[#78664F]"
        >
          <ArrowLeft size={18} />
          Voltar ao início
        </Link>

        <header className="mb-8 mt-8">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#927E64]">
            Sua caminhada
          </p>
          <h1 className="mt-2 font-serif text-4xl">Meu perfil</h1>
          <p className="mt-3 text-sm leading-6 text-[#786F64]">
            Acompanhe sua jornada e mantenha suas informações atualizadas.
          </p>
        </header>

        {error && (
          <div className="mb-5 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <section className="mb-6 rounded-3xl border border-[#E4DACA] bg-[#FBF8F2] p-6">
          <div className="flex flex-col items-center text-center">
            <div className="relative mb-4 flex h-24 w-24 items-center justify-center overflow-hidden rounded-full bg-[#E7DED0] text-[#78664F]">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt="Foto de perfil"
                  className="h-full w-full object-cover"
                />
              ) : (
                <UserRound size={42} />
              )}
            </div>

            <h2 className="font-serif text-2xl">
              {name || "Sua jornada começa aqui"}
            </h2>

            <p className="mt-1 text-sm text-[#786F64]">{email}</p>

            {!editing ? (
              <button
                onClick={() => setEditing(true)}
                className="mt-5 flex min-h-11 items-center gap-2 rounded-xl border border-[#DED3C3] px-4 text-sm font-medium text-[#78664F]"
              >
                <Pencil size={15} />
                Editar meu nome
              </button>
            ) : (
              <div className="mt-5 w-full max-w-sm">
                <label className="mb-2 block text-left text-xs font-medium">
                  Seu nome
                </label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  maxLength={80}
                  placeholder="Digite seu nome"
                  className="min-h-12 w-full rounded-xl border border-[#DED3C3] bg-[#F5F0E7] px-4 text-sm outline-none focus:border-[#927E64]"
                />

                <div className="mt-3 flex gap-2">
                  <button
                    onClick={saveName}
                    disabled={saving}
                    className="flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-[#78664F] px-4 text-sm text-white disabled:opacity-60"
                  >
                    {saving ? (
                      <Loader2 className="animate-spin" size={17} />
                    ) : (
                      <Save size={17} />
                    )}
                    Salvar
                  </button>

                  <button
                    onClick={() => {
                      setName(originalName);
                      setEditing(false);
                    }}
                    className="flex min-h-11 items-center gap-2 rounded-xl border border-[#DED3C3] px-4 text-sm"
                  >
                    <X size={16} />
                    Cancelar
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>

        <section className="mb-6">
          <h2 className="mb-3 font-serif text-2xl">Minha caminhada</h2>

          <div className="rounded-3xl border border-[#E4DACA] bg-[#FBF8F2] p-5">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Jornada de 30 dias</p>
                <p className="mt-1 text-xs text-[#786F64]">
                  {completedDays} de 30 dias concluídos
                </p>
              </div>
              <CalendarDays className="text-[#927E64]" size={23} />
            </div>

            <div className="h-3 overflow-hidden rounded-full bg-[#E7DED0]">
              <div
                className="h-full rounded-full bg-[#78664F] transition-all duration-500"
                style={{ width: `${Math.min(progress, 100)}%` }}
              />
            </div>

            <p className="mt-2 text-right text-xs font-semibold text-[#78664F]">
              {progress}% concluído
            </p>
          </div>
        </section>

        <section className="mb-6">
          <h2 className="mb-3 font-serif text-2xl">Minhas estatísticas</h2>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl border border-[#E4DACA] bg-[#FBF8F2] p-5">
              <BookHeart className="mb-3 text-[#927E64]" size={22} />
              <p className="font-serif text-3xl">{prayerCount}</p>
              <p className="mt-1 text-xs text-[#786F64]">
                Pedidos de oração
              </p>
            </div>

            <div className="rounded-2xl border border-[#E4DACA] bg-[#FBF8F2] p-5">
              <CheckCircle2 className="mb-3 text-[#927E64]" size={22} />
              <p className="font-serif text-3xl">{answeredCount}</p>
              <p className="mt-1 text-xs text-[#786F64]">
                Orações respondidas
              </p>
            </div>
          </div>
        </section>

        <section className="mb-6 rounded-2xl border border-[#E4DACA] bg-[#FBF8F2] p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E7DED0] text-[#78664F]">
              <Mail size={19} />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-[#786F64]">E-mail da sua conta</p>
              <p className="truncate text-sm font-medium">{email}</p>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-[#E4DACA] bg-[#FBF8F2] p-5">
          <div className="mb-4">
            <h2 className="font-serif text-xl">Configurações</h2>
            <p className="mt-1 text-xs text-[#786F64]">
              Em breve: preferências e notificações de fé.
            </p>
          </div>

          <div className="mb-4 flex items-center gap-3 rounded-xl bg-[#F2ECE1] p-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E7DED0] text-[#78664F]">
              <Heart size={19} />
            </div>
            <div>
              <p className="text-sm font-medium">Mensagens de Deus</p>
              <p className="text-xs text-[#786F64]">
                Notificações diárias na tela bloqueada
              </p>
            </div>
            <span className="ml-auto text-[10px] font-semibold text-[#927E64]">
              EM BREVE
            </span>
          </div>

          <button
            onClick={logout}
            className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl border border-[#D9C8BB] text-sm font-medium text-[#95675B] transition hover:bg-[#F6EDE8]"
          >
            <LogOut size={17} />
            Sair da minha conta
          </button>
        </section>

        <p className="mt-8 text-center font-serif text-sm italic text-[#927E64]">
          Que sua caminhada seja guiada pela fé.
        </p>
      </div>
    </main>
  );
}
