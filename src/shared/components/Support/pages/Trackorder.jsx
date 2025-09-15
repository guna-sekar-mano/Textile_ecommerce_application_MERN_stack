export default function Trackorder () {

    return (
        <>
          <section className="relative top-0">
            <h1 className="barlow-condensed text-2xl">Track my order</h1>
            <hr className="mt-5 text-gray-300" />

            <div className="max-w-[45rem] mt-10">
                <div className="border p-5">
                    <p className="text-justify text-sm">To Track your order please enter your order ID in the text box below and press the “TRACK ORDER” button. This was given to you on your receipt and in the confirmation email you should have recevied</p>
                    <form action="" className="mt-5">
                        <div className="mb-2">
                            <label htmlFor="">Order ID *</label>
                            <input type="text" name="" id="" className="w-full p-2 border mt-1" />
                        </div>
                        
                        <div className="mb-2">
                            <label htmlFor="">Billing E-mail *</label>
                            <input type="text" name="" id="" className="w-full p-2 border mt-1" />
                        </div>
                        <button className="bg-black w-full p-2 text-white">Track my order</button>
                    </form>
                </div>
              

            </div>
           </section>
        </>
    )
}