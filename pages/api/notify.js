import crypto from 'crypto';

const shopierSecret = 'c228ce1865e9a0c25d6c1f0ee6adcbe5'; // Shopier hesabınızdaki API Secret

export default function handler(req, res) {
  if (req.method === 'POST') {
    const { status, platform_order_id, payment_id, installment, signature, random_nr, total_order_value, currency } = req.body;

    const dataToVerify = random_nr + platform_order_id + total_order_value + currency;
    const expectedSignature = crypto.createHmac('SHA256', shopierSecret).update(dataToVerify).digest('base64');

    if (signature === expectedSignature) {
      if (status.toLowerCase() === 'success') {
        // Ödeme başarılı - siparişi onaylayın, kullanıcıya bildirim gönderin
        res.status(200).send('Ödeme başarılı, sipariş onaylandı.');
      } else {
        // Ödeme başarısız - hata işlemleri yapılabilir
        res.status(400).send('Ödeme başarısız.');
      }
    } else {
      // İmza doğrulama başarısız olduysa
      res.status(400).send('Geçersiz imza.');
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
