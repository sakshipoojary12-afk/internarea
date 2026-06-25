"use client";

import { useState } from "react";
import axios from "axios";
import Script from "next/script";
import { useTranslation } from "react-i18next";

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function ResumePage() {
  const { t } = useTranslation();
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1);

  const [form, setForm] = useState({
    name: "",
    email: "",
    qualification: "",
    experience: "",
    phone: "",
    location: "",
    linkedin: "",
    summary: ""
});

  // ================= OTP =================
  const sendOtp = async () => {
    try {
      await axios.post("https://internarea-xyno.onrender.com//send-login-otp", {
        email: form.email
      });

      alert(t("resume.otpSent"));
      setStep(2);
    } catch (err) {
      alert(t("resume.otpFailed"));
    }
  };

  const verifyOtp = async () => {
    try {
      const res = await axios.post("https://internarea-xyno.onrender.com/verify-otp", {
        email: form.email,
        otp
      });

      if (res.data.success) {
        alert(t("resume.otpVerified"));
        setStep(3);
      } else {
        alert(t("resume.wrongOtp"));
      }
    } catch (err) {
      console.log(err);
    }
  };

  // ================= RESUME =================
  const generateResume = async () => {
    try {
      const res = await axios.post("https://internarea-xyno.onrender.com//resume/generate", {
        name: form.name,
        email: form.email,
        qualification: form.qualification,
        experience: form.experience
      });

      if (res.data.success) {
        alert(t("resume.resumeGenerated"));
        console.log(res.data.resume);
      }
    } catch (err) {
      alert(t("resume.resumeFailed"));
    }
  };

  // ================= PAYMENT =================
