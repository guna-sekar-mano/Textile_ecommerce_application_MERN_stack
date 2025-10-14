import { Dialog } from 'primereact/dialog';

export default function Addshipping( { visible, setVisible, handleSave, handlechange, formData, handleupdate, }) {


    return (
        <div>
            <Dialog header="Add Shipping Address" visible={visible} onHide={() => { if (!visible) return; setVisible(false); }} style={{ width: '50vw' }} breakpoints={{ '960px': '75vw', '641px': '100vw' }} 
                maximizable
            >
                <form onSubmit={!formData._id ? handleSave : handleupdate}>
                    <div className="grid grid-cols-1 gap-2 lg:grid-cols-2">
                        <div className="mb-3">
                            <label className="text-lg">First Name</label>
                            <div className="mt-1">
                                <input type="text" name="First_Name" value={formData['First_Name']}  className="w-full px-4 py-2 border outline-none rounded" onChange={handlechange} required />
                            </div>
                        </div>
                        <div className="mb-3">
                            <label className="text-lg">Last Name</label>
                            <div className="mt-1">
                                <input type="text" name="Last_Name" value={formData['Last_Name']} className="w-full px-4 py-2 border outline-none rounded" onChange={handlechange} required />
                            </div>
                        </div>
                        <div className="mb-3">
                            <label className="text-lg">Mobile number</label>
                            <div className="mt-1">
                                <input type="Mobilenumber" name="Mobilenumber" value={formData['Mobilenumber']} className="w-full px-4 py-2 border outline-none rounded" onChange={handlechange} required />
                            </div>
                        </div>
                        <div className="mb-3">
                            <label className="text-lg">Address</label>
                            <div className="mt-1">
                                <textarea type="text" name="Address" value={formData['Address']} className="w-full px-4 py-2 border outline-none rounded" onChange={handlechange} required />
                            </div>
                        </div>
                        <div className="mb-3">
                            <label className="text-lg">City</label>
                            <div className="mt-1">
                                <input type="text" name="City" value={formData['City']} className="w-full px-4 py-2 border outline-none rounded" onChange={handlechange} required />
                            </div>
                        </div>
                        <div className="mb-3">
                            <label className="text-lg">State</label>
                            <div className="mt-1">
                                <input type="text" name="State" value={formData['State']} className="w-full px-4 py-2 border outline-none rounded" onChange={handlechange} required />
                            </div>
                        </div>
                        <div className="mb-3">
                            <label className="text-lg">Country</label>
                            <div className="mt-1">
                                <input type="text" name="Country" value={formData['Country']} className="w-full px-4 py-2 border outline-none rounded" onChange={handlechange} required />
                            </div>
                        </div>
                        <div className="mb-3">
                            <label className="text-lg">Zipcode</label>
                            <div className="mt-1">
                                <input type="text" name="Zipcode" value={formData['Zipcode']} className="w-full px-4 py-2 border outline-none rounded" onChange={handlechange} required />
                            </div>
                        </div>
                    </div>
                    <div className="flex items-start justify-start mt-2">
                    <button type="submit" className="px-4 py-2 text-white bg-black  cursor-pointer rounded">
                         {!formData._id ? 'Save' : 'Update'}
                    </button>
                    </div>
                </form>

            </Dialog>
        </div>
    )
}