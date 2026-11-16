
"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function AuthCallback() {
  const [mensagem, setMensagem] = useState(
    "Finalizando seu acesso..."
  );

  useEffect(() => {
    let ativo = true;

    async function finalizarLogin() {
      try {
        const url = new URL(window.location.href);
        const code = url.searchParams.get("code");
        const erroGoogle = url.searchParams.get("error_description");

        if (erroGoogle) {
          throw new Error(
            "O Google não autorizou o acesso."
          );
        }

        // Se já existir sessão, não precisamos trocar o código.
        const { data: sessaoAtual } =
          await supabase.auth.getSession();

        if (!sessaoAtual.session) {
          if (!code) {
            throw new Error(
              "Código de autenticação não encontrado."
            );
          }

          const { error } =
            await supabase.auth.exchangeCodeForSession(code);

          if (error) throw error;
        }

        // Confirma se a sessão realmente ficou disponível.
        const { data: sessaoFinal, error: erroSessao } =
          await supabase.auth.getSession();

        if (erroSessao || !sessaoFinal.session) {
          throw new Error(
            "A sessão não foi estabelecida."
          );
        }

        // Confirma o usuário autenticado.
        const { data: usuario, error: erroUsuario } =
          await supabase.auth.getUser();

        if (erroUsuario || !usuario.user) {
          throw new Error(
            "Não foi possível confirmar sua conta."
          );
        }

        if (!ativo) return;

        // Navegação completa para atualizar o estado do app.
        window.location.replace("/");
      } catch (error) {
        if (!ativo) return;

        console.error("Erro no callback:", error);

        setMensagem(
          "Não foi possível finalizar seu acesso. " +
          "Volte ao login e tente novamente."
        );
      }
    }

    finalizarLogin();

    return () => {
      ativo = false;
    };
  }, []);

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F5F0E7] px-6">
      <div className="text-center">
        <h1 className="text-2xl font-serif text-[#302820]">
          Jornada com Deus
        </h1>

        <p className="mt-3 text-[#78664F]">
          {mensagem}
        </p>
      </div>
    </main>
  );
}
