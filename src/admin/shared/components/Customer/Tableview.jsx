import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";

export default function Tableview ({tableData}) {

    const columns = [
        { field: 'First_Name', header: 'First Name', filter: true },
        { field: 'Last_Name', header: 'Last Name', filter: true },
        { field: 'Email', header: 'Email' },
        { field: 'Mobilenumber', header: 'Mobilenumber' },
        { field: 'Role', header: 'Role' },
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
        </>
    )
}