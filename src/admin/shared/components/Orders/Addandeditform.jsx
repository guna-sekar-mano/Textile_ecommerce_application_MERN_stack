import { Dialog } from "primereact/dialog";

export default function Addandeditform (props) {
    const { visible, setVisible, loading, formdata, setFormdata, handlechange, handleupdate } = props;
    return (
        <>
            <Dialog header="Update Order" visible={visible} onHide={() => setVisible(false)} className="!w-full lg:!w-[40rem]">
                <form onSubmit={handleupdate}>

                    <div className='grid grid-cols-1 gap-3 lg:grid-cols-2'>
                        <div className="mb-2">
                            <div className="mb-2">
                                <label>Order Status</label>
                            </div>
                            <select name="Order_Status" value={formdata?.Order_Status || ''} onChange={handlechange} className="w-full px-4 py-2 border rounded-md outline-none" required>
                                <option value="" disabled>---select a status---</option>
                                <option value="Order Placed">Order Placed</option>
                                <option value="Order Confirmed">Order Confirmed</option>
                                <option value="Order Packed">Order Packed</option>
                                <option value="Order Shipped">Order Shipped</option>
                                <option value="Out for Delivery">Out for Delivery</option>
                                <option value="Order Delivered">Order Delivered</option>
                                <option value="Order Return">Order Return</option>
                                <option value="Order Cancell">Order Cancell</option>
                            </select>
                        </div>
                        <div className="mb-2">
                            <div className="mb-2">
                                <label>Payment Status</label>
                            </div>
                            <select name="Payment_Status" value={formdata?.Payment_Status || ''} onChange={handlechange} className="w-full px-4 py-2 border rounded-md outline-none" required>
                                <option value="" disabled>---select a status---</option>
                                <option value="Not Paid">Not Paid</option>
                                <option value="Paid">Paid</option>
                                <option value="Payment Refunded">Payment Refunded</option>
                            </select>
                        </div>
                        {['Order Shipped','Out for Delivery','Order Delivered'].includes(formdata.Order_Status)&& <>
                            <div className="mb-2">
                                <div className="mb-2">
                                    <label>Courier ID</label>
                                </div>
                                <input type="text" name="Courier_ID" value={formdata?.Courier_ID || ''} onChange={handlechange} className="w-full px-4 py-2 border rounded-md outline-none" required/>
                            </div>
                            <div className="mb-2">
                                <div className="mb-2">
                                    <label>Courier Tracking Link</label>
                                </div>
                                <input type="text" name="Tracking_Link" value={formdata?.Tracking_Link || ''} onChange={handlechange} className="w-full px-4 py-2 border rounded-md outline-none"/>
                            </div>
                        </>}

                        {/* <div className="mb-2">
                            <div className="mb-2">
                                <label>Status</label>
                            </div>
                            <select name="Status" value={formdata?.Status || ''} onChange={handlechange} className="w-full px-4 py-2 border rounded-md outline-none" required>
                                <option value="" disabled>---select a status---</option>
                                <option value="Active">Active</option>
                                <option value="Inactive">Inactive</option>
                            </select>
                        </div> */}
                    </div>

                    <div className="mb-2">
                        <button type="submit" className="w-full px-4 py-2 text-white border bg-black">
                            {loading && (
                                <span className="animate-spin text-xl inline-block size-4 border-[3px] border-current border-t-transparent text-white rounded-full" role="status"
                                    aria-label="loading"
                                ></span>
                            )}{' '}
                            {'Update'}
                        </button>
                    </div>
                </form>
            </Dialog>
        </>
    )
}