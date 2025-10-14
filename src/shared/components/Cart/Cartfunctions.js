import toast from "react-hot-toast";
import { deleteAllcartItems, deletecartItem, getcartItems, updatecartItem } from "../../services/apicart/apicart";

let isLoadingCart = false;

const getSizeData = (item) => {
    let sizes = null;
    
    if (item.variantData && item.variantData.sizes) {
        sizes = item.variantData.sizes;
    }
    else if (item.sizes && Array.isArray(item.sizes)) {
        sizes = item.sizes;
    }
    else if (item.productId && item.productId.variants && item.variantId) {
        const variant = item.productId.variants.find(v => v._id === item.variantId);
        if (variant && variant.sizes) {
            sizes = variant.sizes;
        }
    }
    else if (item.variant_images || item.variant_name) {
        sizes = item.sizes;
    }
    
    if (!sizes) {
        console.error("Could not find size data for item:", item);
        return null;
    }
    
    const sizeData = sizes.find(s => s.size === item.selectedSize);
    return sizeData;
};

export const handleIncreaseQuantity = async (index, cart, userdetails, setCartItems, item) => {
    try {
        if (index < 0 || index >= cart.length) return;
        const cartItem = item || cart[index];
        if (!cartItem) return;


        const sizeData = getSizeData(cartItem);
        
        if (!sizeData) {
            toast.error("Unable to verify stock for this item.");
            console.error("No size data found for item:", cartItem);
            return;
        }

        console.log("Size data found:", sizeData);

        const currentQuantity = Number(cartItem?.Quantity) || 1;
        const availableStock = sizeData.Stock || 0;

        if (availableStock >= currentQuantity) {
            const updatedQuantity = currentQuantity + 1;

            await updatecartItem(cartItem._id, updatedQuantity, userdetails?.Email);
            const newCart = [...cart];
            newCart[index] = { ...cartItem, Quantity: updatedQuantity };
            setCartItems(newCart);
            
            toast.success("Quantity updated successfully!");
        } else {
            toast("Sorry, you've reached the maximum stock limit for this item.");
            return;
        }
    } catch (error) {
        console.error("Error updating quantity:", error);
        toast.error("Failed to update quantity. Please try again.");
    }
};

export const handleDecreaseQuantity = async (index, cart, userdetails, setCartItems) => {
    if (index < 0 || index >= cart.length) return;
    const item = cart[index];
    if (!item) return;
    const currentQuantity = Number(item?.Quantity) || 1;
    if (currentQuantity <= 1) return;
    const updatedQuantity = currentQuantity - 1;
    try {
        await updatecartItem(item._id, updatedQuantity, userdetails?.Email);
        const newCart = [...cart];
        newCart[index] = { ...item, Quantity: updatedQuantity };
        setCartItems(newCart);
        toast.success("Quantity updated successfully!");
    } catch (error) {
        console.error("Error updating quantity:", error);
        toast.error("Failed to update quantity. Please try again.");
    }
};

export const handleRemoveItem = async (productId, removeFromCart) => {
    try {
        await deletecartItem(productId);
        removeFromCart(productId);
        toast.success("Item removed from cart!");
    } catch (error) {
        console.error("Error removing cart item:", error);
        toast.error("Failed to remove item. Please try again.");
    }
};

export const handleClearCart = async (userdetails, clearCart) => {
    try {
        if (!userdetails?.Email) {
            console.error("No user email found");
            return;
        }
        await deleteAllcartItems(userdetails.Email);
        clearCart();
        toast.success("Cart cleared successfully!");
    } catch (error) {
        console.error("Error clearing cart:", error);
        toast.error("Failed to clear cart. Please try again.");
    }
};

export const getallcart = async (userdetails, cart, setCartItems) => {
    try {
        if (!userdetails?.Email) {
            console.error("No user email found");
            return;
        }

        if (isLoadingCart) {
            console.log("Cart is already loading, skipping...");
            return;
        }

        isLoadingCart = true;
        const response = await getcartItems(userdetails?.Email);
        
        if (response && response.response) {
            const hasChanges = !cart || cart.length !== response.response.length || 
                cart.some((item, index) => {
                    const apiItem = response.response[index];
                    return !apiItem || item._id !== apiItem._id || item.Quantity !== apiItem.Quantity || item.selectedSize !== apiItem.selectedSize;
                });

            if (hasChanges) {
                setCartItems(response.response);
            }
        }
    } catch (error) {
        console.error("Error fetching cart items:", error);
    } finally {
        isLoadingCart = false;
    }
};