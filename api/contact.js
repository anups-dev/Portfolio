import { Resend } from "resend";
const resend = new Resend(process.env.RESEND_API_KEY);
export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { name, email, message } = req.body;

  try {
    await resend.emails.send({
  from: 'onboarding@resend.dev',
  to: 'np.anup123@gmail.com',
      subject: "New Portfolio Message",
      html: `
        <p><b>Name:</b> ${name}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Message:</b> ${message}</p>
      `,
    });

    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ error });
  }
};

