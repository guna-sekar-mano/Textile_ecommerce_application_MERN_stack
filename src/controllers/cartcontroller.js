import { Cart } from "../models/cartmodel.js";


export const savecart = async (req, res, next) => {
    try {
      const resdata = await new Cart(req.body).save()
      res.send(resdata)
    } catch (err) {
      console.error(err)
    }
  }

  export const getAllCart = async (req, res, next) => {
    try {
      const { Email } = req.query;
      const response = await Cart.find({ Email }).populate('productId');
      const totalLength = response.length;
      res.send({ response, totalLength });
    } catch (err) {
      console.error(err);
      res.send({ message: 'Error fetching wishlist items' });
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