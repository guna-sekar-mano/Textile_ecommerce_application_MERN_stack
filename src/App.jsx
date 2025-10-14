import { Toaster } from "react-hot-toast";
import Approuter from "./router/Approuter"
import { PrimeReactProvider } from 'primereact/api';
import "../node_modules/preline/dist/preline.js"


import { HSStaticMethods } from "preline";

HSStaticMethods.autoInit();
const observer = new MutationObserver((mutationsList) => {
    for (const mutation of mutationsList) {
      HSStaticMethods.autoInit();
    }
});

observer.observe(document.body, {
    attributes: true,
    subtree: true,
    childList: true,
    characterData: true,
});

function App() {

  return (
    <>
      <PrimeReactProvider>
        <Approuter/>
      </PrimeReactProvider>
      <Toaster position="top-center" reverseOrder={false} />
    </>
  )
}

export default App
