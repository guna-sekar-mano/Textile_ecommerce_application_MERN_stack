import { deleteAllcartItems, deletecartItem } from '../../services/apicart/apicart';
import toast from 'react-hot-toast';
import { apiCreateOrder, apiPaymentDone } from '../../services/apiorder/apiorder';

export const usePaymentHandlers = (cart, userdetails, clearCart, setCartItems, onClose,navigate) => {
    const initializePayment = async (selectedAddress,total) => {
        try {
            if (!selectedAddress) {
                toast.error('Please select or add shipping address');
                return;
            }

            if (!total || total <= 0) {
                toast.error('Invalid order amount');
                return;
            }

            const orderData = {
                Total_Amount: total,
                Billing_Name: `${selectedAddress.First_Name} ${selectedAddress.Last_Name}`.trim(),
                Email: userdetails?.Email,
                Mobilenumber: selectedAddress.Mobilenumber,
                Delivery_Address: `${selectedAddress.Address}, ${selectedAddress.City} - ${selectedAddress.Zipcode}, ${selectedAddress.State}, ${selectedAddress.Country}`.trim(),
                City: selectedAddress.City,
                State: selectedAddress.State,
                Country: selectedAddress.Country,
                Zipcode: selectedAddress.Zipcode,
                Delivery_Address_id: selectedAddress._id,
                Payment_Status: "Pending",
                Order_Status: "Payment Pending",
                currency: "INR"
            };

            const orderResponse = await apiCreateOrder(orderData);
            
            if (!orderResponse?.data?.id) {
                toast.error('Failed to create order. Please try again.');
                return;
            }

            let paymentAttempted = false;

            razorpay.on('payment.failed', async function(response) {
                paymentAttempted = true;
                await handlePaymentFailure(orderData, orderResponse, response.error.description);
            });

            razorpay.open();

        } catch (error) {
            console.error('Payment initialization error:', error);
            toast.error(error.response?.data?.error || 'Failed to initialize payment');
        }
    };

    const handlePaymentSuccess = async (response, orderData, orderResponse) => {
        try {
            const orderItems = cart.map(item => ({
                First_Name: orderData.First_Name,
                Book_Name: item.productId.Book_Name,
                Book_image: item.productId.Book_image,
                Regular_Price: item.productId.Regular_Price,
                Discount: item.productId.Discount,
                Sale_Price: item.productId.Sale_Price,
                Quantity: item.Quantity
            }));

            const paymentData = {
                orderdata: {
                    ...orderData,
                    Order_id: orderResponse.data.receipt,
                    Payment_Status: "Paid",
                    Order_Status: "Confirmed"
                },
                ordermasterdata: orderItems
            };

            const saveResponse = await apiPaymentDone(paymentData);

            if (saveResponse.message === "Order saved successfully" || 
                saveResponse.message === "Order updated successfully") {
                toast.success('Payment successful and order placed!');
                await deletecartItem();
                await deleteAllcartItems();
                clearCart();
                setCartItems([]);
                onClose();
                navigate('/myorder');
            }
        } catch (error) {
            console.error('Error saving successful order:', error);
            toast.error('Payment successful but order saving failed');
        }
    };

    const handlePaymentFailure = async (orderData, orderResponse, errorMessage) => {
        try {
            const orderItems = cart.map(item => ({
                First_Name: orderData.First_Name,
                Book_Name: item.productId.Book_Name,
                Book_image: item.productId.Book_image,
                Regular_Price: item.productId.Regular_Price,
                Discount: item.productId.Discount,
                Sale_Price: item.productId.Sale_Price,
                Quantity: item.Quantity
            }));

            const paymentData = {
                orderdata: {
                    ...orderData,
                    Order_id: orderResponse.data.receipt,
                    Payment_Status: "Failed",
                    Order_Status: "Payment Failed",
                    failed_reason: errorMessage
                },
                ordermasterdata: orderItems
            };

            await apiPaymentDone(paymentData);
            toast.error(`Payment failed: ${errorMessage}`);
        } catch (error) {
            console.error('Error saving failed order:', error);
            toast.error('Failed to save order details');
        }
    };

    return {
        initializePayment
    };
};