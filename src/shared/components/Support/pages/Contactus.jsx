export default function Contactus () {

    return (
        <>
           <section className="relative top-0">
            <h1 className="barlow-condensed text-2xl">Contact Us</h1>
            <hr className="mt-5 text-gray-300" />

            <div className="max-w-[45rem] mt-10">
                <div className="border p-5">
                    <form action="">
                        <div className="mb-2">
                            <label htmlFor="">Full Name *</label>
                            <input type="text" name="" id="" className="w-full p-2 border mt-1" />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
                            <div className="mb-2">
                                <label htmlFor="">Email *</label>
                                <input type="text" name="" id="" className="w-full p-2 border mt-1" />
                            </div>
                            <div className="mb-2">
                                <label htmlFor="">Phone No *</label>
                                <input type="text" name="" id="" className="w-full p-2 border mt-1" />
                            </div>
                        </div>
                        <div className="mb-2">
                            <label htmlFor="">Additional Information *</label>
                            <textarea rows={6} type="text" name="" id="" className="w-full p-2 border mt-1" >
                            </textarea>
                        </div>
                        <button className="bg-black w-full p-2 text-white">Contact</button>
                    </form>
                </div>
              

            </div>
           </section>
        </>
    )
}