export default function Tableheadpanel ({setGlobalFilter, globalFilter,clearFilter}) {

    return (
        <>
         <div className="flex flex-col md:items-center md:justify-between md:flex-row">
            <div><h2 className="mb-2 text-2xl font-bold md:mb-0">Newsletter Emails</h2></div>
            <div className="flex items-center gap-4">
                <div className="relative min-w-64 md:min-w-80 flex items-center">
                    <div className="absolute inset-y-0 z-20 flex items-center pointer-events-none start-0 ps-4">
                        <svg className="flex-shrink-0 text-gray-400 size-4 " xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
                    </div>
                    <input onChange={(e) => setGlobalFilter(e.target.value)} value={globalFilter} type="text" id="icon" name="icon" className="block w-full px-4 py-3 text-sm border border-gray-200 outline-none ps-11 disabled:opacity-50 disabled:pointer-events-none" placeholder="Search Emails ..." />
                    <button onClick={clearFilter} className="flex items-center gap-1 px-4 py-2.5 text-sm  shadow-sm bg-black text-white cursor-pointer">
                        <i className="fi fi-rr-clear-alt pt-1"></i>
                    </button>
                </div>
            </div>
        </div>
        </>
    )
}