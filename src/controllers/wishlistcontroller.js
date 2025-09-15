import Wishlist from "../models/wishlistmodel.js"

export const saveitems = async (req, res, next) => {
  try {
    const response = await new Wishlist (req.body).save()
    console.log(response)
    res.status(200).send(response)
  } catch (err) {
    console.log(err)
  }
}

export const getAllitems = async (req, res, next) => {
  try {
    const{Email}=req.user
    const response = await Wishlist.find({ Email })
    const totallength = response.length
    res.status(200).send({ response, totallength })
  } catch (err) {
    console.log(err)
  }
}

export const updateitems = async (req, res, next) => {
  try {
    const { _id } = req.body
    // console.log(req.body)
    const resdata = await Wishlist.findOneAndUpdate({ _id },req.body, { new: true })
    res.send(resdata)
  } catch (err) {
    console.error(err)
  }
}
  
export const deleteOneitems = async (req, res, next) => {
  try {
    const { _id } = req.query
    const resdata = await Wishlist.deleteOne({ _id })
    res.send(resdata)
  } catch (err) {
    console.error(err)
  }
}

export const deleteAllitems = async (req, res, next) => {
  try {
    const{Email}=req.user
    const resdata = await Wishlist.deleteMany({ Email })
    res.send(resdata)
  } catch (err) {
    console.error(err)
  }
}