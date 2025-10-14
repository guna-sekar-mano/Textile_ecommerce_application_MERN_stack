import axios from "axios";
import { useEffect, useState } from "react"
import { Link } from "react-router-dom";

export default function Rough () {

    const [productdata, setproductdata] = useState([]);

    const getproductdata = async () => {
        const res = await axios.get('https://dummyjson.com/products');
        setproductdata(res.data.products);
    };

    useEffect(() => {
        getproductdata();
    }, []);

    return (
        <>
            {productdata.map((res) => (
                <Link to={`/singleproductdata/${res.id}`} data-testid className="p-5 mt-6 mr-2 border shadow Productcard rounded-xl">
                    <div key={res.id} className="p-4 border rounded-md shadow-md text-center">
                        <img className='h-[170px] max-w-full object-cover mx-auto' src={res.thumbnail} alt={res.title} />
                        <h1 className='px-4 py-2 mt-2 font-bold bg-slate-100'>{res.title}</h1>
                        <h1 className='px-3 py-2 font-semibold'>${res.price}</h1>
                        <h1 className='px-3 py-2'>
                        <i className="fa-solid fa-star-half-stroke"></i> {res.rating}
                        </h1>
                    </div>
                </Link>
            ))}

        </>
    )
}