const payNow = async () => {
  try {
    const { data } = await axios.post(
      "https://internarea-xyno.onrender.com//api/payment/create-order",
      { amount: 50 }
    );

    const options = {
      key: "rzp_test_T523Li4flKnPpB",

      amount: data.amount,
      currency: data.currency,
      order_id: data.id,

      name: "Resume Builder",
      description: "Resume Generation",

      prefill: {
        name: "Test User",
        email: "test@razorpay.com",
        contact: "9999999999",
      },

      notes: {
        purpose: "resume",
      },

      handler: async function (response: any) {
        console.log("SUCCESS", response);

        alert(t("resume.paymentSuccess"));

        await generateResume();

        setStep(4);
      },

      modal: {
        ondismiss: function () {
          console.log("Payment popup closed");
        },
      },

      theme: {
        color: "#3399cc",
      },
    };

    console.log(options);
    console.log("ORDER DATA", data);

    const razor = new window.Razorpay(options);

    razor.on("payment.failed", function (response: any) {
      console.log("Payment Failed:", response.error);

      alert(t("resume.paymentFailed"));
    });

    razor.open();
  } catch (err) {
    console.log(err);

    alert(t("resume.paymentFailed"));
  }
};
  return (
    <>
      <Script
 src="https://checkout.razorpay.com/v1/checkout.js"
 strategy="beforeInteractive"
/>

      <div
  style={{
    maxWidth: "1100px",
    margin: "40px auto",
    padding: "20px",
  }}
>

<h1
style={{
fontSize:"32px",
fontWeight:"700"
}}
>
{t("resume.title")}</h1>

<p style={{color:"#666"}}>
{t("resume.premiumFeature")}</p>

<div
style={{
display:"flex",
justifyContent:"space-evenly",
alignItems:"center",
marginTop:"30px",
marginBottom:"40px",
gap:"50px"
}}
>

<div style={{textAlign:"center"}}>
<div style={{
width:"40px",
height:"40px",
borderRadius:"50%",
background: step >= 1 ? "#2563eb" : "#ddd",
color: step >= 1 ? "white" : "black",
display:"flex",
alignItems:"center",
justifyContent:"center",
margin:"auto"
}}>
1
</div>
<p
style={{
marginTop:"8px",
minWidth:"70px",
textAlign:"center"
}}
>
{t("resume.details")}
</p>
</div>

<div style={{textAlign:"center"}}>
<div style={{
width:"40px",
height:"40px",
borderRadius:"50%",
background: step >= 2 ? "#2563eb" : "#ddd",
color: step >= 2 ? "white" : "black",display:"flex",
alignItems:"center",
justifyContent:"center",
margin:"auto"
}}>
2
</div>
<p
style={{
marginTop:"8px",
minWidth:"70px",
textAlign:"center"
}}
>
{t("resume.verify")}
</p>
</div>


<div style={{textAlign:"center"}}>
<div style={{
width:"40px",
height:"40px",
borderRadius:"50%",
background: step >= 3 ? "#2563eb" : "#ddd",
color: step >= 3 ? "white" : "black",display:"flex",
alignItems:"center",
justifyContent:"center",
margin:"auto"
}}>
3
</div>
<p
style={{
marginTop:"8px",
minWidth:"70px",
textAlign:"center"
}}
>
{t("resume.payment")}
</p></div>


<div style={{textAlign:"center"}}>
<div style={{
width:"40px",
height:"40px",
borderRadius:"50%",
background: step >= 4 ? "#2563eb" : "#ddd",
color: step >= 4 ? "white" : "black",display:"flex",
alignItems:"center",
justifyContent:"center",
margin:"auto"
}}>
4
</div>
<p
style={{
marginTop:"8px",
minWidth:"70px",
textAlign:"center"
}}
>
{t("resume.resume")}
</p>
</div>

</div>
{/* ↑ stepper closes here — the </div> that was here before was the bug */}


      {step === 1 && (

<div
style={{
marginTop:"30px",
background:"#fff",
padding:"25px",
borderRadius:"12px",
boxShadow:"0 2px 8px rgba(0,0,0,0.1)"
}}
>

<h2>{t("resume.personalInformation")}</h2>

<p style={{color:"#666"}}>
{t("resume.detailsAppear")}</p>


<h3>{t("resume.fullName")} *</h3>

<input
style={{width:"100%",padding:"12px",marginBottom:"15px"}}
placeholder="Full name"
onChange={(e)=>setForm({...form,name:e.target.value})}
/>

<h3>{t("resume.email")} *</h3>


<input
style={{width:"100%",padding:"12px",marginBottom:"15px"}}
placeholder="xyz@gmail.com"
onChange={(e)=>setForm({...form,email:e.target.value})}
/>

<h3>{t("resume.phone")}  *</h3>

<input
  style={{
    width: "100%",
    padding: "12px",
    marginBottom: "15px",
  }}
  placeholder="+91 9876543210"
  onChange={(e) =>
    setForm({
      ...form,
      phone: e.target.value,
    })
  }
/>

<h3>{t("resume.location")}</h3>

<input
  style={{
    width: "100%",
    padding: "12px",
    marginBottom: "15px",
  }}
  placeholder="Mumbai, India"
  onChange={(e) =>
    setForm({
      ...form,
      location: e.target.value,
    })
  }
/>
<h3>{t("resume.linkedin")}</h3>

<input
  style={{
    width: "100%",
    padding: "12px",
    marginBottom: "15px",
  }}
  placeholder="https://linkedin.com/in/username"
  onChange={(e) =>
    setForm({
      ...form,
      linkedin: e.target.value,
    })
  }
/>



<h3>{t("resume.qualification")} *</h3>

<input
style={{width:"100%",padding:"12px",marginBottom:"15px"}}
placeholder="B.Tech CSE"
onChange={(e)=>setForm({...form,qualification:e.target.value})}
/>


<h3>{t("resume.summary")}</h3>

<textarea
  style={{
    width: "100%",
    padding: "12px",
    height: "120px",
    marginBottom: "20px",
  }}
  placeholder="Passionate computer science student..."
  onChange={(e) =>
    setForm({
      ...form,
      summary: e.target.value,
    })
  }
/>

<h3>{t("resume.experience")} *</h3>

<textarea
style={{
width:"100%",
padding:"12px",
height:"120px",
marginBottom:"20px"
}}

placeholder="Frontend Intern at XYZ..."
onChange={(e)=>setForm({...form,experience:e.target.value})}
/>



<button
style={{
background:"#2563eb",
color:"white",
padding:"12px 25px",
border:"none",
borderRadius:"6px",
cursor:"pointer"
}}
onClick={sendOtp}
>

{t("resume.continueVerification")}
</button>


<br/>




</div>

)}

        {step === 2 && (

<div
style={{
marginTop:"30px",
background:"white",
padding:"25px",
borderRadius:"12px",
boxShadow:"0 2px 8px rgba(0,0,0,0.1)"
}}
>

<h2>{t("resume.emailVerification")}</h2>

<p style={{color:"#666"}}>
{t("resume.enterOtp")}</p>

<input

style={{
width:"100%",
padding:"12px",
marginTop:"15px",
marginBottom:"20px"
}}

placeholder="Enter OTP"

onChange={(e)=>setOtp(e.target.value)}
/>


<button

style={{
background:"#2563eb",
color:"white",
padding:"12px 25px",
border:"none",
borderRadius:"6px",
cursor:"pointer"
}}

onClick={verifyOtp}
>

{t("resume.verifyOtp")}

</button>

</div>

)}

        {step === 3 && (

<div
style={{
marginTop:"30px",
background:"white",
padding:"25px",
borderRadius:"12px",
boxShadow:"0 2px 8px rgba(0,0,0,0.1)"
}}
>

<h3>{t("resume.payment")} </h3>

<p style={{color:"#666"}}>
{t("resume.paymentMessage")}</p>


<div
style={{
marginTop:"20px",
padding:"15px",
background:"#f8fafc",
borderRadius:"8px"
}}
>

<h3>{t("resume.premiumPlan")} </h3>

<p>{t("resume.price")}</p>

<p>{t("resume.includes")}</p>

<ul>
<li>{t("resume.professionalResume")}</li>
<li>{t("resume.autoAttach")}</li>
<li>{t("resume.unlimitedDownloads")} </li>
</ul>

</div>


<button

style={{
marginTop:"20px",
background:"#2563eb",
color:"white",
padding:"12px 25px",
border:"none",
borderRadius:"6px",
cursor:"pointer"
}}

onClick={payNow}
>

{t("resume.pay")}
</button>

</div>

)}

        {step === 4 && (

<div
style={{
marginTop:"30px",
background:"white",
padding:"25px",
borderRadius:"12px",
boxShadow:"0 2px 8px rgba(0,0,0,0.1)",
textAlign:"center"
}}
>

<h2>🎉 {t("resume.resumegenerated")}</h2>

<p style={{color:"#666",marginTop:"10px"}}>
{t("resume.generatedMessage")}</p>

</div>

)}

      </div>
    </>
  );
}