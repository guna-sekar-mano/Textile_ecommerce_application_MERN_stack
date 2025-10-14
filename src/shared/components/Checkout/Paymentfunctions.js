import { deleteAllcartItems } from '../../services/apicart/apicart';
import toast from 'react-hot-toast';
import { apiPaymentDone } from '../../services/apiorder/apiorder';

export const useOrderHandlers = (cart, userdetails, clearCart, setCartItems, navigate) => {
    
    const generateOrderId = () => {
        return `ORD${Date.now()}${Math.floor(Math.random() * 1000)}`;
    };

    const createOrder = async (selectedAddress, total) => {
        try {
            if (!selectedAddress) {
                toast.error('Please select or add shipping address');
                return;
            }

            if (!total || total <= 0) {
                toast.error('Invalid order amount');
                return;
            }

            if (!cart || cart.length === 0) {
                toast.error('Your cart is empty');
                return;
            }

            const orderId = generateOrderId();

            const orderData = {
                Order_id: orderId,
                Total_Amount: total,
                Billing_Name: `${selectedAddress.First_Name} ${selectedAddress.Last_Name}`.trim(),
                Email: userdetails?.Email,
                Mobilenumber: selectedAddress.Mobilenumber,
                Delivery_Address: `${selectedAddress.Address}, ${selectedAddress.City} - ${selectedAddress.Zipcode}, ${selectedAddress.State}`.trim(),
                City: selectedAddress.City,
                State: selectedAddress.State,
                Country: selectedAddress.Country || 'India',
                Zipcode: selectedAddress.Zipcode,
                Delivery_Address_id: selectedAddress._id,
                Payment_Status: "Not Paid",
                Order_Status: "Order Placed"
            };

            const orderItems = cart.map(item => {
                const productData = getProductData(item);
                console.log(item,productData)
                return {
                    Order_id: orderId,
                    productId: item.productId?._id || item.productId,
                    variantId: item.variantId || null,
                    Product_Name: productData.name,
                    variant_name: item.variantId ? productData.variant_name : null,
                    // Images: productData.images,
                    Images: item.variantId ? productData.variant_images : null,
                    price: productData.price.toString(),
                    sale_price: productData.sale_price ? productData.sale_price.toString() : null,
                    selectedSize: item.selectedSize,
                    Quantity: Number(item.Quantity),
                    Category: item.productId?.Category || item.Category,
                    Subcategory: item.productId?.Subcategory || item.Subcategory,
                    Product_type: item.productId?.Product_type || item.Product_type,
                    tags: item.productId?.tags || item.tags
                };
            });

            const completeOrderData = {
                orderData: orderData,
                orderItems: orderItems
            };

            const saveResponse = await apiPaymentDone(completeOrderData);

            if (saveResponse.success || saveResponse.message === "Order saved successfully") {
                
                try {
                    await deleteAllcartItems(userdetails?.Email);
                    clearCart();
                    setCartItems([]);
                } catch (cartError) {
                    console.error('Error clearing cart:', cartError);
                }

            } else {
                throw new Error(saveResponse.message || 'Failed to place order');
            }

        } catch (error) {
            console.error('Order creation error:', error);
            toast.error(error.response?.data?.message || error.message || 'Failed to place order. Please try again.');
        }
    };

    const getProductData = (item) => {
        let productData = {
            name: "Unknown Product",
            images: [],
            variant_images: null,
            variant_name: null,
            price: 0,
            sale_price: null
        };

        if (item.variantId) {
            if (item.variant_name || item.variant_images) {
                productData.name = item.variant_name || item.Product_Name;
                productData.variant_name = item.variant_name;
                productData.images = item.productId?.Images || [];
                productData.variant_images = item.variant_images || [];
                
                const selectedSizeData = item.sizes?.find(sizeObj => sizeObj.size === item.selectedSize);
                if (selectedSizeData) {
                    productData.price = Number(selectedSizeData.price) || 0;
                    productData.sale_price = selectedSizeData.sale_price && selectedSizeData.sale_price !== "0" && selectedSizeData.sale_price !== "" ? Number(selectedSizeData.sale_price) : null;
                } else {
                    productData.price = Number(item.price) || Number(item.sale_price) || 0;
                    productData.sale_price = item.sale_price ? Number(item.sale_price) : null;
                }
            } 
            else if (item.variantData) {
                productData.name = item.variantData.variant_name;
                productData.variant_name = item.variantData.variant_name;
                productData.images = item.productId?.Images || [];
                productData.variant_images = item.variantData.variant_images || [];
                
                const selectedSizeData = item.variantData.sizes?.find(sizeObj => sizeObj.size === item.selectedSize);
                if (selectedSizeData) {
                    productData.price = Number(selectedSizeData.price) || 0;
                    productData.sale_price = selectedSizeData.sale_price && selectedSizeData.sale_price !== "0" && selectedSizeData.sale_price !== "" ? Number(selectedSizeData.sale_price) : null;
                } else {
                    productData.price = Number(item.variantData.price) || Number(item.variantData.sale_price) || 0;
                    productData.sale_price = item.variantData.sale_price ? Number(item.variantData.sale_price) : null;
                }
            } 
            else if (item.productId?.variants) {
                const variant = item.productId.variants.find(v => v._id === item.variantId);
                if (variant) {
                    productData.name = variant.variant_name;
                    productData.variant_name = variant.variant_name;
                    productData.images = item.productId.Images || [];
                    productData.variant_images = variant.variant_images || [];
                    
                    const selectedSizeData = variant.sizes?.find(sizeObj => sizeObj.size === item.selectedSize);
                    if (selectedSizeData) {
                        productData.price = Number(selectedSizeData.price) || 0;
                        productData.sale_price = selectedSizeData.sale_price && selectedSizeData.sale_price !== "0" && selectedSizeData.sale_price !== "" ? Number(selectedSizeData.sale_price) : null;
                    } else {
                        productData.price = Number(variant.price) || Number(variant.sale_price) || 0;
                        productData.sale_price = variant.sale_price ? Number(variant.sale_price) : null;
                    }
                }
            }
        } 
        else if (item.productId) {
            productData.name = item.productId.Product_Name;
            productData.images = item.productId.Images || [];
            
            const selectedSizeData = item.productId.sizes?.find(sizeObj => sizeObj.size === item.selectedSize);
            if (selectedSizeData) {
                productData.price = Number(selectedSizeData.price) || 0;
                productData.sale_price = selectedSizeData.sale_price && selectedSizeData.sale_price !== "0" && selectedSizeData.sale_price !== "" ? Number(selectedSizeData.sale_price) : null;
            } else {
                productData.price = Number(item.productId.price) || Number(item.productId.sale_price) || 0;
                productData.sale_price = item.productId.sale_price ? Number(item.productId.sale_price) : null;
            }
        } 
        else if (item.Product_Name || item.variant_name) {
            productData.name = item.Product_Name || item.variant_name;
            productData.images = item.Images || [];
            productData.variant_images = item.variant_images || null;
            productData.variant_name = item.variant_name || null;
            
            const selectedSizeData = item.sizes?.find(sizeObj => sizeObj.size === item.selectedSize);
            if (selectedSizeData) {
                productData.price = Number(selectedSizeData.price) || 0;
                productData.sale_price = selectedSizeData.sale_price && selectedSizeData.sale_price !== "0" && selectedSizeData.sale_price !== "" ?  Number(selectedSizeData.sale_price) : null;
            } else {
                productData.price = Number(item.price) || Number(item.sale_price) || 0;
                productData.sale_price = item.sale_price ? Number(item.sale_price) : null;
            }
        }

        return productData;
    };

    return { createOrder };
};