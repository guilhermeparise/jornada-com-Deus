
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function AuthCallback() {
  const router = useRouter();
  const [mensagem, setMensagem] = useState("Finalizando seu acesso...");

  useEffect(() => {
    async function finalizarLogin() {
      const url = new URL(window.location.href);
      const code = url.searchParams.get("code");
      const erroGoogle = url.searchParams.get("error_description");

      if (erroGoogle) {
        setMensagem("O Google não autorizou o acesso.");
        console.error("Erro do Google:", erroGoogle);
        return;
      }

      if (!code) {
        setMensagem("Código de autenticação não encontrado.");
        console.error("URL de retorno:", window.location.href);
        return;
      }

      const { error } = await supabase.auth.exchangeCodeForSession(code);

      if (error) {
        setMensagem("Não foi possível concluir o login.");
        console.error("Erro Supabase:", error.message);
        return;
      }

      router.replace("/");
    }

    finalizarLogin();
  }, [router]);

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#F5F0E7] px-6">
      <div className="text-center">
        <h1 className="text-2xl font-serif text-[#302820]">
          Jornada com Deus
        </h1>
        <p className="mt-3 text-[#78664F]">{mensagem}</p>
      </div>
    </main>
  );
}
