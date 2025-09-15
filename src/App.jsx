import { Toaster } from "react-hot-toast";
import Approuter from "./router/Approuter"
import { PrimeReactProvider } from 'primereact/api';

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
