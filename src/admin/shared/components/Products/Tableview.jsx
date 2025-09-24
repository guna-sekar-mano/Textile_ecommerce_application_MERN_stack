import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Dialog } from "primereact/dialog";
import { useState } from "react";
import apiurl from "../../../../shared/services/apiendpoint/apiendpoint";
import { Eye } from "lucide-react";
import { MultiSelect } from "primereact/multiselect";
import { Button } from "primereact/button";
import { getFilterOptions } from "../../services/apiproducts/apiproducts";

export default function Tableview (props) {
    const {tableData, editform, confirm, totalRecords, first, rows, onPage, cusfilter, tempFilterValues,setTempFilterValues, loading, Sort, setSort} = props;

    const [selectedImages, setSelectedImages] = useState([]);
    const [isImageModalOpen, setIsImageModalOpen] = useState(false);
    const [filterOptions,setFilterOptions] = useState({});

    const handleViewImages = (images) => {
        setSelectedImages(images);
        setIsImageModalOpen(true);
    };

    const handleApplyFilters = (key) => {
        cusfilter(key, tempFilterValues[key]);
        onPage({ first: 0, rows: rows });
    };

    const handleClearFilters = (key) => {
        setTempFilterValues(prev => ({ ...prev, [key]: null }));
        cusfilter(key, null);
        onPage({ first: 0, rows: rows });
    };

    const getOption = async (key)=>{
        var filterOptions = await getFilterOptions(key);
        setFilterOptions(filterOptions)
        console.log(filterOptions)
    }

    const onSort = (event) => {
        setSort({sortField: event?.sortField, sortOrder: event?.sortOrder});
    };

    const renderColumnFilter = (key) => (
        <div onClick={()=>getOption(key)}>
            <MultiSelect filter value={tempFilterValues[key]} options={filterOptions?.[key]} className="p-column-filter" virtualScrollerOptions={{ itemSize: 43 }} maxSelectedLabels={1}
                onChange={(e) => setTempFilterValues(prev => ({ ...prev, [key]: e.value }))} placeholder={`Select ${key?.charAt(0).toUpperCase() + key?.slice(1)}`} panelFooterTemplate={
                <div className="flex justify-between mt-2 p-2">
                    <button label="Clear" onClick={() => handleClearFilters(key)} className="flex items-center text-center justify-center gap-1 px-4 py-2.5 text-sm w-[45%] shadow-sm bg-black text-white cursor-pointer" >
                        Clear
                    </button>
                    <button label="Apply" onClick={() => handleApplyFilters(key)} className="flex items-center text-center justify-center gap-1 px-4 py-2.5 text-sm w-[45%] shadow-sm bg-black text-white cursor-pointer" >
                        Apply
                    </button>
                </div>
            } />
        </div>
    );

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
        { field: 'Images', header: 'Images', formattype: 'image' },
        { field: 'Product_Name', header: 'Product Name', filter: true },
        // { field: 'Description', header: 'Description', filter: true },
        { field: 'Product_type', header: 'Product type', filter: true },
        { field: 'gender', header: 'Gender', filter: true },
        { field: 'Category', header: 'Category', filter: true },
        // { field: 'Regular_Price', header: 'Regular Price' },
        // { field: 'Discount', header: 'Discount' },
        // { field: 'Sale_Price', header: 'Sale Price' },
        // { field: 'Stock', header: 'Stock' },
        { field: 'status', header: 'Status', filter: true },
    ];

    const img = (rowData) => {
        return (
            <div>  
                {rowData.variants[0].variant_images && rowData.variants[0].variant_images.length > 0 ? (
                    <img src={`${apiurl()}/${rowData.variants[0].variant_images[0]}`} alt="product" className="w-30 h-30 object-contain rounded"/>
                ) : (
                    <span>No Image</span>
                )}
            </div>
        );
    }

    return (
        <>
            <DataTable value={tableData} totalRecords={totalRecords} scrollable lazy rows={rows} first={first} scrollHeight="calc(100vh - 320px)"
                className="!text-sm border border-gray-200 rounded" onSort={onSort} sortField={Sort.sortField} sortOrder={Sort.sortOrder}>
                {columns.map((col, i) => {
                    return(
                    col.formattype === 'image' ? (
                        <Column key={i} header={col.header} field={col.field} style={{ minWidth: col.width }} body={img} headerClassName="text-gray-700 bg-gray-50"/>
                    ):
                    col.formattype === 'array' ? (
                        <Column key={i} header={col.header} field={col.field} style={{ minWidth: col.width }} body={array} filter={col.filter} filterElement={renderColumnFilter(col.field)}
                            showFilterMenuOptions={false} showFilterMatchModes={false} showApplyButton={false} showClearButton={false} sortable headerClassName="text-gray-700 bg-gray-50"/>
                    ) : (
                        <Column key={i} field={col.field} header={col.header} body={col.body} filter={col.filter} filterElement={renderColumnFilter(col.field)}
                            showFilterMenuOptions={false} showFilterMatchModes={false} showApplyButton={false} showClearButton={false} sortable headerClassName="text-gray-700 bg-gray-50" />
                    )
                )})}
            </DataTable>

            <Dialog header="Product Images" visible={isImageModalOpen} style={{ width: "60vw" }} modal onHide={() => setIsImageModalOpen(false)}>
                <div className="flex flex-wrap gap-4 justify-center">
                    {selectedImages.length > 0 ? (
                        selectedImages.map((img, i) => (
                            <img key={i} src={`${apiurl()}/${img}`} alt={`product-${i}`} className="w-40 h-40 object-contain border rounded-lg shadow"/>
                        ))
                    ) : (
                        <p>No images available</p>
                    )}
                </div>
            </Dialog>
        </>
    )
}