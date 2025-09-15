import { ChevronDown } from "lucide-react";
import { useRef, useState } from "react";

export default function Faq () {

    const [selected, setSelected] = useState(1);

    const container3Ref = useRef(null);
    const container7Ref = useRef(null);
    const container2Ref = useRef(null);

    const toggleAccordion = (id) => {
        setSelected(selected !== id ? id : null);
    };

    return (
        <>
            <section className="relative top-0">
                <h1 className="barlow-condensed text-2xl">Frequently Asked Questions</h1>
                <hr className="mt-5" />

                <div className="max-w-full mt-10">
                      <div className="border p-5">
                        <ul className="shadow-box">
                            <li className="relative border-b border-black">
                                <button type="button" className="w-full px-6 py-3 text-left" onClick={() => toggleAccordion(3)}>
                                    <div className="flex items-center justify-between">
                                        <span>How can I provide feedback about the Experience?</span>
                                        <ChevronDown className={`text-gray-500 transition-transform ${selected === 3 ? "transform rotate-180" : ""}`} />
                                    </div>
                                </button>
                                <div className="relative overflow-hidden transition-all duration-700" style={{maxHeight: selected === 3 ? container3Ref.current?.scrollHeight || "auto" : "0"}} ref={container3Ref}>
                                    <div className="px-6 pb-6">
                                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Beatae corporis voluptatibus nobis cumque maxime laboriosam, dolor, autem itaque eum officiis consectetur voluptates ea rem ipsam nihil quasi reprehenderit. Voluptatibus, libero.</p>
                                    </div>
                                </div>
                            </li>

                            <li className="relative border-b border-black">
                                <button type="button" className="w-full px-6 py-3 text-left" onClick={() => toggleAccordion(7)}>
                                    <div className="flex items-center justify-between">
                                        <span>Do you give offer for Bulk Booking?</span>
                                        <ChevronDown className={`text-gray-500 transition-transform ${selected === 7 ? "transform rotate-180" : ""}`} />
                                    </div>
                                </button>
                                <div className="relative overflow-hidden transition-all duration-700" style={{maxHeight: selected === 7 ? container7Ref.current?.scrollHeight || "auto" : "0"}} ref={container7Ref}>
                                    <div className="px-6 pb-6">
                                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Eos laboriosam, magni tempora, molestiae voluptate facilis reprehenderit saepe officia laudantium incidunt nobis rerum expedita libero vel quisquam provident ullam impedit eum.</p>
                                    </div>
                                </div>
                            </li>

                            <li className="relative border-b border-black">
                                <button type="button" className="w-full px-6 py-3 text-left" onClick={() => toggleAccordion(2)}>
                                    <div className="flex items-center justify-between">
                                        <span>How can I rise a Complaint?</span>
                                        <ChevronDown className={`text-gray-500 transition-transform ${selected === 2 ? "transform rotate-180" : ""}`} />
                                    </div>
                                </button>
                                <div className="relative overflow-hidden transition-all duration-700" style={{maxHeight: selected === 2 ? container2Ref.current?.scrollHeight || "auto" : "0"}} ref={container2Ref}>
                                    <div className="px-6 pb-6">
                                        <p>No reviews yet. Be the first to review this product!</p>
                                    </div>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </section>
        </>
    )
}