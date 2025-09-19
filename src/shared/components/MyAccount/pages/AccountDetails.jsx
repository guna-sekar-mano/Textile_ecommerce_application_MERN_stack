import { useCallback, useEffect, useState } from "react";
import useAuth from "../../../services/store/useAuth";
import { getAccountdetails, updateAccountdetails } from "../../../services/apishipping/apishipping";
import Swal from "sweetalert2";


export default function AccountDetails () {

    const [accountDetails, setAccountDetails] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({});

    let isMounted = true;
    const { userdetails } = useAuth();

    const fetchShippingDetails = useCallback(async () => {
        try {
        const res = await getAccountdetails({ Email: userdetails?.Email });
        if (res.resdata?.length) {
            setAccountDetails(res.resdata[0]);
            setFormData({
                First_Name: res.resdata[0].First_Name,
                Last_Name: res.resdata[0].Last_Name,
                Email: res.resdata[0].Email,
                Mobilenumber: res.resdata[0].Mobilenumber
            });
        } else {
            setAccountDetails(null);
        }
        } catch (err) {
        console.log("Error fetching shipping details:", err);
        }
    }, [userdetails?.Email]);

    useEffect(() => {
        if (isMounted) {
        fetchShippingDetails();
        }
        return () => (isMounted = false);
    }, [fetchShippingDetails]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
        ...prev,
        [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
        const params = {
            _id: accountDetails._id,
            First_Name: formData.First_Name,
            Last_Name: formData.Last_Name,
            Mobilenumber: formData.Mobilenumber
        };

        const response = await updateAccountdetails(params);

        if (response.message) {
            console.log(response.message);
            await fetchShippingDetails();
            Swal.fire({title: "Account Details updated successfully", icon: "success",draggable: true});
            setIsEditing(false);
        }
        } catch (error) {
        console.error("Error updating account details:", error);
        }
    };

    return (
        <>
        <section className="relative top-0">
            <h1 className="barlow-condensed text-2xl">Account Details</h1>
            <hr className="mt-5" />

             <div className="max-w-full mt-10 ">
                <div className="flex justify-between">
                    <div className="max-w-[45rem] border p-5 w-full">
                        { accountDetails ? (
                            isEditing ? (
                                <form onSubmit={handleSubmit}>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
                                        <div className="mb-2">
                                            <label htmlFor="">First Name</label>
                                            <input type="text" name="First_Name" value={formData.First_Name} onChange={handleChange} className={`w-full p-2 border mt-1 ${isEditing ? "bg-white border-gray-500 border-2" : "bg-gray-200 border-gray-300"}`}/>
                                        </div>
                                        <div className="mb-2">
                                            <label htmlFor="">Last Name</label>
                                            <input type="text"  name="Last_Name" value={formData.Last_Name} onChange={handleChange} className={`w-full p-2 border mt-1 ${isEditing ? "bg-white border-gray-500 border-2" : "bg-gray-200 border-gray-300"}`} />
                                        </div>
                                        <div className="mb-2">
                                            <label htmlFor="">Email</label>
                                            <input className="w-full p-2 border mt-1" name="Email" value={formData.Email} disabled/>
                                        </div>
                                        <div className="mb-2">
                                            <label htmlFor="">Phone No</label>
                                            <input type="number" name="Mobilenumber" value={formData.Mobilenumber} onChange={handleChange} className={`w-full p-2 border mt-1 ${isEditing ? "bg-white border-gray-500 border-2" : "bg-gray-200 border-gray-300"}`}/>
                                        </div>
                                    </div>
                                    <div className="flex justify-end space-x-4">
                                        <button type="submit" className="px-6 py-2 text-white transition-colors cursor-pointer bg-gray-600 ">
                                            Save Changes
                                        </button>
                                    </div>
                                </form>
                            ): (
                                <div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
                                        <div className="mb-2">
                                            <label htmlFor="">First Name</label>
                                            <p className="w-full p-2 border mt-1">{accountDetails?.First_Name}</p>
                                        </div>
                                        <div className="mb-2">
                                            <label htmlFor="">Last Name</label>
                                            <p className="w-full p-2 border mt-1">{accountDetails?.Last_Name}</p>
                                        </div>
                                        <div className="mb-2">
                                            <label htmlFor="">Email</label>
                                            <p className="w-full p-2 border mt-1">{accountDetails?.Email}</p>
                                        </div>
                                        <div className="mb-2">
                                            <label htmlFor="">Phone No</label>
                                            <p className="w-full p-2 border mt-1">{accountDetails?.Mobilenumber}</p>
                                        </div>
                                    </div>
                                </div>
                            )
                        ): (
                        <p className="text-center text-red-500">Account details not found.</p>
                    )}
                    </div>
                    <div className="flex justify-center items-center ">
                        <div className="flex flex-col gap-4">
                            {accountDetails && (
                                <button  onClick={() => setIsEditing(!isEditing)} className={` azeret-mono px-2 py-1 cursor-pointer ${isEditing ? "bg-gray-200 text-gray-700" : "bg-black text-white"}`}>
                                  {isEditing ? "Cancel" : "Edit"}
                                </button>
                            )}
                            <button className="bg-black text-white azeret-mono px-2 py-1 cursor-pointer">Sign Out</button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
        </>
    )
}