
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, "+")
    .replace(/_/g, "/");

  const rawData = window.atob(base64);
  const output = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; i++) {
    output[i] = rawData.charCodeAt(i);
  }

  return output;
}

export default function NotificacoesPage() {
  const [loading, setLoading] = useState(false);
  const [sendingTest, setSendingTest] = useState(false);
  const [subscription, setSubscription] = useState<PushSubscription | null>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    let active = true;

    async function loadSubscription() {
      if (
        !("serviceWorker" in navigator) ||
        !("Notification" in window) ||
        Notification.permission !== "granted"
      ) {
        return;
      }

      const registration = await navigator.serviceWorker.getRegistration("/");
      const currentSubscription = await registration?.pushManager.getSubscription();
      if (active) setSubscription(currentSubscription ?? null);
    }

    loadSubscription().catch(() => {
      if (active) setSubscription(null);
    });

    return () => {
      active = false;
    };
  }, []);

  async function ativarNotificacoes() {
    setLoading(true);
    setMessage("");

    try {
      if (
        !("serviceWorker" in navigator) ||
        !("PushManager" in window) ||
        !("Notification" in window)
      ) {
        throw new Error(
          "Este navegador não oferece suporte a notificações push."
        );
      }

      const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;

      if (!publicKey) {
        throw new Error("Chave pública VAPID não encontrada.");
      }

      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError || !session?.access_token) {
        throw new Error("Faça login novamente para ativar as notificações.");
      }

      const permission = await Notification.requestPermission();

      if (permission !== "granted") {
        throw new Error("Você não autorizou o envio de notificações.");
      }

      // Registra o Service Worker
      await navigator.serviceWorker.register("/sw.js");

      // Aguarda até existir um Service Worker ativo
      const registration = await navigator.serviceWorker.ready;

      if (!registration.active) {
        throw new Error("O Service Worker ainda não está ativo.");
      }

      // Verifica se já existe uma inscrição
      let subscription = await registration.pushManager.getSubscription();
      const applicationServerKey = urlBase64ToUint8Array(publicKey);

      if (subscription) {
        const savedKey = subscription.options.applicationServerKey;
        const currentKey = savedKey ? new Uint8Array(savedKey) : null;
        const sameApplicationServerKey =
          currentKey?.length === applicationServerKey.length &&
          currentKey.every((byte, index) => byte === applicationServerKey[index]);

        if (!sameApplicationServerKey) {
          await subscription.unsubscribe();
          subscription = null;
        }
      }

      // Cria uma nova inscrição, se necessário
      if (!subscription) {
        subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: applicationServerKey as BufferSource,
        });
      }

      // Envia a inscrição para nossa API
      const response = await fetch("/api/notifications/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          subscription: subscription.toJSON(),
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.error || "Não foi possível registrar o dispositivo."
        );
      }

      setMessage(
        "Notificações ativadas e dispositivo registrado com sucesso!"
      );
      setSubscription(subscription);
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Ocorreu um erro ao ativar as notificações."
      );
    } finally {
      setLoading(false);
    }
  }

  async function enviarNotificacaoDeTeste() {
    if (!subscription) return;

    setSendingTest(true);
    setMessage("");

    try {
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError || !session?.access_token) {
        throw new Error("Faça login novamente para enviar o teste.");
      }

      const response = await fetch("/api/notifications/test", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ endpoint: subscription.endpoint }),
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Não foi possível enviar o teste.");
      }

      setMessage("Notificação enviada. Confira este dispositivo.");
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Ocorreu um erro ao enviar a notificação de teste."
      );
    } finally {
      setSendingTest(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#F5F0E7] px-5 py-12 text-[#302820]">
      <div className="mx-auto max-w-md">
        <Link href="/" className="text-sm text-[#78664F]">
          ← Voltar ao início
        </Link>

        <div className="mt-16 rounded-3xl bg-white p-7 shadow-sm">
          <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#E7DED0] text-2xl">
            ♡
          </div>

          <p className="text-sm uppercase tracking-[0.2em] text-[#78664F]">
            Jornada com Deus
          </p>

          <h1 className="mt-3 font-serif text-3xl">
            Uma mensagem para fortalecer seu dia.
          </h1>

          <p className="mt-4 text-sm leading-7 text-[#6F655A]">
            Ative as notificações para receber mensagens de fé e reflexões
            no seu dispositivo.
          </p>

          <button
            onClick={ativarNotificacoes}
            disabled={loading}
            className="mt-8 min-h-12 w-full rounded-full bg-[#78664F] px-6 py-3 font-medium text-white transition hover:opacity-90 disabled:opacity-60"
          >
            {loading ? "Ativando..." : subscription ? "Atualizar inscrição" : "Ativar notificações"}
          </button>

          {subscription && (
            <button
              onClick={enviarNotificacaoDeTeste}
              disabled={sendingTest}
              className="mt-3 min-h-12 w-full rounded-full border border-[#78664F] px-6 py-3 font-medium text-[#78664F] transition hover:bg-[#F5F0E7] disabled:opacity-60"
            >
              {sendingTest ? "Enviando..." : "Enviar notificação de teste"}
            </button>
          )}

          {message && (
            <p
              role="status"
              className="mt-5 rounded-xl bg-[#F5F0E7] p-4 text-sm leading-6"
            >
              {message}
            </p>
          )}
        </div>
      </div>
    </main>
  );
}
