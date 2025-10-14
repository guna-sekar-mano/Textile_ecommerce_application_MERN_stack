import { Navigate, Route, Routes } from "react-router-dom";
// import useAuth from "../../shared/services/store/useAuth";
import Adminmain from "../core/Main";
import Dashboardpage from "../components/Dashboardpage";
import Productspage from "../components/Productspage";
import Customerpage from "../components/Customerpage";
import Hookuppage from "../components/Hookuppage";
import Homecategoriespage from "../components/Homecategoriespage";
import Homebannerpage from "../components/Homebannerpage";
import Popularproductspage from "../components/PopularProductspage";
import Orderspage from "../components/Orderspage";
import Couponspage from "../components/Couponspage";
import Newsletterpage from "../components/Newsletterpage";

export default function Dashboardrouter() {

    const getRedirectPath = () => {
      return "/dashboard/adminhome";
    };

    return (
        <>
         <Routes> 
            <Route element={<Adminmain />}>
                <Route path="adminhome" element={<Dashboardpage/>}/>
                <Route path="products" element={<Productspage/>}/>
                <Route path="customer" element={<Customerpage/>}/>
                <Route path="/hookups" element={<Hookuppage/>}/>
                <Route path="/categories" element={<Homecategoriespage/>}/>
                <Route path="/home-banner" element={<Homebannerpage/>}/>
                <Route path="/popular-products" element={<Popularproductspage/>}/>
                <Route path="/orders" element={<Orderspage/>}/>
                <Route path="/coupons" element={<Couponspage/>}/>
                <Route path="/newsletter" element={<Newsletterpage/>}/>

                <Route path="/" element={<Navigate to={getRedirectPath()} replace />} />
            </Route>

        </Routes>
        </>
    )
}