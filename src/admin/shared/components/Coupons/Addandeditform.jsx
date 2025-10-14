import { Dialog } from 'primereact/dialog';
import { useEffect, useState } from 'react';
import { MultiSelect } from 'primereact/multiselect';
import { getCouponCustomers } from '../../services/apiCoupons/apicoupons';

export default function AddandEditform ({visible, setVisible, handlesave, handlechange, loading, formdata, handleupdate}) {

    const [customers, setCustomers] = useState([]);

    const generateCouponCode = () => {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let result = '';
        for (let i = 0; i < 8; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        
        const event = {
            target: {name: 'Coupon_Code',value: result}
        };
        handlechange(event);
    };

    useEffect(() => {
        const fetchcustomers = async () => {
            try {
                const customerData = await getCouponCustomers();
                setCustomers(customerData.resdata || []);
            } catch (error) {
                console.error('Error fetching customers:', error);
                setCustomers([]);
            }
        };
        fetchcustomers();
    }, []);

     const handleMultiSelectChange = (e) => {
        const event = {
            target: {
                name: 'Customer',
                value: e.value
            }
        };
        handlechange(event);
    };

    const formatDateForInput = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toISOString().split('T')[0];
    };

    return (
        <>
         <Dialog header="Coupon Details" visible={visible} onHide={() => setVisible(false)} className="!w-full lg:!w-[40rem]">
            <form onSubmit={!formdata?._id ? handlesave : handleupdate}>
                
                <div className="mb-2">
                    <div className="mb-2">
                        <label>Coupon Name</label>
                    </div>
                    <input type="text" name="Coupon_Name" value={formdata?.Coupon_Name || ''} onChange={handlechange} className="w-full px-4 py-2 border rounded-md outline-none" required />
                </div>

                <div className="mb-2">
                    <div className="mb-2">
                        <label>Coupon Code</label>
                    </div>
                    <div className="flex gap-2">
                        <input type="text" name="Coupon_Code" value={formdata?.Coupon_Code || ''} onChange={handlechange} className="flex-1 px-4 py-2 border rounded-md outline-none" 
                            placeholder="You can type coupon code or generate" required />
                        <button type="button" onClick={generateCouponCode} className="px-4 py-2 text-white bg-gray-500 rounded-md hover:bg-gray-600 whitespace-nowrap">
                            Generate
                        </button>
                    </div>
                </div>

                <div className="mb-2">
                    <div className="mb-2">
                        <label>Coupon Type</label>
                    </div>
                    <select name="Coupon_Type" value={formdata?.Coupon_Type || ''} onChange={handlechange} className="w-full px-4 py-2 border rounded-md outline-none" required>
                        <option value="" disabled>--- Select coupon type ---</option>
                        <option value="Public">Public Coupon</option>
                        <option value="Private">Private Coupon</option>
                    </select>
                </div>

                {formdata?.Coupon_Type === 'Public' && (
                    <>
                        <div className="mb-2">
                            <div className="mb-2">
                                <label>Target Users</label>
                            </div>
                            <select name="Target_Users" value={formdata?.Target_Users || ''} onChange={handlechange} className="w-full px-4 py-2 border rounded-md outline-none" required>
                                <option value="" disabled>--- Select target users ---</option>
                                <option value="First_Time_Users">First Time Users</option>
                                <option value="All_Users">All Users</option>
                            </select>
                        </div>

                        <div className="mb-2">
                            <div className="mb-2">
                                <label>Minimum Amount to Avail Coupon</label>
                            </div>
                            <input type="number" name="Minimum_Amount" value={formdata?.Minimum_Amount || ''} onChange={handlechange} className="w-full px-4 py-2 border rounded-md outline-none" 
                                placeholder="Enter minimum amount" min="0" step="0.01" required />
                        </div>
                    </>
                )}

                {formdata?.Coupon_Type === 'Private' && (
                    <>
                        <div className="mb-2">
                            <div className="mb-2">
                                <label>Customer</label>
                            </div>
                             <MultiSelect name="Customer" value={formdata?.Customer || []} options={customers.map(cust => ({ label: cust.Email, value: cust.Email }))} 
                                onChange={handleMultiSelectChange} className="w-full border rounded-md outline-none" placeholder="Select customers" display="chip" required />
                        </div>

                        <div className="mb-2">
                            <div className="mb-2">
                                <label>Minimum Amount to Avail Coupon</label>
                            </div>
                            <input type="number" name="Minimum_Amount" value={formdata?.Minimum_Amount || ''} onChange={handlechange} className="w-full px-4 py-2 border rounded-md outline-none" 
                                placeholder="Enter minimum amount" min="0" step="0.01" required />
                        </div>
                    </>
                )}

                {(formdata?.Coupon_Type === 'Public' || formdata?.Coupon_Type === 'Private') && (
                    <>
                        <div className="mb-2">
                            <div className="mb-2">
                                <label>Discount Type</label>
                            </div>
                            <select name="Discount_Type" value={formdata?.Discount_Type || ''} onChange={handlechange} className="w-full px-4 py-2 border rounded-md outline-none" required>
                                <option value="" disabled>--- Select discount type ---</option>
                                <option value="Flat_Discount">Flat Discount (Amount)</option>
                                <option value="Flat_Percentage">Flat Percentage (%)</option>
                            </select>
                        </div>

                        {formdata?.Discount_Type === 'Flat_Discount' && (
                            <div className="mb-2">
                                <div className="mb-2">
                                    <label>Flat Discount Amount</label>
                                </div>
                                <input type="number" name="Flat_Discount" value={formdata?.Flat_Discount || ''} onChange={handlechange} className="w-full px-4 py-2 border rounded-md outline-none" 
                                    placeholder="Enter discount amount" min="0" step="0.01" required />
                            </div>
                        )}

                        {formdata?.Discount_Type === 'Flat_Percentage' && (
                            <div className="mb-2">
                                <div className="mb-2">
                                    <label>Flat Percentage Discount (%)</label>
                                </div>
                                <input type="number" name="Flat_Percentage" value={formdata?.Flat_Percentage || ''} onChange={handlechange} className="w-full px-4 py-2 border rounded-md outline-none" 
                                    placeholder="Enter percentage (0-100)" min="0" max="100" step="0.01" required />
                            </div>
                        )}
                    </>
                )}

                <div className="mb-2">
                    <div className="mb-2">
                        <label>Coupon Valid From</label>
                    </div>
                    <input type="date" name="Valid_From" value={formatDateForInput(formdata?.Valid_From)} onChange={handlechange} className="w-full px-4 py-2 border rounded-md outline-none" 
                        required />
                </div>

                <div className="mb-2">
                    <div className="mb-2">
                        <label>Coupon Valid To</label>
                    </div>
                    <input type="date" name="Valid_To" value={formatDateForInput(formdata?.Valid_To)} onChange={handlechange} className="w-full px-4 py-2 border rounded-md outline-none" 
                        min={formdata?.Valid_From || ''} required />
                </div>

                <div className="mb-2">
                    <div className="mb-2">
                        <label>Total Usage Limit per user</label>
                    </div>
                    <input type="number" name="Total_Usage_Limit" value={formdata?.Total_Usage_Limit || ''} onChange={handlechange} className="w-full px-4 py-2 border rounded-md outline-none" required />
                </div>

                <div className="mb-2">
                    <div className="mb-2">
                        <label>Status</label>
                    </div>
                    <select name="Status" value={formdata?.Status || ''} onChange={handlechange} className="w-full px-4 py-2 border rounded-md outline-none" required>
                        <option value="" disabled>--- Select a status ---</option>
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                    </select>
                </div>

                <div className="mb-2">
                    <button type="submit" className="w-full px-4 py-2 text-white border rounded-md bg-black" disabled={loading}>
                        {loading && (
                            <span className="animate-spin text-xl inline-block size-4 border-[3px] border-current border-t-transparent text-white rounded-full mr-2" role="status" aria-label="loading"></span>
                        )} 
                        {!formdata?._id ? "Save" : "Update"}
                    </button>
                </div>
            </form>
        </Dialog>
        </>
    )
}