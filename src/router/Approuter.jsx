import { BrowserRouter, Route, Routes } from "react-router-dom";
import Main from "../core/Main";
import Homepage from "../components/Homepage";
import ProductsViewPage from "../components/Productsviewpage";
// import Collectionpage from "../components/Collectionspage";
import Loginpage from "../components/Loginpage";
import SignupPage from "../components/Signuppage";
import VerifyOtp from "../shared/components/Signup/VerifyOtp";
import Dashboardrouter from "../admin/adminrouter/router";
import ProtectedRoute from "../shared/services/token/ProtectedRoute";
import Cartpage from "../components/Cartpage";
import Checkoutpage from "../components/Checkoutpage";
import Wishlistpage from "../components/Wishlistpage";
import Categoryproducts from "../shared/components/CategoryProducts/Categoryproducts";
import SupportMain from "../shared/components/Support/core/SupportMain";
import Contactus from "../shared/components/Support/pages/Contactus";
import Trackorder from "../shared/components/Support/pages/Trackorder";
import Faq from "../shared/components/Support/pages/Faq";
import ScrollToTop from "./Scrolltotop";
import MyAccountMain from "../shared/components/MyAccount/core/MyAccountMain";
import Myorders from "../shared/components/MyAccount/pages/MyOrders";
import AccountDetails from "../shared/components/MyAccount/pages/AccountDetails";
import Rough from "../shared/components/rough";
import BannerProducts from "../shared/components/BannerProducts/Bannerproducts";


export default function Approuter () {

    return (
        <>
        <BrowserRouter>
            <ScrollToTop/>
            <Routes>
                <Route element={<Main/>}>
                    <Route path="/" element={<Homepage/>}/>
                    <Route path="/products/:productType/:routerLink" element={<ProductsViewPage />} />
                    <Route path="/collections/:productType" element={<Categoryproducts />} />
                    <Route path="/banner-products/:bannerId" element={<BannerProducts />} />
                    <Route path="/login" element={<Loginpage/>}/>
                    <Route path="/sign-up" element={<SignupPage/>}/>
                    <Route path="/verify-otp" element={<VerifyOtp/>}/>
                    <Route path="/cart" element={<Cartpage/>}/>
                    <Route path="/checkout" element={<Checkoutpage/>}/>
                    <Route path="/rough" element={<Rough/>}/>

                    <Route path="/wishlist" element={<Wishlistpage/>}/>
                        <Route element={<SupportMain />}>
                            <Route path="/contact-us" element={<Contactus/>}/>
                            <Route path="/track-order" element={<Trackorder/>}/>
                            <Route path="/frequently-asked-questions" element={<Faq/>}/>
                        </Route>
                        <Route element={<MyAccountMain />}>
                            <Route path="/my-orders" element={<Myorders/>}/>
                            <Route path="/account-details" element={<AccountDetails/>}/>
                        </Route>
                </Route>
                <Route path="/dashboard/*" element={<ProtectedRoute allowedRoles={['Admin']}><Dashboardrouter /></ProtectedRoute>}/>
            </Routes>
        </BrowserRouter>
        </>
    )
}