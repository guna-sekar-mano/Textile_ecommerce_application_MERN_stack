import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";

export default function Tableview ({tableData, editform, confirm, activeTab}) {

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

    const getFieldLabel = (fieldKey) => {
        const labels = {
            // 'Category': 'Category',
            // 'Subcategory': 'Subcategory',
            'tags': 'Tags',
            'sizes': 'Sizes',
            'gender': 'Gender',
            'Product_type': 'Product Type',
            'Color': 'Color',
            // 'Header_menu': 'Header Menu'
        };
        return labels[fieldKey] || fieldKey;
    };

    const colorBody = (rowData) => {
        if (activeTab !== 'Color') return null;
        
        return (
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded border border-gray-300" style={{ backgroundColor: rowData.color_code }}title={rowData.color_code} ></div>
                <span>{rowData.Color}</span>
            </div>
        );
    };

    const headerMenuBody = (rowData) => {
        if (activeTab !== 'Header_menu') return null;
        
        return (
            <div className="text-sm">
                <div><strong>Title:</strong> {rowData.main_title}</div>
                <div><strong>Subtitle:</strong> {rowData.subtitle}</div>
                <div><strong>Collections:</strong> {rowData.collection_names}</div>
            </div>
        );
    };

    const getColumns = () => {
        if (activeTab === 'Color') {
            return [
                { header: 'Action', body: edittemplateBody },
                { header: 'Color', body: colorBody },
                { field: 'color_code', header: 'Color Code' },
                { field: 'Status', header: 'Status' },
            ];
        } else {
            return [
                { header: 'Action', body: edittemplateBody },
                { field: activeTab, header: getFieldLabel(activeTab) },
                { field: 'Status', header: 'Status' },
            ];
        }
    };

    const columns = getColumns();

    return (
        <>
        <DataTable value={tableData?.resdata || tableData}  scrollable scrollHeight="680px" className="!text-sm border border-gray-200 rounded" emptyMessage={`No ${getFieldLabel(activeTab).toLowerCase()} data found`}>
            {columns.map((col, i) => (
                col.header === 'S.No' ?(
                    <Column key={index} field={col.field} header={col.header} body={(rowData,{rowIndex})=>Sno(rowIndex)} headerClassName="text-gray-700 bg-gray-50" />
                ):
                <Column key={i} field={col.field} header={col.header} body={col.body} filter={col.filter} headerClassName="text-gray-700 bg-gray-50 font-semibold" className="border-b border-gray-100"/>
            ))}
        </DataTable>
        </>
    )
}