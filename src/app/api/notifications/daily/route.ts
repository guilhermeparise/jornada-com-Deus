
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { sendNotification, setVapidDetails } from "web-push";
import { isValidPushEndpoint } from "@/lib/push-endpoint";



type PushRow = {
  user_id: string;
  endpoint: string;
  subscription: Parameters<typeof sendNotification>[0];
  notification_time: string;
  timezone: string;
  last_notification_date: string | null;
};

type DailyMessage = {
  id: string;
  content: string;
  category: string;
};

function getLocalClock(timezone: string, now: Date) {
  try {
    const parts = new Intl.DateTimeFormat("en-GB", {
      timeZone: timezone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
    }).formatToParts(now);

    const values = Object.fromEntries(
      parts.map((part) => [part.type, part.value])
    );

    return {
      date: `${values.year}-${values.month}-${values.day}`,
      time: `${values.hour}:${values.minute}`,
    };
  } catch {
    return null;
  }
}

// Escolhe uma mensagem por usuário e por dia.
// A escolha é estável durante o mesmo dia.
function chooseMessage(
  messages: DailyMessage[],
  userId: string,
  date: string
) {
  const input = `${userId}:${date}`;
  let hash = 2166136261;

  for (let i = 0; i < input.length; i++) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }

  const index = (hash >>> 0) % messages.length;
  return messages[index];
}

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;

  if (
    !secret ||
    request.headers.get("authorization") !== `Bearer ${secret}`
  ) {
    return NextResponse.json(
      { error: "Não autorizado." },
      { status: 401 }
    );
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY;
  const vapidSubject = process.env.VAPID_SUBJECT;

  if (
    !supabaseUrl ||
    !serviceRoleKey ||
    !vapidPublicKey ||
    !vapidPrivateKey ||
    !vapidSubject
  ) {
    return NextResponse.json(
      { error: "Configuração do envio diário incompleta." },
      { status: 503 }
    );
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });

  const { data: messages, error: messagesError } = await supabase
    .from("fixed_messages")
    .select("id, content, category")
    .eq("active", true)
    .order("id", { ascending: true });

  if (messagesError || !messages?.length) {
    console.error("Erro ao carregar mensagens:", messagesError);

    return NextResponse.json(
      { error: "Nenhuma mensagem ativa disponível." },
      { status: 503 }
    );
  }

  const { data: subscriptions, error: subscriptionsError } =
    await supabase
      .from("push_subscriptions")
      .select(
        "user_id, endpoint, subscription, notification_time, timezone, last_notification_date"
      );

  if (subscriptionsError) {
    console.error("Erro ao carregar dispositivos:", subscriptionsError);

    return NextResponse.json(
      { error: "Falha ao carregar dispositivos." },
      { status: 500 }
    );
  }

  setVapidDetails(vapidSubject, vapidPublicKey, vapidPrivateKey);

  const now = new Date();
  let sent = 0;
  let skipped = 0;
  let failed = 0;

  for (const row of (subscriptions || []) as PushRow[]) {
    const localClock = getLocalClock(
      row.timezone || "America/Sao_Paulo",
      now
    );

    const scheduledTime = String(
      row.notification_time || "08:00"
    ).slice(0, 5);

    if (
      !localClock ||
      localClock.time !== scheduledTime ||
      row.last_notification_date === localClock.date ||
      !isValidPushEndpoint(row.endpoint)
    ) {
      skipped++;
      continue;
    }

    const message = chooseMessage(
      messages as DailyMessage[],
      row.user_id,
      localClock.date
    );

    try {
      await sendNotification(
        row.subscription,
        JSON.stringify({
          title: "Jornada com Deus",
          body: message.content,
          url: "/",
          tag: "jornada-mensagem-diaria",
        })
      );

      const { error: updateError } = await supabase
        .from("push_subscriptions")
        .update({
          last_notification_date: localClock.date,
        })
        .eq("endpoint", row.endpoint);

      if (updateError) {
        console.error(
          "Notificação enviada, mas data não registrada:",
          updateError
        );
        failed++;
      } else {
        sent++;
      }
    } catch (error) {
      const status =
        typeof error === "object" &&
        error !== null &&
        "statusCode" in error
          ? error.statusCode
          : undefined;

      if (status === 404 || status === 410) {
        await supabase
          .from("push_subscriptions")
          .delete()
          .eq("endpoint", row.endpoint);
      } else {
        console.error("Erro ao enviar notificação:", error);
      }

      failed++;
    }
  }

  return NextResponse.json({
    success: true,
    sent,
    skipped,
    failed,
  });
}
