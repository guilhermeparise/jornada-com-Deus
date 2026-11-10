"use client";

import { useState } from "react";
import { supabase } from "../../lib/supabase";
import Link from "next/link";

export default function LoginPage() {
  const [modo, setModo] = useState<"login" | "cadastro">("login");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [mensagem, setMensagem] = useState("");

  async function enviarFormulario(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setCarregando(true);
    setMensagem("");

    try {
      if (modo === "cadastro") {
        const { data, error } = await supabase.auth.signUp({
          email,
          password: senha,
        });

        if (error) throw error;

        setMensagem(
          data.session
            ? "Conta criada com sucesso! Você já pode entrar."
            : "Cadastro realizado! Confira seu e-mail para confirmar sua conta."
        );
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password: senha,
        });

        if (error) throw error;

        window.location.href = "/";
      }
    } catch (error) {
      setMensagem(
        error instanceof Error
          ? error.message
          : "Não foi possível realizar a operação."
      );
    } finally {
      setCarregando(false);
    }
  }

  async function entrarComGoogle() {
    setMensagem("");

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) setMensagem(error.message);
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F5F0E7] px-5 py-10 text-[#302820]">
      <div className="w-full max-w-md">
        <Link
          href="/"
          className="mb-10 inline-block text-sm text-[#78664F]"
        >
          ← Voltar ao início
        </Link>

        <div className="mb-9 text-center">
          <p className="mb-4 text-xs uppercase tracking-[0.25em] text-[#78664F]">
            Jornada com Deus
          </p>

          <h1 className="font-serif text-4xl">
            {modo === "login" ? "Que bom ter você aqui." : "Vamos começar?"}
          </h1>

          <p className="mt-3 text-sm leading-6 text-[#78664F]">
            {modo === "login"
              ? "Entre na sua conta e continue sua caminhada."
              : "Crie sua conta e comece sua jornada com Deus."}
          </p>
        </div>

        <div className="rounded-3xl border border-[#E7DED0] bg-white/70 p-6 shadow-sm sm:p-8">
          <div className="mb-6 grid grid-cols-2 rounded-xl bg-[#F5F0E7] p-1">
            <button
              type="button"
              onClick={() => {
                setModo("login");
                setMensagem("");
              }}
              className={`rounded-lg py-3 text-sm transition ${
                modo === "login"
                  ? "bg-white font-semibold shadow-sm"
                  : "text-[#78664F]"
              }`}
            >
              Entrar
            </button>

            <button
              type="button"
              onClick={() => {
                setModo("cadastro");
                setMensagem("");
              }}
              className={`rounded-lg py-3 text-sm transition ${
                modo === "cadastro"
                  ? "bg-white font-semibold shadow-sm"
                  : "text-[#78664F]"
              }`}
            >
              Criar conta
            </button>
          </div>

          <form onSubmit={enviarFormulario} className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium">
                E-mail
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seuemail@exemplo.com"
                className="min-h-12 w-full rounded-xl border border-[#E7DED0] bg-[#F5F0E7] px-4 text-base outline-none transition focus:border-[#78664F]"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Senha
              </label>
              <input
                type="password"
                required
                minLength={6}
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                placeholder="Mínimo de 6 caracteres"
                className="min-h-12 w-full rounded-xl border border-[#E7DED0] bg-[#F5F0E7] px-4 text-base outline-none transition focus:border-[#78664F]"
              />
            </div>

            <button
              type="submit"
              disabled={carregando}
              className="min-h-12 w-full rounded-xl bg-[#78664F] px-4 font-medium text-white transition hover:opacity-90 disabled:opacity-60"
            >
              {carregando
                ? "Aguarde..."
                : modo === "login"
                  ? "Entrar na minha conta"
                  : "Criar minha conta"}
            </button>
          </form>

          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-[#E7DED0]" />
            <span className="text-xs text-[#78664F]">ou continue com</span>
            <div className="h-px flex-1 bg-[#E7DED0]" />
          </div>

          <button
            type="button"
            onClick={entrarComGoogle}
            className="min-h-12 w-full rounded-xl border border-[#E7DED0] bg-white px-4 font-medium transition hover:bg-[#F5F0E7]"
          >
            <span className="mr-2 font-bold">G</span>
            Continuar com Google
          </button>

          {mensagem && (
            <p
              role="status"
              className="mt-5 rounded-xl bg-[#F5F0E7] p-3 text-center text-sm leading-6 text-[#78664F]"
            >
              {mensagem}
            </p>
          )}
        </div>

        <p className="mt-7 text-center text-xs leading-5 text-[#78664F]">
          Um dia de cada vez, mais perto de Deus.
        </p>
      </div>
    </main>
  );
}