
"use client";

import { useState } from "react";
import { supabase } from "../../lib/supabase";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const [modo, setModo] = useState<"login" | "cadastro">("login");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mostrarConfirmacao, setMostrarConfirmacao] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState(false);

  function mudarModo(novoModo: "login" | "cadastro") {
    setModo(novoModo);
    setMensagem("");
    setErro(false);
    setSenha("");
    setConfirmarSenha("");
    setMostrarSenha(false);
    setMostrarConfirmacao(false);
  }

  async function enviarFormulario(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();
    setMensagem("");
    setErro(false);

    if (modo === "cadastro" && senha !== confirmarSenha) {
      setMensagem("As senhas não coincidem.");
      setErro(true);
      return;
    }

    setCarregando(true);

    try {
      if (modo === "cadastro") {
        const { data, error } = await supabase.auth.signUp({
          email: email.trim().toLowerCase(),
          password: senha,
          options: {
           emailRedirectTo: "https://jornada-com-deus-three.vercel.app/auth/callback",
          },
        });

        if (error) throw error;

        if (data.session) {
          window.location.assign("/");
          return;
        }

        setMensagem(
          "Confira seu e-mail para confirmar o cadastro. Depois, volte aqui para entrar."
        );
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: email.trim().toLowerCase(),
          password: senha,
        });

        if (error) throw error;

        window.location.assign("/");
      }
    } catch (error) {
      setErro(true);

      const codigo =
        error && typeof error === "object" && "code" in error
          ? String(error.code)
          : "";

      if (codigo === "email_not_confirmed") {
        setMensagem(
          "Seu e-mail ainda não foi confirmado. Verifique sua caixa de entrada e o spam."
        );
      } else if (codigo === "invalid_credentials") {
        setMensagem(
          "E-mail ou senha inválidos. Confira os dados ou recupere sua senha."
        );
      } else if (codigo === "user_already_exists") {
        setMensagem(
          "Este e-mail já está cadastrado. Tente entrar ou recuperar sua senha."
        );
      } else {
        setMensagem(
          error instanceof Error
            ? error.message
            : "Não foi possível realizar a operação."
        );
      }
    } finally {
      setCarregando(false);
    }
  }

  async function entrarComGoogle() {
    setMensagem("");
    setErro(false);
    setCarregando(true);

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setMensagem(error.message);
      setErro(true);
      setCarregando(false);
    }
  }

  async function recuperarSenha() {
    if (!email.trim()) {
      setMensagem("Digite seu e-mail para recuperar a senha.");
      setErro(true);
      return;
    }

    setCarregando(true);
    setMensagem("");
    setErro(false);

    const { error } = await supabase.auth.resetPasswordForEmail(
      email.trim().toLowerCase(),
      {
        redirectTo: `${window.location.origin}/auth/callback`,
      }
    );

    if (error) {
      setMensagem("Não foi possível solicitar a recuperação de senha.");
      setErro(true);
    } else {
      setMensagem(
        "Se houver uma conta para este e-mail, você receberá instruções de recuperação."
      );
    }

    setCarregando(false);
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
            {modo === "login"
              ? "Que bom ter você aqui."
              : "Vamos começar?"}
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
              onClick={() => mudarModo("login")}
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
              onClick={() => mudarModo("cadastro")}
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
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium"
              >
                E-mail
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seuemail@exemplo.com"
                className="min-h-12 w-full rounded-xl border border-[#E7DED0] bg-[#F5F0E7] px-4 text-base outline-none focus:border-[#78664F]"
              />
            </div>

            <div>
              <label
                htmlFor="senha"
                className="mb-2 block text-sm font-medium"
              >
                Senha
              </label>
              <div className="relative">
                <input
                  id="senha"
                  type={mostrarSenha ? "text" : "password"}
                  autoComplete={
                    modo === "cadastro"
                      ? "new-password"
                      : "current-password"
                  }
                  required
                  minLength={6}
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  placeholder="Mínimo de 6 caracteres"
                  className="min-h-12 w-full rounded-xl border border-[#E7DED0] bg-[#F5F0E7] px-4 pr-12 text-base outline-none focus:border-[#78664F]"
                />
                <button
                  type="button"
                  aria-label={
                    mostrarSenha ? "Ocultar senha" : "Mostrar senha"
                  }
                  onClick={() => setMostrarSenha(!mostrarSenha)}
                  className="absolute inset-y-0 right-0 flex w-12 items-center justify-center text-[#78664F]"
                >
                  {mostrarSenha ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>
              </div>
            </div>

            {modo === "cadastro" && (
              <div>
                <label
                  htmlFor="confirmarSenha"
                  className="mb-2 block text-sm font-medium"
                >
                  Confirmar senha
                </label>

                <div className="relative">
                  <input
                    id="confirmarSenha"
                    type={mostrarConfirmacao ? "text" : "password"}
                    autoComplete="new-password"
                    required
                    minLength={6}
                    value={confirmarSenha}
                    onChange={(e) =>
                      setConfirmarSenha(e.target.value)
                    }
                    placeholder="Digite sua senha novamente"
                    className="min-h-12 w-full rounded-xl border border-[#E7DED0] bg-[#F5F0E7] px-4 pr-12 text-base outline-none focus:border-[#78664F]"
                  />

                  <button
                    type="button"
                    aria-label={
                      mostrarConfirmacao
                        ? "Ocultar confirmação"
                        : "Mostrar confirmação"
                    }
                    onClick={() =>
                      setMostrarConfirmacao(!mostrarConfirmacao)
                    }
                    className="absolute inset-y-0 right-0 flex w-12 items-center justify-center text-[#78664F]"
                  >
                    {mostrarConfirmacao ? (
                      <EyeOff size={20} />
                    ) : (
                      <Eye size={20} />
                    )}
                  </button>
                </div>

                {confirmarSenha.length > 0 && (
                  <p
                    className={`mt-2 text-xs ${
                      senha === confirmarSenha
                        ? "text-green-700"
                        : "text-red-700"
                    }`}
                  >
                    {senha === confirmarSenha
                      ? "✓ As senhas coincidem"
                      : "As senhas não coincidem"}
                  </p>
                )}
              </div>
            )}

            {modo === "login" && (
              <button
                type="button"
                onClick={recuperarSenha}
                disabled={carregando}
                className="block text-sm text-[#78664F] underline disabled:opacity-60"
              >
                Esqueci minha senha
              </button>
            )}

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
            <span className="text-xs text-[#78664F]">
              ou continue com
            </span>
            <div className="h-px flex-1 bg-[#E7DED0]" />
          </div>

          <button
            type="button"
            onClick={entrarComGoogle}
            disabled={carregando}
            className="min-h-12 w-full rounded-xl border border-[#E7DED0] bg-white px-4 font-medium transition hover:bg-[#F5F0E7] disabled:opacity-60"
          >
            <span className="mr-2 font-bold">G</span>
            Continuar com Google
          </button>

          {mensagem && (
            <p
              role="status"
              className={`mt-5 rounded-xl p-3 text-center text-sm leading-6 ${
                erro
                  ? "bg-red-50 text-red-700"
                  : "bg-[#F5F0E7] text-[#78664F]"
              }`}
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
