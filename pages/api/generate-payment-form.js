import crypto from 'crypto';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const data = req.body;

    const apiKey = '74f9c52726911ecbd812d32e8279b628';
    const secret = 'c228ce1865e9a0c25d6c1f0ee6adcbe5';
    
    const userRegistered = new Date().toISOString().slice(0, 10).replace(/-/g, '.');
    const buyerAccountAge = Math.floor((new Date() - new Date(userRegistered)) / 86400);
    const currency = 0;
    const productInfo = data.item_name.replace(/"/g, '');
    const productType = 1;
    const modulVersion = '1.0.4';
    const randomNumber = Math.floor(Math.random() * (9999999 - 1000000 + 1)) + 1000000;

    const args = {
      'API_key': apiKey,
      'website_index': 3,
      'platform_order_id': data.order_id,
      'product_name': productInfo,
      'product_type': productType,
      'buyer_name': data.buyer_name,
      'buyer_surname': data.buyer_surname,
      'buyer_email': data.buyer_email,
      'buyer_account_age': buyerAccountAge,
      'buyer_id_nr': 0,
      'buyer_phone': data.buyer_phone,
      'billing_address': data.billing_address,
      'billing_city': data.city,
      'billing_country': "TR",
      'billing_postcode': "",
      'shipping_address': data.billing_address,
      'shipping_city': data.city,
      'shipping_country': "TR",
      'shipping_postcode': "",
      'total_order_value': data.ucret,
      'currency': currency,
      'platform': 0,
      'is_in_frame': 1,
      'current_language': 0,
      'modul_version': modulVersion,
      'random_nr': randomNumber
    };

    const dataToHash = String(args['random_nr']) + String(args['platform_order_id']) + String(args['total_order_value']) + String(args['currency']);
    const signature = crypto.createHmac('SHA256', secret).update(dataToHash).digest('base64');
    
    args['signature'] = signature;

    const formInputs = Object.keys(args).map(key => `<input type='hidden' name='${key}' value='${args[key]}'/>`).join('');

    const formHtml = `
      <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=0">
          <title>Güvenli Ödeme Sayfası</title>
        </head>
        <body>
          <form action="https://www.shopier.com/ShowProduct/api_pay4.php" method="post" id="shopier_payment_form">
            ${formInputs}
            <script>document.getElementById('shopier_payment_form').submit();</script>
          </form>
        </body>
      </html>
    `;

    res.status(200).send(formHtml);
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
