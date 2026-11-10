
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { isValidPushEndpoint } from "@/lib/push-endpoint";

export async function POST(request: Request) {
  try {
    const authorization = request.headers.get("authorization");
    const token = authorization?.startsWith("Bearer ")
      ? authorization.slice(7)
      : null;

    if (!token) {
      return NextResponse.json(
        { error: "Token de autenticação não informado." },
        { status: 401 }
      );
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        global: {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        },
      }
    );

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return NextResponse.json(
        { error: "Sessão inválida ou expirada." },
        { status: 401 }
      );
    }

    const body = await request.json();
    const subscription = body?.subscription;

    if (!subscription || typeof subscription !== "object") {
      return NextResponse.json(
        { error: "Inscrição de notificação inválida." },
        { status: 400 }
      );
    }

    if (!isValidPushEndpoint(subscription.endpoint)) {
      let providerHost = "desconhecido";
      if (typeof subscription.endpoint === "string") {
        try {
          providerHost = new URL(subscription.endpoint).hostname || providerHost;
        } catch {
          // A URL inválida mantém a mensagem genérica.
        }
      }
      console.warn("Provedor push não habilitado:", providerHost);
      return NextResponse.json(
        { error: `O provedor push deste navegador ainda não está habilitado (${providerHost}).` },
        { status: 400 }
      );
    }

    if (
      typeof subscription.keys?.p256dh !== "string" ||
      typeof subscription.keys?.auth !== "string"
    ) {
      return NextResponse.json(
        { error: "Inscrição de notificação inválida." },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from("push_subscriptions")
      .upsert(
        {
          user_id: user.id,
          endpoint: subscription.endpoint,
          subscription,
        },
        { onConflict: "endpoint" }
      );

    if (error) {
      console.error("Erro ao salvar inscrição:", error);
      return NextResponse.json(
        { error: "Não foi possível salvar a inscrição." },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erro na rota de inscrição:", error);
    return NextResponse.json(
      { error: "Erro interno ao registrar dispositivo." },
      { status: 500 }
    );
  }
}
