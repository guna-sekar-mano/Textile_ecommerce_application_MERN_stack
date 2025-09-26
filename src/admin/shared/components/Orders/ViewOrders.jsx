import { Dialog } from 'primereact/dialog';
import React from 'react'
import apiurl from '../../../../shared/services/apiendpoint/apiendpoint';

export default function ViewOrders(props) {
    const { ViewProduct, setViewProduct, ViewProductData } = props;
    // console.log("ViewProductData",ViewProductData);
    return (
        <div>
            <Dialog header="Ordered Items" visible={ViewProduct} onHide={() => setViewProduct(false)} className="!w-full lg:!w-[60rem]">
                <div className="p-4">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product Name</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Size</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {ViewProductData?.map((item, index) => (
                                    <tr key={index}> 
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            <img src={`${apiurl()}/${item?.Images[0]}`} className='w-28' alt="" srcset="" />
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item?.Product_Name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item?.selectedSize}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item?.Quantity}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${item?.sale_price}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${(item?.sale_price * item?.Quantity).toFixed(2)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </Dialog>
        </div>
    )
}
