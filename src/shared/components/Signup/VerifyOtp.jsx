import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { apisendotp } from "../../services/apiauthentication/apiregister";
import toast from "react-hot-toast";


export default function VerifyOtp() {
  const [OTP, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const email = new URLSearchParams(location.search).get("email"); 
  const [focusedField, setFocusedField] = useState("");

  const handleOtpChange = (e) => {
    setOtp(e.target.value);
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await apisendotp({ Email: email, OTP });
      console.log(response);
      if (response.message === "OTP verified successfully") {
        toast.success("OTP Verified. Registration Complete!");
        navigate("/login"); 
      } else {
        toast.error(response.message); 
      }
    } catch (error) {
      console.log("Error verifying OTP:", error);
    }
    setLoading(false);
  };

  return (
    <>

    <div className="min-h-screen bg-white flex items-center justify-center relative overflow-hidden">
        
            <section className="relative z-10 w-full max-w-md mx-auto px-6">
                <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_#000000] p-8">
                    <div className="text-center mb-8">
                        <div className="inline-block bg-black text-white px-6 py-2 mb-4 transform -rotate-1">
                            <h1 className="text-2xl font-bold tracking-wider">VERIFY OTP</h1>
                        </div>
                        <p className="text-lg">Welcome to{" "}
                            <span className="font-black text-xl bg-black text-white px-2 py-1 inline-block transform rotate-1 font-handelgothic">
                                EXTREME CULTURE
                            </span>
                        </p>
                    </div>
                    <form onSubmit={handleOtpSubmit}>
                        <div className="space-y-6">
                            <div className="relative">
                                <input type="text" name="otp" onChange={handleOtpChange} onFocus={() => setFocusedField("otp")} onBlur={() => setFocusedField("")}
                                    className={`w-full px-4 py-4 border-3 border-black bg-white text-black placeholder-gray-500 font-mono text-sm transition-all duration-200 ${
                                        focusedField === "otp" ? "shadow-[4px_4px_0px_0px_#000000] transform -translate-x-1 -translate-y-1" : "shadow-[2px_2px_0px_0px_#000000]"}`}
                                    placeholder="ENTER THE OTP" required
                                />
                            
                            </div>

                            <button type="submit" className="w-full bg-black text-white py-4 font-bold text-lg tracking-widest border-3 border-black hover:bg-white hover:text-black transition-all duration-200 shadow-[4px_4px_0px_0px_#000000] hover:shadow-[6px_6px_0px_0px_#000000] hover:transform hover:-translate-x-1 hover:-translate-y-1">
                                {loading ? "Verifying..." : "Verify OTP"}
                            </button>
                        </div>
                    </form>

                    <div className="flex justify-between mt-8 opacity-30">
                        <div className="w-3 h-3 bg-black"></div>
                        <div className="w-3 h-3 border border-black"></div>
                        <div className="w-3 h-3 bg-black transform rotate-45"></div>
                        <div className="w-3 h-3 border border-black transform rotate-45"></div>
                        <div className="w-3 h-3 bg-black"></div>
                    </div>
                </div>

            </section>
        </div>
        </>
  );
}
