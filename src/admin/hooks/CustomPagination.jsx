import { Paginator } from "primereact/paginator";

export default function Cuspagination({ first, rows, totalRecords, onPage }) {
    const onPageChange = (event) => {
        onPage(event);
    };

    return (
        <div className="card">
            <Paginator
                first={first}
                rows={rows} 
                totalRecords={totalRecords || 0}
                rowsPerPageOptions={[10, 20, 30]}
                onPageChange={onPageChange}
            />
        </div>
    );
}