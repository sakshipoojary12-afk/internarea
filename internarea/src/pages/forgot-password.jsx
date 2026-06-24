import React, { useState } from "react";
import { useTranslation } from "react-i18next";

const ForgotPassword = () => {
  const { t } = useTranslation();
  const [value, setValue] = useState("");
  const [message, setMessage] = useState("");

  const handleReset = () => {
  if (!value) {
    setMessage(t("forgot.enterEmailPhone"));
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^[0-9]{10}$/;

  const isEmail = emailRegex.test(value);
  const isPhone = phoneRegex.test(value);

  if (!isEmail && !isPhone) {
    setMessage(t("forgot.validEmailPhone"));
    return;
  }

  const today = new Date().toDateString();
  const lastReset = localStorage.getItem("lastResetDate");

  if (lastReset === today) {
   setMessage(t("forgot.oncePerDay"));
    return;
  }

  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  let newPassword = "";

  for (let i = 0; i < 8; i++) {
    newPassword += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  localStorage.setItem("lastResetDate", today);

  setMessage(`${t("forgot.newPassword")} ${newPassword}`);
};

  return (
    <div style={{ display: "flex", justifyContent: "center", marginTop: "100px" }}>
      <div style={{ padding: "20px", border: "1px solid #ccc", borderRadius: "10px", width: "300px" }}>

        <h2>{t("forgot.title")}</h2>

        <input
          type="text"
          placeholder={t("forgot.placeholder")}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          style={{ width: "100%", padding: "8px", marginTop: "10px" }}
        />

        <button
          onClick={handleReset}
          style={{
            width: "100%",
            marginTop: "10px",
            padding: "8px",
            backgroundColor: "blue",
            color: "white",
          }}
        >
          {t("forgot.resetPassword")}
        </button>
        {message && (
  <p style={{ marginTop: "10px", color: "green" }}>
    {message}
  </p>
)}

      </div>
    </div>
  );
};

export default ForgotPassword;