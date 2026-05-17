const btn = document.getElementById("contact-btn");
btn.addEventListener("click", async (e) => {
  e.preventDefault();
  document.getElementById("contact-form").style.display = "none";
  document.getElementById("success-message").style.display = "block";
});