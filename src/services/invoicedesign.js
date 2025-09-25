import moment from 'moment-timezone';

import puppeteer from 'puppeteer';
// import chromium from '@sparticuz/chromium'
import axios from 'axios';
import { PDFDocument } from 'pdf-lib';
import { Order, Ordermaster } from '../models/ordermodel.js';
import { Shiping } from '../models/signupmodel.js';


const invoiceslipdesign = async (invoice) => {
  console.log(invoice)
  return `
  <!DOCTYPE html>
    <html>
    <head>
      <style>
        body {
          font-family: Arial, sans-serif;
          margin: 0;
          padding: 5px;
        }

        table {
          width: 100%;
          border-collapse: collapse;
        }

        th, td {
          padding: 8px;
          text-align: left;
        }

        .myhead{
          font-size: 13px;
        }

        .myhead th,td{
          border-top: 1px dashed;
        }

        .body{
          font-size: 13px;
        }

        .total {
          font-weight: bold;
          font-size: 18px;
        }

        .banner{
          font-size: 15px;
        }

        .banner .th2{
          text-align:right;
        }

        .logo{
          text-align:center;
        }

        hr{
          border:0;
          border-bottom: 1px dashed;
        }

        .dis-none{
          display: none;
        }


      </style>

    </head>
    <body>

      <table>
        <thead>
          
          <tr class="banner">
            <th colspan="2" class="th1" style="margin-top:0px;padding-top:0px">
              <div>
                <p><b>Customer Name:</b> ${invoice.Billing_Name?invoice.Billing_Name:""}</p>
                <p><b>Mobile Number:</b> ${invoice.Mobilenumber?invoice.Mobilenumber:"-"}</p>
                <p><b>Address:</b> ${invoice?.DeliveryAddress?.Address},<br/> ${invoice?.DeliveryAddress?.City}, ${invoice?.DeliveryAddress?.State},<br/> ${invoice?.DeliveryAddress?.Country} ${invoice?.DeliveryAddress?.Zipcode}</p>
              </div>
            </th>
            <th colspan="6" class="th2" style="margin-top:0px;padding-top:0px">
              <div>
                <p>Order ID: ${invoice.Order_id}</p>
                <p>Order Date: ${moment(invoice.Order_Date).tz('America/Los_Angeles').format('DD-MM-YYYY')}</p>
              </div>
            </th>
          </tr>
          <tr class="myhead">
            <th>S.No</th>
            <th>Product</th>
            <th>QTY</th>
            <th>Price</th>
            <th style="width: 30px !important;text-align: right;">Amount</th>
          </tr>
        </thead>

        <tbody class="body">
          ${invoice.items.map((item, index) =>  `<tr > <td style="width: 5px !important">${index + 1}</td>
            <td style="min-width: 60% !important">${item.Product_Name}</td>
            <td style="width: 80px !important">${item?.Quantity?item.Quantity:1}</td>
            <td style="width: 90px !important">$ ${(item.sale_price*1).toFixed(2)}</td>
            <td style="width: 90px !important;text-align: right;">$ ${((item.Quantity?item.Quantity:1)*(item?.sale_price)).toFixed(2)}</td>
          </tr>` ).join('')}
          <tr>
            <td colspan="1">Total</td>
            <td colspan="1"></td>
            <td > </td>
            <td colspan="1"></td>
            <td style="width: 90px !important;text-align: right;">$ ${invoice?.Total_Amount}</td>
          </tr>
        </tbody>
      </table>

      </body>
      
    </html>

`
}

const generatepdf = async (id) => {
  const orderdata = await Order.findOne({ Order_id: id }).lean()
  const ordermastedata = await Ordermaster.find({ Order_id: id }).lean()
  const DeliveryAddress = await Shiping.findOne({_id:orderdata.Delivery_Address_id}).lean();
  // const currency=await moneyRatechange()
  // var curDAta
  // const currencyData=curencyJson.map((data)=>{if(data?.code===orderdata?.currency)curDAta=data})
  const htmlContent = await invoiceslipdesign({ ...orderdata, ...{ items: ordermastedata },DeliveryAddress:DeliveryAddress })

  const imageResponse = await axios.get(`${process.env.URL}/images/logo/logo1.png`, { responseType: 'arraybuffer' });
  const imageBuffer = Buffer.from(imageResponse.data);
  const imageType = imageResponse.headers['content-type'];
  const dataUrl = `data:${imageType || 'image/png'};base64,${imageBuffer.toString('base64')}`;

  const options = {
    format: 'A4',
    margin: { top: '180px', right: '30px', bottom: '30px', left: '30px' },
    printBackground: true,
    displayHeaderFooter: true,
    headerTemplate: `
      <header style="text-align: center; margin-left: 330px">
        <div>
          <img src="${dataUrl}" width="90" style="margin-bottom: 10px">
        </div><br>
        <div style="font-size:15px;text-align: center"><b>Invoice</b></div>
      </header>
    `,
    // footerTemplate:`
    // <ul style="font-size:12px; margin: 20px; width: 100%">
    //   <li>Our window shades are covered by a 5-year warranty from the date of installation.</li>
    //   <li>This warranty applies to fabric or material defects, operation mechanisms including chains, motors, mounting brackets, and hardware.<li">
    //   <li>Following circumstances are not covered by warranty, such as misuse, human errors, neglect, damages resulting from fire, floods, or other natural disasters, modifications made to shades without prior authorization from our company</li>
    // </ul>`
  }
  try {
    const browser = await puppeteer.launch({}
      // {
      //   args: chromium.args,
      //   defaultViewport: chromium.defaultViewport,
      //   executablePath: await chromium.executablePath(),
      //   headless: chromium.headless,
      //   ignoreHTTPSErrors: true,
      //   waitForInitialPage: chromium.waitForInitialPage
      // }
    );
    const page = await browser.newPage();
    await page.setContent(htmlContent);
    const buffer = await page.pdf(options);
    await browser.close();

    const pdfDoc = await PDFDocument.load(buffer);
    const totalPages = pdfDoc.getPageCount();
    //console.log(totalPages)
    // if (totalPages > 1) {
    //   pdfDoc.removePage(0);
    // } else {
    //   console.warn('The PDF has only one page, no pages will be removed.');
    // }

    const pdfBytes = await pdfDoc.save();
    const pdfBuffer = Buffer.from(pdfBytes);
    return pdfBuffer;
  } catch (err) {
    console.error(err)
    throw new Error('Error generating PDF')
  }
}
export { invoiceslipdesign, generatepdf }
