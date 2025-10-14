import { useState } from "react";
import { apiSignUp } from "../../services/apiauthentication/apiregister";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";

export default function Signup () {

    const [focusedField, setFocusedField] = useState("");

    const [formData, setFormData] = useState({});
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
  
    const handlechange = (e) => {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value
      });
    };
  
    const handleSignUp = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await apiSignUp(formData);
            if (response.message === "Successfully signedup. OTP sent to your email.") {
                toast.success(response.message);
                navigate(`/verify-otp?email=${formData.Email}`);
            } else {
                toast.error(response.message);
            }
        } catch (error) {
            if (error.response && error.response.data) {
                toast.error(error.response.data.message);
            } else {
                toast.error("An error occurred during registration. Please try again.");
            }
        }
        setLoading(false);
    };

    return (
        <>
       <div className="min-h-screen bg-white flex items-center justify-center relative overflow-hidden">
        
            <section className="relative z-10 w-full max-w-xl mx-auto px-6">
                <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_#000000] p-8">
                    <div className="text-center mb-8">
                        <div className="inline-block bg-black text-white px-6 py-2 mb-4 transform -rotate-1">
                            <h1 className="text-2xl font-bold tracking-wider">Sign Up</h1>
                        </div>
                        <p className="text-lg">
                            Welcome to{" "}
                            <span className="font-black text-xl bg-black text-white px-2 py-1 inline-block transform rotate-1 font-handelgothic">
                                EXTREME CULTURE
                            </span>
                        </p>
                    </div>
                    <form onSubmit={handleSignUp}>
                        <div className="space-y-6 grid grid-cols-1 lg:grid-cols-2 gap-5">
                            <div className="relative">
                                <input type="text" name="First_Name" id="First_Name" onChange={handlechange} onFocus={() => setFocusedField("firstname")} onBlur={() => setFocusedField("")}
                                    className={`w-full px-4 py-4 border-3 border-black bg-white text-black placeholder-gray-500 font-mono text-sm transition-all duration-200 ${
                                        focusedField === "firstname" ? "shadow-[4px_4px_0px_0px_#000000] transform -translate-x-1 -translate-y-1" : "shadow-[2px_2px_0px_0px_#000000]" }`}
                                    placeholder="ENTER YOUR FIRST NAME"
                                />
                            </div>
                            <div className="relative">
                                <input type="text" name="Last_Name" id="Last_Name" onChange={handlechange} onFocus={() => setFocusedField("lastname")} onBlur={() => setFocusedField("")}
                                    className={`w-full px-4 py-4 border-3 border-black bg-white text-black placeholder-gray-500 font-mono text-sm transition-all duration-200 ${
                                        focusedField === "lastname" ? "shadow-[4px_4px_0px_0px_#000000] transform -translate-x-1 -translate-y-1" : "shadow-[2px_2px_0px_0px_#000000]" }`}
                                    placeholder="ENTER YOUR LAST NAME"
                                />
                            </div>
                            <div className="relative">
                                <input type="text" name="Email" id="Email" onChange={handlechange} onFocus={() => setFocusedField("email")} onBlur={() => setFocusedField("")}
                                    className={`w-full px-4 py-4 border-3 border-black bg-white text-black placeholder-gray-500 font-mono text-sm transition-all duration-200 ${
                                        focusedField === "email" ? "shadow-[4px_4px_0px_0px_#000000] transform -translate-x-1 -translate-y-1" : "shadow-[2px_2px_0px_0px_#000000]" }`}
                                    placeholder="ENTER YOUR EMAIL"
                                />
                            </div>

                            <div className="relative">
                                <input type="password" name="Password" id="Password" onChange={handlechange} onFocus={() => setFocusedField("password")} onBlur={() => setFocusedField("")}
                                    className={`w-full px-4 py-4 border-3 border-black bg-white text-black placeholder-gray-500 font-mono text-sm transition-all duration-200 ${
                                        focusedField === "password" ? "shadow-[4px_4px_0px_0px_#000000] transform -translate-x-1 -translate-y-1" : "shadow-[2px_2px_0px_0px_#000000]" }`}
                                    placeholder="SET PASSWORD"
                                />
                            </div>

                            <div className="relative">
                                <input type="text" name="Mobilenumber" id="Mobilenumber" onChange={handlechange} onFocus={() => setFocusedField("mobilenumber")} onBlur={() => setFocusedField("")}
                                    className={`w-full px-4 py-4 border-3 border-black bg-white text-black placeholder-gray-500 font-mono text-sm transition-all duration-200 ${
                                        focusedField === "mobilenumber" ? "shadow-[4px_4px_0px_0px_#000000] transform -translate-x-1 -translate-y-1" : "shadow-[2px_2px_0px_0px_#000000]" }`}
                                    placeholder="ENTER YOUR MOBILE NUMBER"
                                />
                            </div>

                            <div className="relative">
                                <input type="text" name="Address" id="Address" onChange={handlechange} onFocus={() => setFocusedField("address")} onBlur={() => setFocusedField("")}
                                    className={`w-full px-4 py-4 border-3 border-black bg-white text-black placeholder-gray-500 font-mono text-sm transition-all duration-200 ${
                                        focusedField === "address" ? "shadow-[4px_4px_0px_0px_#000000] transform -translate-x-1 -translate-y-1" : "shadow-[2px_2px_0px_0px_#000000]" }`}
                                    placeholder="ENTER YOUR ADDRESS"
                                />
                            </div>

                            <div className="relative">
                                <input type="text" name="City" id="City" onChange={handlechange} onFocus={() => setFocusedField("city")} onBlur={() => setFocusedField("")}
                                    className={`w-full px-4 py-4 border-3 border-black bg-white text-black placeholder-gray-500 font-mono text-sm transition-all duration-200 ${
                                        focusedField === "city" ? "shadow-[4px_4px_0px_0px_#000000] transform -translate-x-1 -translate-y-1" : "shadow-[2px_2px_0px_0px_#000000]" }`}
                                    placeholder="ENTER YOUR CITY"
                                />
                            </div>

                            <div className="relative">
                                <input type="text" name="State" id="State" onChange={handlechange} onFocus={() => setFocusedField("state")} onBlur={() => setFocusedField("")}
                                    className={`w-full px-4 py-4 border-3 border-black bg-white text-black placeholder-gray-500 font-mono text-sm transition-all duration-200 ${
                                        focusedField === "state" ? "shadow-[4px_4px_0px_0px_#000000] transform -translate-x-1 -translate-y-1" : "shadow-[2px_2px_0px_0px_#000000]" }`}
                                    placeholder="ENTER YOUR STATE"
                                />
                            </div>

                            <div className="relative">
                                <input type="text" name="Zipcode" id="Zipcode" onChange={handlechange} onFocus={() => setFocusedField("zipcode")} onBlur={() => setFocusedField("")}
                                    className={`w-full px-4 py-4 border-3 border-black bg-white text-black placeholder-gray-500 font-mono text-sm transition-all duration-200 ${
                                        focusedField === "zipcode" ? "shadow-[4px_4px_0px_0px_#000000] transform -translate-x-1 -translate-y-1" : "shadow-[2px_2px_0px_0px_#000000]" }`}
                                    placeholder="ENTER YOUR ZIPCODE"
                                />
                            </div>


                        </div>
                            <div className="text-center mt-5">
                                <p className="text-sm">
                                    Already Signed Up?{" "}
                                    <Link to="/login" className="font-black underline decoration-2 underline-offset-2 hover:bg-black hover:text-white px-1 py-0.5 transition-colors duration-200">
                                        LOGIN HERE
                                    </Link>
                                </p>
                            </div>
                        <div className="mt-4">
                            <button type="submit" className="w-full bg-black text-white py-4 cursor-pointer font-bold text-lg tracking-widest border-3 border-black hover:bg-white hover:text-black transition-all duration-200 shadow-[4px_4px_0px_0px_#000000] hover:shadow-[6px_6px_0px_0px_#000000] hover:transform hover:-translate-x-1 hover:-translate-y-1">
                                {loading ? "PLEASE WAIT..." : "SIGN UP"}
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
    )
}