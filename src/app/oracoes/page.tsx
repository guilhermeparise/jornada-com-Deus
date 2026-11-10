
"use client";

import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Plus,
  Heart,
  CheckCircle2,
  Circle,
  Trash2,
  Pencil,
  X,
  BookHeart,
  Send,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

type Prayer = {
  id: string;
  title: string;
  description: string | null;
  answered: boolean;
  created_at: string;
};

type Reflection = {
  id: string;
  prayer_request_id: string;
  content: string;
  created_at: string;
};

export default function OracoesPage() {
  const [prayers, setPrayers] = useState<Prayer[]>([]);
  const [reflections, setReflections] = useState<Reflection[]>([]);
  const [userId, setUserId] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedPrayer, setSelectedPrayer] = useState<string | null>(null);
  const [reflectionText, setReflectionText] = useState("");

  async function loadData() {
    setLoading(true);
    setError("");

    const { data: authData, error: authError } =
      await supabase.auth.getUser();

    if (authError || !authData.user) {
      setError("Entre na sua conta para acessar seu diário de oração.");
      setLoading(false);
      return;
    }

    setUserId(authData.user.id);

    const { data: prayerData, error: prayerError } = await supabase
      .from("prayer_requests")
      .select("*")
      .order("created_at", { ascending: false });

    const { data: reflectionData, error: reflectionError } = await supabase
      .from("prayer_reflections")
      .select("*")
      .order("created_at", { ascending: false });

    if (prayerError || reflectionError) {
      setError("Não foi possível carregar seus registros. Tente novamente.");
    } else {
      setPrayers(prayerData || []);
      setReflections(reflectionData || []);
    }

    setLoading(false);
  }

  useEffect(() => {
    loadData();
  }, []);

  async function savePrayer() {
    if (!title.trim()) {
      setError("Escreva um título para seu pedido de oração.");
      return;
    }

    if (!userId) return;

    setSaving(true);
    setError("");

    if (editingId) {
      const { error } = await supabase
        .from("prayer_requests")
        .update({
          title: title.trim(),
          description: description.trim(),
          updated_at: new Date().toISOString(),
        })
        .eq("id", editingId);

      if (error) {
        setError("Não foi possível atualizar seu pedido.");
      }
    } else {
      const { error } = await supabase
        .from("prayer_requests")
        .insert({
          user_id: userId,
          title: title.trim(),
          description: description.trim(),
        });

      if (error) {
        setError("Não foi possível salvar seu pedido.");
      }
    }

    setTitle("");
    setDescription("");
    setEditingId(null);
    setSaving(false);
    await loadData();
  }

  function editPrayer(prayer: Prayer) {
    setEditingId(prayer.id);
    setTitle(prayer.title);
    setDescription(prayer.description || "");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function toggleAnswered(prayer: Prayer) {
    const { error } = await supabase
      .from("prayer_requests")
      .update({
        answered: !prayer.answered,
        updated_at: new Date().toISOString(),
      })
      .eq("id", prayer.id);

    if (error) {
      setError("Não foi possível atualizar o pedido.");
      return;
    }

    await loadData();
  }

  async function deletePrayer(id: string) {
    const confirmed = window.confirm(
      "Deseja realmente excluir este pedido de oração?"
    );

    if (!confirmed) return;

    const { error } = await supabase
      .from("prayer_requests")
      .delete()
      .eq("id", id);

    if (error) {
      setError("Não foi possível excluir o pedido.");
      return;
    }

    if (selectedPrayer === id) setSelectedPrayer(null);
    await loadData();
  }

  async function saveReflection() {
    if (!reflectionText.trim() || !selectedPrayer || !userId) return;

    setSaving(true);
    setError("");

    const { error } = await supabase.from("prayer_reflections").insert({
      user_id: userId,
      prayer_request_id: selectedPrayer,
      content: reflectionText.trim(),
    });

    if (error) {
      setError("Não foi possível salvar sua reflexão.");
    } else {
      setReflectionText("");
      await loadData();
    }

    setSaving(false);
  }

  async function deleteReflection(id: string) {
    const confirmed = window.confirm("Excluir esta reflexão?");
    if (!confirmed) return;

    const { error } = await supabase
      .from("prayer_reflections")
      .delete()
      .eq("id", id);

    if (error) {
      setError("Não foi possível excluir a reflexão.");
      return;
    }

    await loadData();
  }

  const answeredCount = prayers.filter((p) => p.answered).length;
  const pendingCount = prayers.length - answeredCount;

  const selectedReflections = reflections.filter(
    (reflection) => reflection.prayer_request_id === selectedPrayer
  );

  return (
    <main className="min-h-screen bg-[#F5F0E7] text-[#302820] pb-12">
      <div className="mx-auto max-w-3xl px-5 pt-8 sm:px-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-[#78664F] hover:opacity-70"
        >
          <ArrowLeft size={18} />
          Voltar ao início
        </Link>

        <header className="mt-8 mb-8">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#E7DED0] text-[#78664F]">
            <BookHeart size={25} />
          </div>

          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#927E64]">
            Seu espaço particular
          </p>

          <h1 className="mt-2 font-serif text-4xl">
            Diário de Oração
          </h1>

          <p className="mt-3 max-w-xl text-sm leading-6 text-[#786F64]">
            Um lugar para conversar com Deus, registrar seus pedidos e
            acompanhar cada momento da sua caminhada de fé.
          </p>
        </header>

        <section className="mb-8 grid grid-cols-2 gap-3">
          <div className="rounded-2xl border border-[#E4DACA] bg-[#FBF8F2] p-4">
            <Heart className="mb-3 text-[#927E64]" size={20} />
            <p className="font-serif text-3xl">{prayers.length}</p>
            <p className="mt-1 text-xs text-[#786F64]">Pedidos registrados</p>
          </div>

          <div className="rounded-2xl border border-[#E4DACA] bg-[#FBF8F2] p-4">
            <CheckCircle2 className="mb-3 text-[#927E64]" size={20} />
            <p className="font-serif text-3xl">{answeredCount}</p>
            <p className="mt-1 text-xs text-[#786F64]">Orações respondidas</p>
          </div>
        </section>

        {error && (
          <div className="mb-5 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <section className="mb-8 rounded-3xl border border-[#E4DACA] bg-[#FBF8F2] p-5 sm:p-6">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="font-serif text-2xl">
                {editingId ? "Editar pedido" : "Novo pedido"}
              </h2>
              <p className="mt-1 text-xs text-[#786F64]">
                Escreva o que está em seu coração.
              </p>
            </div>
            <Heart size={22} className="text-[#927E64]" />
          </div>

          <label className="mb-2 block text-sm font-medium">
            Título do pedido
          </label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ex.: Minha família, trabalho, saúde..."
            maxLength={100}
            className="mb-4 min-h-12 w-full rounded-xl border border-[#DED3C3] bg-[#F5F0E7] px-4 text-sm outline-none transition focus:border-[#927E64]"
          />

          <label className="mb-2 block text-sm font-medium">
            Descrição
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Escreva seu pedido de oração..."
            rows={4}
            className="w-full resize-y rounded-xl border border-[#DED3C3] bg-[#F5F0E7] p-4 text-sm leading-6 outline-none transition focus:border-[#927E64]"
          />

          <div className="mt-4 flex gap-2">
            <button
              onClick={savePrayer}
              disabled={saving}
              className="flex min-h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-[#78664F] px-5 text-sm font-medium text-white transition hover:bg-[#65553F] disabled:opacity-60"
            >
              {saving ? (
                <Loader2 className="animate-spin" size={18} />
              ) : (
                <Plus size={18} />
              )}
              {editingId ? "Salvar alterações" : "Salvar pedido"}
            </button>

            {editingId && (
              <button
                onClick={() => {
                  setEditingId(null);
                  setTitle("");
                  setDescription("");
                }}
                className="min-h-12 rounded-xl border border-[#DED3C3] px-4 text-sm"
              >
                Cancelar
              </button>
            )}
          </div>
        </section>

        <section>
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="font-serif text-2xl">Minhas orações</h2>
              <p className="mt-1 text-xs text-[#786F64]">
                {pendingCount} pendentes · {answeredCount} respondidas
              </p>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="animate-spin text-[#78664F]" size={28} />
            </div>
          ) : prayers.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-[#CFC1AD] px-5 py-10 text-center">
              <Heart className="mx-auto mb-4 text-[#A7957D]" size={30} />
              <h3 className="font-serif text-xl">Seu diário começa aqui</h3>
              <p className="mx-auto mt-2 max-w-xs text-sm leading-6 text-[#786F64]">
                Registre seu primeiro pedido de oração. Este espaço é seu.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {prayers.map((prayer) => (
                <article
                  key={prayer.id}
                  className="rounded-2xl border border-[#E4DACA] bg-[#FBF8F2] p-5"
                >
                  <div className="flex items-start gap-3">
                    <button
                      onClick={() => toggleAnswered(prayer)}
                      aria-label={
                        prayer.answered
                          ? "Marcar como pendente"
                          : "Marcar como respondida"
                      }
                      className="mt-1 shrink-0 text-[#927E64]"
                    >
                      {prayer.answered ? (
                        <CheckCircle2 size={22} />
                      ) : (
                        <Circle size={22} />
                      )}
                    </button>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3
                          className={`font-serif text-xl ${
                            prayer.answered
                              ? "text-[#928778]"
                              : "text-[#302820]"
                          }`}
                        >
                          {prayer.title}
                        </h3>
                        {prayer.answered && (
                          <span className="rounded-full bg-[#E7DED0] px-2 py-1 text-[10px] font-semibold text-[#78664F]">
                            Respondida
                          </span>
                        )}
                      </div>

                      {prayer.description && (
                        <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-[#786F64]">
                          {prayer.description}
                        </p>
                      )}

                      <p className="mt-3 text-[11px] text-[#A09280]">
                        Registrado em{" "}
                        {new Date(prayer.created_at).toLocaleDateString(
                          "pt-BR"
                        )}
                      </p>

                      <div className="mt-4 flex flex-wrap gap-3 border-t border-[#E9E1D5] pt-3">
                        <button
                          onClick={() =>
                            setSelectedPrayer(
                              selectedPrayer === prayer.id ? null : prayer.id
                            )
                          }
                          className="text-xs font-medium text-[#78664F]"
                        >
                          {selectedPrayer === prayer.id
                            ? "Fechar reflexões"
                            : "Ver reflexões"}
                        </button>

                        <button
                          onClick={() => editPrayer(prayer)}
                          className="flex items-center gap-1 text-xs text-[#786F64]"
                        >
                          <Pencil size={13} /> Editar
                        </button>

                        <button
                          onClick={() => deletePrayer(prayer.id)}
                          className="flex items-center gap-1 text-xs text-[#A46C61]"
                        >
                          <Trash2 size={13} /> Excluir
                        </button>
                      </div>
                    </div>
                  </div>

                  {selectedPrayer === prayer.id && (
                    <div className="mt-5 rounded-2xl bg-[#F2ECE1] p-4">
                      <h4 className="mb-3 font-serif text-lg">
                        Minhas reflexões
                      </h4>

                      <div className="mb-3 flex gap-2">
                        <textarea
                          value={reflectionText}
                          onChange={(e) => setReflectionText(e.target.value)}
                          placeholder="Registre aqui seus pensamentos e reflexões..."
                          rows={3}
                          className="min-w-0 flex-1 rounded-xl border border-[#DED3C3] bg-[#FBF8F2] p-3 text-sm outline-none focus:border-[#927E64]"
                        />
                        <button
                          onClick={saveReflection}
                          disabled={saving || !reflectionText.trim()}
                          aria-label="Salvar reflexão"
                          className="flex h-11 w-11 shrink-0 items-center justify-center self-end rounded-xl bg-[#78664F] text-white disabled:opacity-50"
                        >
                          {saving ? (
                            <Loader2 className="animate-spin" size={18} />
                          ) : (
                            <Send size={17} />
                          )}
                        </button>
                      </div>

                      {selectedReflections.length === 0 ? (
                        <p className="py-3 text-xs text-[#8C806F]">
                          Você ainda não registrou reflexões para este pedido.
                        </p>
                      ) : (
                        <div className="space-y-3">
                          {selectedReflections.map((reflection) => (
                            <div
                              key={reflection.id}
                              className="rounded-xl bg-[#FBF8F2] p-3"
                            >
                              <p className="whitespace-pre-wrap text-sm leading-6">
                                {reflection.content}
                              </p>
                              <div className="mt-2 flex items-center justify-between">
                                <span className="text-[10px] text-[#A09280]">
                                  {new Date(
                                    reflection.created_at
                                  ).toLocaleDateString("pt-BR")}
                                </span>
                                <button
                                  onClick={() =>
                                    deleteReflection(reflection.id)
                                  }
                                  className="text-xs text-[#A46C61]"
                                >
                                  Excluir
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </article>
              ))}
            </div>
          )}
        </section>

        <div className="mt-10 rounded-2xl bg-[#E7DED0] p-5 text-center">
          <Heart className="mx-auto mb-2 text-[#78664F]" size={20} />
          <p className="font-serif text-lg italic">
            "Orai sem cessar."
          </p>
          <p className="mt-1 text-xs text-[#786F64]">1 Tessalonicenses 5:17</p>
        </div>
      </div>
    </main>
  );
}
