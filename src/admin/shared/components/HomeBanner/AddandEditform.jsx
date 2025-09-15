import { Dialog } from "primereact/dialog";
import { MultiSelect } from "primereact/multiselect";

export default function AddandEditform ({ visible, setVisible, file,productname, handlesave, handlechange, loading, formdata, handleupdate }) {

    const productOptions = productname && Array.isArray(productname) ? productname.map((name) => ({ label: name, value: name })): [];
    
    const handleMultiSelectChange = (e) => {
        console.log("MultiSelect change event:", e);
        const event = {
            target: {
                name: 'productname',
                value: e.value
            }
        };
    handlechange(event);
    };

    return (
        <>
        <Dialog header="Home Banner Details" visible={visible} onHide={() => setVisible(false)} className="!w-full lg:!w-[40rem]">
            <form onSubmit={!formdata?._id ? handlesave : handleupdate}>
                <div className='mb-3'>
                    <div className='flex items-center justify-center mb-3'>
                        <label className="flex flex-col items-center overflow-hidden justify-center h-40 w-40 object-cover border-2 border-gray-300 border-dashed cursor-pointer bg-gray-50">
                            {file ? (
                                <img src={file} className='' alt="" srcSet="" />
                            ) : (
                                <>
                                    <div className="flex flex-col items-center justify-center pt-4 pb-5">
                                        <i className="fi fi-sr-mode-landscape"></i>
                                        <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click to upload</span></p>
                                        <p className="text-xs text-gray-500">SVG, PNG, JPG</p>
                                    </div>
                                </>
                            )}
                            <input type="file" name="Images" multiple onChange={handlechange} className="hidden" />
                        </label>
                    </div>
                    <div className='hidden'>
                        <img width="50px" src="https://img.freepik.com/free-photo/3d-rendering-beautiful-luxury-bedroom-suite-hotel-with-tv_105762-2173.jpg?t=st=1711361047~exp=1711364647~hmac=71fd55e8418ee7913fe07a5f00af8d93c6db7474a1d71e2d5fbf7d431975180f&w=1380" alt="" />
                    </div>
                </div>

                <div className='grid grid-cols-1 gap-3 lg:grid-cols-2'>
                    <div className="mb-2">
                        <div className="mb-2">
                            <label>Banner Name</label>
                        </div>
                        <input type="text" name="Banner_Name" value={formdata?.Banner_Name || ''} onChange={handlechange} className="w-full px-4 py-2 border rounded-md outline-none" required/>
                    </div>
                    <div className="mb-2">
                        <div className="mb-2">
                            <label>Redirect Link</label>
                        </div>
                        <input type="text" name="redirect_link" value={formdata?.redirect_link || ''} onChange={handlechange} className="w-full px-4 py-2 border rounded-md outline-none"/>
                    </div>
                     <div className="mb-2">
                            <div className="mb-2">
                                <label>Product Name</label>
                            </div>
                            <MultiSelect
                                name="productname"
                                value={formdata?.productname || []}
                                options={productOptions}
                                onChange={handleMultiSelectChange}
                                placeholder="Select Product Names"
                                className="w-full"
                                display="chip"
                                required
                                emptyMessage="No products available"
                                showSelectAll={true}
                                filter={true}
                                filterBy="label"
                            />
                        </div>
                        <div className="mb-2">
                            <div className="mb-2">
                                <label>Status</label>
                            </div>
                            <select name="Status" value={formdata?.Status || ''} onChange={handlechange} className="w-full px-4 py-2 border rounded-md outline-none" required>
                                <option value="" disabled>---select a status---</option>
                                <option value="Active">Active</option>
                                <option value="Inactive">Inactive</option>
                            </select>
                        </div>
                    </div>

                <div className="mb-2">
                    <button type="submit" className="w-full px-4 py-2 text-white border bg-black">
                        {loading && (
                            <span className="animate-spin text-xl inline-block size-4 border-[3px] border-current border-t-transparent text-white rounded-full" role="status"
                                aria-label="loading"
                            ></span>
                        )}{' '}
                        {!formdata?._id ? 'Save' : 'Update'}
                    </button>
                </div>
            </form>
        </Dialog>
        </>
    )
}