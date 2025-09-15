import { deleteAllcartItems, deletecartItem, getcartItems, updatecartItem } from "../../services/apicart/apicart";

export const handleIncreaseQuantity = async (index, cart, userdetails, setCartItems) => {
    if (index < 0 || index >= cart.length) return;

    const item = cart[index];
    if (!item) return;

    const currentQuantity = Number(item?.Quantity) || 1;
    const updatedQuantity = currentQuantity + 1;

    try {
        await updatecartItem(item._id, updatedQuantity, userdetails?.Email);
        const newCart = [...cart];
        newCart[index] = { ...item, Quantity: updatedQuantity };
        setCartItems(newCart);
    } catch (error) {
        console.error("Error updating quantity:", error);
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
    } catch (error) {
        console.error("Error updating quantity:", error);
    }
};

export const handleRemoveItem = async (productId, removeFromCart) => {
    try {
        await deletecartItem(productId);
        removeFromCart(productId);
    } catch (error) {
        console.error("Error removing cart item:", error);
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
    } catch (error) {
        console.error("Error clearing cart:", error);
    }
};

export const getallcart = async (userdetails, cart, setCartItems) => {
    try {
        if (!userdetails?.Email) {
            console.error("No user email found");
            return;
        }
        
        const response = await getcartItems(userdetails?.Email);
        
        if (response && response.response) {
            if (JSON.stringify(cart) !== JSON.stringify(response.response)) {
                setCartItems(response.response);
            }
        }
    } catch (error) {
        console.error("Error fetching cart items:", error);
    }
};