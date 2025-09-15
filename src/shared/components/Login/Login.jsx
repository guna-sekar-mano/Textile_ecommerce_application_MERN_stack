import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../../services/store/useAuth";
import toast from "react-hot-toast";
import { apilogin } from "../../services/apiauthentication/apilogin";
import Swal from "sweetalert2";

export default function Login() {

    const [focusedField, setFocusedField] = useState("");

    const {login}=useAuth();
    const navigate = useNavigate();
    const [formdata, setformdata] = useState({});
    const handlechange = (e) => setformdata({ ...formdata, [e.target.name]: e.target.value });

    const handlelogin = async (e) => {
        e.preventDefault();
        try {
            const res = await apilogin(formdata);
            console.log(res);
            if (res?.message === "Login successful") {
                // toast.success("Login successful");
                Swal.fire({title: "Login successful", icon: "success",draggable: true});
                login(res.token); 
                const role = res.role;  
                if (role === 'Admin' || role === 'Student') {
                    navigate('/dashboard');  
                } else if (role === 'Customer') {
                    navigate('/'); 
                } else {
                    toast.error("Unknown role");
                }
            } else {
                toast.error(res?.message || "Invalid email or password");
            }
        } catch (error) {
            toast.error("An error occurred during login");
            console.error("Login error:", error);
        }
    };

    return (
        <div className="min-h-screen bg-white flex items-center justify-center relative overflow-hidden">
        
            <section className="relative z-10 w-full max-w-md mx-auto px-6">
                <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_#000000] p-8">
                    <div className="text-center mb-8">
                        <div className="inline-block bg-black text-white px-6 py-2 mb-4 transform -rotate-1">
                            <h1 className="text-2xl font-bold tracking-wider">LOGIN</h1>
                        </div>
                        <p className="text-lg">Welcome to{" "}
                            <span className="font-black text-xl bg-black text-white px-2 py-1 inline-block transform rotate-1 font-handelgothic">
                                EXTREME CULTURE
                            </span>
                        </p>
                    </div>
                    <form onSubmit={handlelogin}>
                        <div className="space-y-6">
                            <div className="relative">
                                <input type="text" name="Email" id="Email" onChange={handlechange} onFocus={() => setFocusedField("email")} onBlur={() => setFocusedField("")}
                                    className={`w-full px-4 py-4 border-3 border-black bg-white text-black placeholder-gray-500 font-mono text-sm transition-all duration-200 ${
                                        focusedField === "email" ? "shadow-[4px_4px_0px_0px_#000000] transform -translate-x-1 -translate-y-1" : "shadow-[2px_2px_0px_0px_#000000]"}`}
                                    placeholder="EMAIL OR MOBILE NUMBER" required
                                />
                            
                            </div>

                            <div className="relative">
                                <input type="password" name="Password" id="Password" onChange={handlechange} onFocus={() => setFocusedField("password")} onBlur={() => setFocusedField("")}
                                    className={`w-full px-4 py-4 border-3 border-black bg-white text-black placeholder-gray-500 font-mono text-sm transition-all duration-200 ${
                                        focusedField === "password" ? "shadow-[4px_4px_0px_0px_#000000] transform -translate-x-1 -translate-y-1" : "shadow-[2px_2px_0px_0px_#000000]" }`}
                                    placeholder="PASSWORD" required
                                />
                            
                            </div>

                            <div className="text-center">
                                <p className="text-sm">
                                    New to our store?{" "}
                                    <Link to="/sign-up" className="font-black underline decoration-2 underline-offset-2 hover:bg-black hover:text-white px-1 py-0.5 transition-colors duration-200">
                                        SIGNUP HERE
                                    </Link>
                                </p>
                            </div>

                            <button type="submit" className="w-full cursor-pointer bg-black text-white py-4 font-bold text-lg tracking-widest border-3 border-black hover:bg-white hover:text-black transition-all duration-200 shadow-[4px_4px_0px_0px_#000000] hover:shadow-[6px_6px_0px_0px_#000000] hover:transform hover:-translate-x-1 hover:-translate-y-1">
                                LOGIN
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
    );
}