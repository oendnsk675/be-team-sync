const crypto = require('crypto');

function calculateMSE(original, decrypted) {
  const buf1 = Buffer.from(original);
  const buf2 = Buffer.from(decrypted);

  if (buf1.length !== buf2.length) return Infinity;

  let sum = 0;
  for (let i = 0; i < buf1.length; i++) {
    const diff = buf1[i] - buf2[i];
    sum += diff * diff;
  }

  return sum / buf1.length;
}

function calculatePNR(mse) {
  if (mse === 0) return Infinity;
  return 10 * Math.log10((255 * 255) / mse);
}

function testFidelity(message) {
  const key = crypto.randomBytes(32); // 256-bit AES key
  const iv = crypto.randomBytes(16); // 128-bit IV

  // Enkripsi
  const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
  let encrypted = cipher.update(message, 'utf8', 'base64');
  encrypted += cipher.final('base64');

  // Dekripsi
  const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
  let decrypted = decipher.update(encrypted, 'base64', 'utf8');
  decrypted += decipher.final('utf8');

  // Hitung MSE & PNR
  const mse = calculateMSE(message, decrypted);
  const pnr = calculatePNR(mse);

  // Output
  const table = [
    { Label: 'Original Message', Value: message },
    { Label: 'Decrypted Message', Value: decrypted },
    { Label: 'Equal', Value: message === decrypted },
    { Label: 'MSE', Value: mse },
    { Label: 'PNR', Value: pnr === Infinity ? 'infinity' : pnr.toFixed(2) },
  ];
  console.table(table);
}

// Contoh Pengujian
const message =
  'Ini adalah pesan rahasia 🔒 dengan karakter unicode 😄 dan simbol ©.';
testFidelity(message);
