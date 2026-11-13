import { notifyEmail } from "@/lib/site";

type Notice = {
  title: string;
  company: string;
  city: string;
  country: string;
  posterEmail: string;
};

export async function notifyNewJob(notice: Notice) {
  const to = notifyEmail();
  const key = process.env.RESEND_API_KEY?.trim();
  const from = process.env.NOTIFY_FROM_EMAIL?.trim();
  if (!key || !from) {
    console.info(
      `Job notification skipped for ${to}. Set RESEND_API_KEY and NOTIFY_FROM_EMAIL to send email.`,
    );
    return;
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: notice.posterEmail,
        subject: `New job pending: ${notice.title} at ${notice.company}`,
        text: [
          "A vacancy is waiting for approval in Supabase.",
          "",
          `Title: ${notice.title}`,
          `Company: ${notice.company}`,
          `Where: ${notice.city}, ${notice.country}`,
          `Poster: ${notice.posterEmail}`,
          "",
          "Set status to approved in the jobs table when it should go live.",
        ].join("\n"),
      }),
    });
    if (!response.ok) {
      console.error("Job notification failed", response.status);
    }
  } catch (error) {
    console.error("Job notification failed", error);
  }
}
