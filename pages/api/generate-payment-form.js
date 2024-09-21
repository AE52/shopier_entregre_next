import crypto from 'crypto';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const data = req.body;

    // API Anahtarı ve Secret anahtarı
    const apiKey = '74f9c52726911ecbd812d32e8279b628';
    const secret = 'c228ce1865e9a0c25d6c1f0ee6adcbe5';

    // Kullanıcı kayıt tarihi (örnek olarak bugünü veriyoruz)
    const userRegistered = new Date().toISOString().slice(0, 10).replace(/-/g, '.');
    const buyerAccountAge = Math.floor((new Date() - new Date(userRegistered)) / 86400); // Gün cinsinden hesaplama

    // Para birimi (0 = Türk Lirası)
    const currency = 0;

    // Ürün bilgisi, özel karakterlerden arındırılıyor
    let productInfo = data.item_name.replace(/"/g, '');

    // Ürün tipi (1 = Fiziksel ürün)
    const productType = 1;

    // Modül versiyonu ve rastgele bir sayı
    const modulVersion = '1.0.4';
    const randomNumber = Math.floor(Math.random() * (9999999 - 1000000 + 1)) + 1000000;

    // Shopier API'ye gönderilecek veri
    const args = {
      'API_key': apiKey,
      'website_index': 3,
      'platform_order_id': data.order_id, // Sipariş ID'si
      'product_name': productInfo, // Ürün adı
      'product_type': productType, // Ürün tipi
      'buyer_name': data.buyer_name, // Alıcı adı
      'buyer_surname': data.buyer_surname, // Alıcı soyadı
      'buyer_email': data.buyer_email, // Alıcı email
      'buyer_account_age': buyerAccountAge, // Kullanıcı hesap yaşı (gün cinsinden)
      'buyer_id_nr': 0, // Alıcı kimlik numarası (zorunlu değil)
      'buyer_phone': data.buyer_phone, // Alıcı telefon numarası
      'billing_address': data.billing_address, // Fatura adresi
      'billing_city': data.city, // Fatura şehri
      'billing_country': "TR", // Fatura ülkesi
      'billing_postcode': "", // Fatura posta kodu (opsiyonel)
      'shipping_address': data.billing_address, // Teslimat adresi
      'shipping_city': data.city, // Teslimat şehri
      'shipping_country': "TR", // Teslimat ülkesi
      'shipping_postcode': "", // Teslimat posta kodu (opsiyonel)
      'total_order_value': data.ucret, // Sipariş toplam ücreti
      'currency': currency, // Para birimi
      'platform': 0, // Platform
      'is_in_frame': 1, // Çerçeve içinde mi?
      'current_language': 0, // Dil (0 = Türkçe)
      'modul_version': modulVersion, // Modül versiyonu
      'random_nr': randomNumber // Rastgele numara
    };

    // İmza oluşturma (Shopier dokümantasyonuna uygun olarak)
    const dataToHash = String(args['random_nr']) + String(args['platform_order_id']) + String(args['total_order_value']) + String(args['currency']);
    const signature = crypto.createHmac('SHA256', secret).update(dataToHash).digest('base64');
    args['signature'] = signature; // İmza veriye ekleniyor

    // Form verilerini Shopier'e göndermek için HTML formu oluşturma
    const formInputs = Object.keys(args).map(key => `<input type='hidden' name='${key}' value='${args[key]}'/>`).join('');

    // HTML formu oluşturuluyor ve kullanıcıya gösteriliyor
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

    // Formu döndür ve işlemi tamamla
    res.status(200).send(formHtml);
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
