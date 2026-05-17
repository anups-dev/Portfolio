const form = document.getElementById("contact-form");

form.addEventListener("submit", async (e) => {
  e.preventDefault(); // stop page reload

  const formData = new FormData(form);

  const data = {
    name: formData.get("name"),
    email: formData.get("email"),
    message: formData.get("message"),
  };

  try {
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      form.style.display = "none";
      document.getElementById("success-message").style.display = "block";
    } else {
      alert("Failed to send message");
    }

  } catch (err) {
    alert("Error sending message");
  }
});