import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { useState } from 'react';
import { FilterMatchMode, FilterOperator } from 'primereact/api';

export default function Tableview (props) {

    const { tabledata, editfrom, handledelete, cusfilter, loading } = props;
    const [filters, setFilters] = useState({
        Brand_Name: { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
        Color: { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
        Status: { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
    });

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return '-';
        
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun','Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        
        const day = date.getDate();
        const month = months[date.getMonth()];
        const year = date.getFullYear();
        
        return `${day} ${month} ${year}`;
        } catch (error) {
        return '-';
        }
    };

    const formatCustomers = (customers) => {
        if (!customers || !Array.isArray(customers) || customers.length === 0) {
        return '-';
        }
        return customers.join(', ');
    };

    const bodyTemplate = (field) => (rowData) => {
        const value = rowData[field];
        return value !== null && value !== undefined && value !== '' ? value : '-';
    };

    const dateBodyTemplate = (field) => (rowData) => {
        return formatDate(rowData[field]);
    };

    const customerBodyTemplate = (rowData) => {
        return formatCustomers(rowData.Customer);
    };

    const actionbotton = (rowData) => {
        return (
        <div className="flex gap-2">
            <button onClick={() => editfrom(rowData)}>
            <i className="fi fi-sr-pen-circle text-xl text-green-500 cursor-pointer"></i>
            </button>
            <button onClick={() => handledelete(rowData?._id)}>
            <i className="fi fi-sr-trash text-xl text-red-500 cursor-pointer"></i>
            </button>
        </div>
        );
    };

    const filterapply = (e) => {
        return (
        <>
            <button onClick={() => cusfilter(e.field, e.filterModel.constraints[0].value)}>Apply</button>
        </>
        );
    };

    const filterclear = (e) => {
        return (
        <>
            <button onClick={() => {
            e.filterModel.constraints[0].value = null;
            cusfilter(e.field, '');
            }}>Clear</button>
        </>
        );
    };

    const columns = [
        { field: 'Coupon_Name', header: 'Coupon Name', body: bodyTemplate('Coupon_Name') },
        { field: 'Coupon_Code', header: 'Coupon Code', body: bodyTemplate('Coupon_Code') },
        { field: 'Coupon_Type', header: 'Coupon Type', body: bodyTemplate('Coupon_Type') },
        { field: 'Target_Users', header: 'Target Users', body: bodyTemplate('Target_Users') },
        { field: 'Minimum_Amount', header: 'Minimum Amount', body: bodyTemplate('Minimum_Amount') },
        { field: 'Discount_Type', header: 'Discount Type', body: bodyTemplate('Discount_Type') },
        { field: 'Flat_Percentage', header: 'Flat Percentage', body: bodyTemplate('Flat_Percentage') },
        { field: 'Flat_Discount', header: 'Flat Discount', body: bodyTemplate('Flat_Discount') },
        { field: 'Customer', header: 'Customer', body: customerBodyTemplate },
        { field: 'Total_Usage_Limit', header: 'Total Usage Limit' },
        { field: 'Valid_From', header: 'Valid From', body: dateBodyTemplate('Valid_From') },
        { field: 'Valid_To', header: 'Valid To', body: dateBodyTemplate('Valid_To') },
        { field: 'Status', header: 'Status', filter: true, filterMatchMode: "custom", filterFunction: cusfilter, body: bodyTemplate('Status') }
    ];

    return (
        <>
        <div>
            <div>
                <DataTable value={tabledata} scrollable loading={loading} scrollHeight="680px" className='!text-sm' filters={filters} stateStorage="session" stateKey="dt-state-demo-local">
                <Column header="Action" body={actionbotton} />
                {columns.map((col, i) => (
                    <Column key={i} field={col.field} filterApply={filterapply} filterClear={filterclear} filter={col.filter} filterElement={col.filterElement} header={col.header}
                    body={col.body}
                    />
                ))}
                </DataTable>
            </div>
        </div>
        </>
    )
}