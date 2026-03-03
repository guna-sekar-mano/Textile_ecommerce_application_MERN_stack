import { useState } from "react";
import Tableheadpanel from "../shared/components/Shipping/Tableheadpanel";
import AddandEditform from "../shared/components/Shipping/Addandeditform";

export default function Shippingcalculationspage () {

    const [visible, setVisible] = useState(false);
    const [formdata,setFormdata]=useState({});

    const newform=()=>{
        setVisible(true);
        setFormdata({});
    }

    const handlechange = (e) => {
        const { name, value } = e.target;
        setFormdata(prev => ({...prev,[name]: value}));
    }

    return (
        <>
            <Tableheadpanel newform={newform} />
            <AddandEditform visible={visible} setVisible={setVisible} formdata={formdata} handlechange={handlechange} />
        </>
    )
}