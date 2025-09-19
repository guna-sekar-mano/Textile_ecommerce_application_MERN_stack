import moment from "moment-timezone"
import { Order } from "../models/ordermodel.js";



export const uniqueorderid = async () => {
  var keyname = "EXTREMECULTURE"
  var getlastid;

  const currentyear = moment(new Date()).format('YYYY')
  const currentDate = moment()
  let yearform
  const aprilFirst = moment(currentyear + '-04-01', 'YYYY-MM-DD')

  if (currentDate.isBefore(aprilFirst)) {
    yearform = moment(new Date()).subtract(1, 'year').format('YY') + moment(new Date()).format('YY');
    const startDate = moment(new Date()).subtract(1, 'year').format('YYYY')+'-04-01';
    const endDate = moment(new Date()).format('YYYY')+'-03-31';
    getlastid = await Order.countDocuments({Order_Date:{$gte: new Date(startDate),$lte: new Date(endDate)}});
  } 
  else if (currentDate.isAfter(aprilFirst)) {
    yearform = moment(new Date()).format('YY') + moment(new Date()).add(1, 'year').format('YY');
    const startDate = moment(new Date()).format('YYYY')+'-04-01';
    const endDate = moment(new Date()).add(1,'year').format('YYYY')+'-03-31';
    getlastid = await Order.countDocuments({Order_Date:{$gte: new Date(startDate),$lte: new Date(endDate)}});
  } 
  else {
    yearform = moment(new Date()).format('YY') + moment(new Date()).add(1, 'year').format('YY');
    const endDate = moment(new Date()).add(1,'year').format('YYYY')+'-03-31';
    getlastid = await Order.countDocuments({Order_Date:{$gte: new Date(startDate),$lte: new Date(endDate)}});
  }

  const websitename = keyname

  let final_id
  if (getlastid ) {
    // const res = getlastid.reduce((max, order) => {
    //   const orderNumber = parseInt(order.Order_id.split('-').pop(), 10)
    //   return Math.max(max, orderNumber)
    // }, 0)
    
    const newNumber = getlastid + 1

    final_id = websitename + '-' + yearform + '-' + `${String(newNumber).padStart(3, '0')}`
  } else {
    final_id = keyname + '-' + yearform + '-001'
  }
  return final_id
}
// 
