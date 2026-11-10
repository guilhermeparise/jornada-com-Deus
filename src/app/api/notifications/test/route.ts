import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { sendNotification, setVapidDetails } from "web-push";
import { isValidPushEndpoint } from "@/lib/push-endpoint";

export async function POST(request: Request) {
  const authorization = request.headers.get("authorization");
  const token = authorization?.startsWith("Bearer ")
    ? authorization.slice(7)
    : null;

  if (!token) {
    return NextResponse.json(
      { error: "Entre na sua conta para enviar uma notificação de teste." },
      { status: 401 }
    );
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY;
  const vapidSubject = process.env.VAPID_SUBJECT;

  if (
    !supabaseUrl ||
    !supabaseAnonKey ||
    !vapidPublicKey ||
    !vapidPrivateKey ||
    !vapidSubject
  ) {
    return NextResponse.json(
      { error: "A configuração de notificações no servidor está incompleta." },
      { status: 503 }
    );
  }

  try {
    const body: unknown = await request.json();
    const endpoint =
      typeof body === "object" && body !== null && "endpoint" in body
        ? body.endpoint
        : null;

    if (!isValidPushEndpoint(endpoint)) {
      return NextResponse.json(
        { error: "Inscrição de notificação inválida." },
        { status: 400 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: `Bearer ${token}` } },
      auth: { persistSession: false, autoRefreshToken: false },
    });

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

    const { data, error: subscriptionError } = await supabase
      .from("push_subscriptions")
      .select("subscription")
      .eq("user_id", user.id)
      .eq("endpoint", endpoint)
      .maybeSingle();

    if (subscriptionError) {
      console.error("Erro ao buscar inscrição push:", subscriptionError);
      return NextResponse.json(
        { error: "Não foi possível verificar sua inscrição." },
        { status: 500 }
      );
    }

    if (!data?.subscription) {
      return NextResponse.json(
        { error: "Este dispositivo ainda não está registrado. Ative as notificações novamente." },
        { status: 404 }
      );
    }

    setVapidDetails(vapidSubject, vapidPublicKey, vapidPrivateKey);
    try {
      await sendNotification(
        data.subscription,
        JSON.stringify({
          title: "Jornada com Deus",
          body: "Tudo certo! Este dispositivo está pronto para receber suas mensagens de fé.",
          url: "/",
        })
      );
    } catch (pushError) {
      const pushStatus =
        typeof pushError === "object" && pushError !== null && "statusCode" in pushError
          ? pushError.statusCode
          : undefined;

      if (pushStatus === 404 || pushStatus === 410) {
        await supabase
          .from("push_subscriptions")
          .delete()
          .eq("user_id", user.id)
          .eq("endpoint", endpoint);
      }

      throw pushError;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    const statusCode =
      typeof error === "object" && error !== null && "statusCode" in error
        ? error.statusCode
        : undefined;

    if (statusCode === 404 || statusCode === 410) {
      return NextResponse.json(
        { error: "A inscrição deste dispositivo expirou. Ative as notificações novamente." },
        { status: 410 }
      );
    }

    console.error("Erro ao enviar notificação de teste:", error);
    return NextResponse.json(
      { error: "Não foi possível enviar a notificação. Confira a configuração VAPID e tente novamente." },
      { status: 500 }
    );
  }
}
