import { Link, useNavigate } from "react-router-dom";
import useAuth from "../../shared/services/store/useAuth";
import { useEffect, } from "react";

export default function Topbar ({toggleSidebar}) {

    const { logout, userdetails } = useAuth();
    const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getDisplayLetter = () => {
    if (userdetails?.Role === 'Admin') {
      return userdetails.Username?.charAt(0).toUpperCase();
    } else{
    return userdetails?.First_Name?.charAt(0).toUpperCase();
    }
  };
  const toggleFullscreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      document.documentElement.requestFullscreen();
    }
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'F12') {
        toggleFullscreen();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);


    return (
        <>
        <header className="sticky top-0 inset-x-0 flex flex-wrap sm:justify-start sm:flex-nowrap z-[48] w-full bg-white border-b text-sm py-2.5 sm:py-4 lg:ps-64">
     <button
          onClick={toggleSidebar}
          className="items-center justify-center hidden p-2 rounded-lg lg:flex hover:bg-gray-100"
      >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
      </button>
      <nav className="flex items-center w-full px-4 mx-auto basis-full sm:px-6" aria-label="Global">
        <div className="me-5 lg:me-0 lg:hidden">
          <a className="flex-none inline-block text-xl font-semibold rounded-xl focus:outline-none focus:opacity-80" aria-label="Preline">
            Extreme Culture
          </a>

        </div>

        <div className="flex items-center justify-end w-full ms-auto sm:justify-between sm:gap-x-3 sm:order-3">
          <div className="sm:hidden">
            <button type="button" className="w-[2.375rem] h-[2.375rem] inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-full border border-transparent text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none ">
              <svg className="flex-shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
            </button>
          </div>

          <div className="hidden sm:block">
            <label htmlFor="icon" className="sr-only">Search</label>
            <div className="relative min-w-72 md:min-w-80">
              <div className="absolute inset-y-0 z-20 flex items-center pointer-events-none start-0 ps-4">
                <svg className="flex-shrink-0 text-gray-400 size-4 " xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
              </div>
              <input type="text" id="icon" name="icon" className="block w-full px-4 py-3 text-sm bg-gray-100 border-gray-200 outline-none rounded-xl ps-11 disabled:opacity-50 disabled:pointer-events-none" placeholder="Search" />
            </div>
          </div>

          <div className="flex flex-row items-center justify-end gap-4">
            
          <button type="button" onClick={toggleFullscreen} className="w-[2.375rem] h-[2.375rem] inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-full border border-transparent text-gray-500 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none ">
              <i className="mt-2 text-xl fi fi-rs-expand"></i>
            </button>


            <div className="hs-dropdown [--placement:bottom-right] relative inline-flex">
                      <button 
                className="w-[2.375rem] h-[2.375rem] inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-full border border-transparent text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none"
              >
                {userdetails ? (
                  <div className="inline-flex items-center justify-center w-[38px] h-[38px] rounded-full bg-black ring-2 ring-white">
                    <span className="text-lg font-bold text-white">
                      {getDisplayLetter()}
                    </span>
                  </div>
                ) : (
                  <div className="inline-flex items-center justify-center w-[38px] h-[38px] rounded-full bg-gray-100 ring-2 ring-white">
                    <i className="text-xl text-gray-500 fi fi-rr-user"></i>
                  </div>
                )}
              </button>

              <div className="hs-dropdown-menu transition-[opacity,margin] duration hs-dropdown-open:opacity-100 opacity-0 hidden min-w-60 bg-white shadow-md p-2  " aria-labelledby="hs-dropdown-with-header">
                <div className="px-5 py-3 -m-2  bg-gray-700">
                  <p className="text-sm text-white ">Signed in as</p>
                    <p className="text-sm font-semibold text-white ">{userdetails?.Username}</p>
                </div>
                <div className="py-2 mt-2 first:pt-0 last:pb-0">

                 
                  <Link to="/" className="flex  items-center gap-x-3.5 py-2 px-3  text-sm text-gray-800 hover:bg-gray-100 focus:ring-2 focus:ring-blue-500 cursor-pointer  ">
                  <i className="mt-1 fi fi-br-house-window"></i>
                    Home
                  </Link>
                  <a onClick={handleLogout} className="flex  items-center gap-x-3.5 py-2 px-3  text-sm text-gray-800 hover:bg-gray-100 focus:ring-2 focus:ring-blue-500 cursor-pointer  ">
                    <i className="mt-1 fi fi-ts-arrow-left"></i>
                    Logout
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
        </>
    )
}