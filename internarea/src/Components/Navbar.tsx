import React, { useState, useEffect } from "react";
import Link from "next/link";
import { auth, provider } from "../firebase/firebase";
import { Search } from "lucide-react";
import { signInWithPopup, signOut } from "firebase/auth";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { selectuser } from "@/Feature/Userslice";
import { useTranslation } from "react-i18next";
import axios from "axios";
import i18n from "../i18n";

const Navbar = () => {
  const { t } = useTranslation();
  const user = useSelector(selectuser);

  const [showOtp, setShowOtp] = useState(false);
  const [otp, setOtp] = useState("");
  const [pendingLang, setPendingLang] = useState<any>(null);
  const [loginUser, setLoginUser] = useState<any>(null);

  // ✅ FIX: restore language on refresh
  useEffect(() => {
    const savedLang = localStorage.getItem("lang");

    if (savedLang && savedLang !== i18n.language) {
      i18n.changeLanguage(savedLang);
    }
  }, []);

  // ---------------- LOGIN ----------------
  const handlelogin = async () => {
    try {
      const browser = navigator.userAgent;
      const isMobile = /Android|iPhone|iPad|iPod|Mobile/i.test(browser);

      const isChrome =
        browser.includes("Chrome") &&
        !browser.includes("Edg") &&
        !browser.includes("OPR");

      if (isMobile) {
        const hour = new Date().getHours();

        if (hour < 10 || hour >= 13) {
          toast.error("Mobile login allowed only between 10 AM and 1 PM");
          return;
        }
      }

      const result = await signInWithPopup(auth, provider);

      if (isChrome) {
        await fetch("https://internarea-xyno.onrender.com//send-login-otp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: result.user.email }),
        });

        setLoginUser(result.user);
        setShowOtp(true);
        return;
      }

      await axios.post("https://internarea-xyno.onrender.com//login-history", {
        userId: result.user.uid,
        browser: navigator.userAgent,
        os: navigator.platform,
        device: isMobile ? "Mobile" : "Desktop",
        ipAddress: "Pending",
      });

      toast.success("Logged in successfully");
    } catch (error: any) {
  if (error?.code !== "auth/cancelled-popup-request") {
    toast.error(error?.code || "Login failed");
  }
}
};

  const handlelogout = async () => {

    setShowOtp(false);
    setOtp("");
    setPendingLang(null);
    setLoginUser(null);

    await signOut(auth);

};

  // ---------------- LANGUAGE ----------------
const handleLanguageChange = async (lang: string) => {

  // close old popup
  setShowOtp(false);
  setOtp("");
  setPendingLang(null);

  console.log("Selected:", lang);

  if (lang === "fr") {

      if (!user?.email) {
          toast.error("Please login first");
          return;
      }

      setPendingLang(lang);

      await fetch("https://internarea-xyno.onrender.com//send-otp",{
          method:"POST",
          headers:{
              "Content-Type":"application/json"
          },
          body:JSON.stringify({
              email:user.email
          })
      });

      setShowOtp(true);
      return;
  }

  i18n.changeLanguage(lang);
  localStorage.setItem("lang",lang);
};
  return (
    <div className="relative">
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">

            {/* LOGO */}
            <Link href="/">
              <img src={"/logo.png"} alt="logo" className="h-16" />
            </Link>

            {/* LINKS */}
            {/* LINKS */}
<div className="hidden md:flex items-center space-x-6">

  <Link href="/internship">
    {t("internships")}
  </Link>

  <Link href="/job">
    {t("jobs")}
  </Link>


  <Link href="/resume">
    Resume
  </Link>

  <Link href="/subscription">
  Subscription
</Link>



  <div className="flex items-center bg-gray-100 rounded-full px-4 py-2">
    <Search size={16} className="text-gray-400" />
    <input
      placeholder={t("search")}
      className="ml-2 bg-transparent focus:outline-none text-sm w-40"
    />
  </div>

</div>

            {/* RIGHT SIDE */}
            <div className="flex items-center space-x-4">

              {/* LANGUAGE SELECT */}
              <select
                value={i18n.language}
                onChange={(e) => handleLanguageChange(e.target.value)}
                className="border p-1 rounded"
              >
                <option value="en">English</option>
                <option value="hi">Hindi</option>
                <option value="es">Spanish</option>
                <option value="pt">Portuguese</option>
                <option value="zh">Chinese</option>
                <option value="fr">French</option>
              </select>

              {/* USER */}
              {user ? (
                <div className="flex items-center space-x-2">
                  <Link href="/profile">
                    <img
                      src={user.photo}
                      className="w-8 h-8 rounded-full"
                    />
                  </Link>

                  <button onClick={handlelogout}>
                    {t("logout")}
                  </button>
                </div>
              ) : (
                <>
                  <button onClick={handlelogin}>
                    {t("login")}
                  </button>
                  <a href="/adminlogin">Admin</a>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* OTP MODAL */}
      {showOtp && (
        <div className="fixed top-24 right-10 bg-white shadow-lg p-4 rounded-lg z-50">
          <h3 className="font-semibold mb-2">Enter OTP</h3>

          <input
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="border p-2 w-full mb-2"
            placeholder="Enter OTP"
          />

          <button
            className="bg-blue-600 text-white px-4 py-1 rounded"
            onClick={async () => {
              const res = await fetch("https://internarea-xyno.onrender.com//verify-otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  email: user?.email || loginUser?.email,
                  otp,
                }),
              });

              const data = await res.json();

              if (data.success) {

                // LOGIN OTP
                if (loginUser) {
                  await axios.post("https://internarea-xyno.onrender.com//login-history", {
                    userId: loginUser.uid,
                    browser: navigator.userAgent,
                    os: navigator.platform,
                    device: /Android|iPhone|iPad|iPod|Mobile/i.test(
                      navigator.userAgent
                    )
                      ? "Mobile"
                      : "Desktop",
                  });

                  toast.success("Login Successful");
                  setLoginUser(null);
                }

                // LANGUAGE OTP (FR)
                if (pendingLang) {
                  i18n.changeLanguage(pendingLang);
                  localStorage.setItem("lang", pendingLang);

                  console.log("Changed to", pendingLang);
                  setPendingLang(null);
                }

                setShowOtp(false);
                setOtp("");
              } else {
                toast.error("Invalid OTP");
              }
            }}
          >
            Verify
          </button>
        </div>
      )}
    </div>
  );
};

export default Navbar;