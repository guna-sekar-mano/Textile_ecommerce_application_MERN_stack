export default function HandtoHand() {

    return (
        <>
            <section className="bg-[url('/images/hand-to-hand.jpg')] lg:h-screen bg-no-repeat w-full bg-cover bg-center bg-fixed">
                <div className="bg-black/50 lg:h-screen h-full">
                    <div className=" max-w-[95rem] mx-auto px-3">
                        <div className="flex lg:block gap-4 font-handelgothic">
                            <h1 className="lg:text-8xl text-5xl text-white pt-8 font-bold">HAND</h1>
                            <h1 className="lg:text-8xl text-5xl text-white font-bold lg:mx-52 pt-8">TO</h1>
                            <h1 className="lg:text-8xl text-5xl text-white font-bold pt-8 lg:mx-[20%]">HAND</h1>
                        </div>
                        <hr className="text-white/35 mt-5 lg:mt-10" />
                        <div className="flex lg:justify-end justify-center py-5 lg:py-10">
                            <div className="lg:w-1/2 text-justify space-y-5 lg:space-y-8 font-semibold text-xl">
                                <p className="text-white leading-relaxed">
                                    At FOXO, we believe style and comfort should go hand in hand. Our mission is to create premium-quality apparel that makes you feel confident,
                                    whether you’re at the gym, out on the streets, or simply relaxing at home.
                                </p>
                                <p className="text-white leading-relaxed">
                                    Founded with a passion for fashion and functionality, we craft each product using high-grade fabrics and cutting-edge designs. From classic
                                    round-neck T-shirts to performance-ready track pants, every piece is thoughtfully made to last, keeping you comfortable and stylish in every moment.
                                    We take pride in delivering exceptional value to our customers. With a strong focus on quality, sustainability, and customer satisfaction,
                                    FOXO has grown into a trusted name in modern lifestyle apparel.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}