import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import apiurl from "../../../../shared/services/apiendpoint/apiendpoint";

export default function Tableview ({loading, tabledata, handledelete, editfrom }) {

      const edittemplateBody = (rowData) => {
        return (
            <div className="flex gap-3">
                <div title="Edit Details">
                    <i className="fi fi-sr-pen-circle text-xl text-green-500 cursor-pointer" onClick={() => editfrom(rowData)}></i>
                </div>
                <div title="Delete this record">
                    <i className="fi fi-sr-trash text-xl text-red-500 cursor-pointer" onClick={() => handledelete(rowData._id)}></i>
                </div>
            </div>
        );
    };

    const imageBodyTemplate = (rowData) => {
        if (!rowData.Images || rowData.Images.length === 0) {
            return <span>No Image</span>;
        }
        
        const imageUrl = `${apiurl()}/${rowData.Images[0]}`;
        
        return (
            <img src={imageUrl} alt="Category" className="w-12 h-12 object-cover rounded border"/>
        );
    };

    const categoryNameBodyTemplate = (rowData) => {
        return <span>{rowData.Banner_Name || 'N/A'}</span>;
    };

    const productsBodyTemplate = (rowData) => {
        if (!rowData.ProductId || rowData.ProductId.length === 0) {
            return <span>No Products</span>;
        }
        
        const productNames = rowData.ProductId.map(product => 
            typeof product === 'object' ? product.Product_Name : product
        );
        
        return (
            <div className="max-w-xs">
                {productNames.length <= 2 ? (
                    <span>{productNames.join(', ')}</span>
                ) : (
                    <div>
                        <span>{productNames.slice(0, 2).join(', ')}</span>
                        <span className="text-blue-500 cursor-pointer ml-1" 
                              title={productNames.join(', ')}>
                            +{productNames.length - 2} more
                        </span>
                    </div>
                )}
            </div>
        );
    };

    const statusBodyTemplate = (rowData) => {
        const isActive = rowData.Status === 'Active';
        return (
            <span className={`px-2 py-1 rounded text-xs font-medium ${ isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {rowData.Status || 'Inactive'}
            </span>
        );
    };

    const columns = [
        { header: 'Action', body: edittemplateBody,width: '120px',sortable: false },
        { field: 'Images', header: 'Image', body: imageBodyTemplate, width: '100px', sortable: false },
        { field: 'Banner_Name', header: 'Banner Name', body: categoryNameBodyTemplate, width: '200px', sortable: true},
        // { field: 'redirect_link', header: 'Redirect Link',  width: '200px'},
        // { field: 'ProductId', header: 'Products',body: productsBodyTemplate, width: '300px', sortable: false},
        { field: 'Status', header: 'Status', body: statusBodyTemplate, width: '120px', sortable: true }
    ];

    return (
        <>
        <DataTable value={tabledata || []} loading={loading} scrollable scrollHeight="680px" className="!text-sm border border-gray-200 rounded"
                emptyMessage="No categories found" stripedRows >
                {columns.map((col, i) => (
                    <Column key={i} field={col.field} header={col.header} body={col.body} sortable={col.sortable} style={{ minWidth: col.width }}
                        headerClassName="text-gray-700 bg-gray-50" />
                ))}
            </DataTable>
        </>
    )
}