import { Resend } from "resend";

const resend = new Resend("re_S8qJC5gu_JSEwc7x8vbbvjWSsqVzKfeDm");
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
}
const btn = document.getElementById("contact-btn");
btn.addEventListener("click", async (e) => {
  e.preventDefault();
  document.getElementById("contact-form").style.display = "none";
  document.getElementById("success-message").style.display = "block";
});
