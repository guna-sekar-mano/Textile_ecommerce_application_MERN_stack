import { Cart } from "../models/cartmodel.js";



export const savecart = async (req, res, next) => {
    try {
        const { productId, variantId, ...otherData } = req.body;
        
        const cartData = {
            ...otherData,
            productId: productId, // Always store the main product ID
            variantId: variantId || null
        };
        
        const resdata = await new Cart(cartData).save();
        res.send(resdata);
    } catch (err) {
        console.error(err);
        res.status(500).send({ message: 'Error saving cart item' });
    }
};

export const getAllCart = async (req, res, next) => {
  try {
    const { Email } = req.query;
    
    const response = await Cart.find({ Email }).populate('productId');
    
    const processedResponse = response.map(item => {
      const itemObj = item.toObject();
      if (itemObj.variantId && itemObj.productId && itemObj.productId.variants) { 
        const variant = itemObj.productId.variants.find(v => v._id.toString() === itemObj.variantId.toString() );
        if (variant) {
          itemObj.variantData = variant;
        }
      }
      
      return itemObj;
    });
    
    const totalLength = processedResponse.length;
    res.send({ response: processedResponse, totalLength });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: 'Error fetching cart items' });
  }
};

  export const updateCart = async (req, res, next) => {
    try {
      const { productId, Quantity, Email } = req.body;
      const updatedCartItem = await Cart.findOneAndUpdate({ _id: productId, Email },{ $set: { Quantity } },{ new: true });
      if (!updatedCartItem) {return res.send({ message: 'Cart item not found.' });}
      res.send({ message: 'Quantity updated successfully', updatedCartItem });
    } catch (error) {
      console.error('Error updating Cart quantity:', error);
      res.send({ message: 'An error occurred while updating quantity' });
    }
  };

  export const deletecartone = async (req, res, next) => {
    try {
        const { _id } = req.query; 
        const resdata = await Cart.deleteOne({ _id });
        res.send({ message: 'Wishlist deleted successfully', resdata });
      } catch (err) {
        console.error(err);
        res.send({ message: 'An error occurred while deleting the wishlist item' });
      }
    };
    
  
  export const deleteAllcart = async (req, res, next) => {
    try {
        const { Email } = req.user; 
        console.log(Email)
        const resdata = await Cart.deleteMany({ Email });
        res.send({ message: 'All wishlist items deleted successfully', resdata });
      } catch (err) {
        console.error(err);
        res.send({ message: 'An error occurred while deleting all wishlist items' });
      }
    };