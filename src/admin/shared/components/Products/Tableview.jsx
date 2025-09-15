import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Dialog } from "primereact/dialog";
import { useState } from "react";
import apiurl from "../../../../shared/services/apiendpoint/apiendpoint";
import { Eye } from "lucide-react";

export default function Tableview ({tableData, editform, confirm}) {

    const [selectedImages, setSelectedImages] = useState([]);
    const [isImageModalOpen, setIsImageModalOpen] = useState(false);

    const handleViewImages = (images) => {
        setSelectedImages(images);
        setIsImageModalOpen(true);
    };

    const imageBodyTemplate = (rowData) => {
        return (
            <div>
                <Eye onClick={() => handleViewImages(rowData.Images)} className="cursor-pointer text-black"/>
            </div>
        );
    };

    const edittemplateBody = (rowData) => {
        return (
            <>
              <div className="flex gap-3">
                <div title="Edit Details">
                    <i className="fi fi-sr-pen-circle text-xl text-green-500 cursor-pointer" onClick={() => editform(rowData)}></i>
                </div>
                <div title="Delete this record">
                    <i className="fi fi-sr-trash text-xl text-red-500 cursor-pointer" onClick={() => confirm(rowData._id)}></i>
                </div>
              </div>
            </>
        );
    };

    const columns = [
        { header: 'Action', body: edittemplateBody },
        { field: 'Images', header: 'Images', body: imageBodyTemplate },
        { field: 'Product_Name', header: 'Product Name', filter: true },
        { field: 'Description', header: 'Description', filter: true },
        { field: 'Material_care', header: 'Material Care' },
        { field: 'Category', header: 'Category' },
        { field: 'Subcategory', header: 'Subcategory' },
        { field: 'Regular_Price', header: 'Regular Price' },
        { field: 'Discount', header: 'Discount' },
        { field: 'Sale_Price', header: 'Sale Price' },
        { field: 'Stock', header: 'Stock' },
        { field: 'Status', header: 'Status' },
    ];

    return (
        <>
            <DataTable value={tableData} scrollable scrollHeight="680px" className="!text-sm border border-gray-200 rounded">
                {columns.map((col, i) => (
                    col.formattype === 'array' ? (
                        <Column key={i} header={col.header} field={col.field} style={{ minWidth: col.width }} filter={col.filter} body={array}  headerClassName="text-gray-700 bg-gray-50"/>
                    ) : (
                        <Column key={i} field={col.field} header={col.header} body={col.body} filter={col.filter} headerClassName="text-gray-700 bg-gray-50" />
                    )
                ))}
            </DataTable>

            <Dialog header="Product Images" visible={isImageModalOpen} style={{ width: "60vw" }} modal onHide={() => setIsImageModalOpen(false)}>
                <div className="flex flex-wrap gap-4 justify-center">
                    {selectedImages.length > 0 ? (
                        selectedImages.map((img, idx) => (
                            <img key={idx} src={`${apiurl()}/${img}`} alt={`product-${idx}`} className="w-40 h-40 object-contain border rounded-lg shadow"/>
                        ))
                    ) : (
                        <p>No images available</p>
                    )}
                </div>
            </Dialog>
        </>
    )
}