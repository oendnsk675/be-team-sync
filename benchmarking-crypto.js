const {
  generateKeyPairSync,
  publicEncrypt,
  privateDecrypt,
  randomBytes,
  createCipheriv,
  createDecipheriv,
} = require('crypto');
const { performance } = require('perf_hooks');

function benchmark(label, fn) {
  const times = [];
  for (let i = 0; i < 1000; i++) {
    const start = performance.now();
    fn();
    const end = performance.now();
    times.push(end - start);
  }

  const avg = times.reduce((a, b) => a + b, 0) / times.length;
  console.log(`${label}: avg ${avg.toFixed(3)} ms`);
  return avg;
}

// Simulasi Payload
const message =
  'Ini adalah pesan rahasia yang cukup panjang untuk disimulasikan';

// 1. Generate RSA Keypair (2048-bit)
const { publicKey, privateKey } = generateKeyPairSync('rsa', {
  modulusLength: 2048,
});

// 2. AES-256 Enkripsi + Dekripsi
const aesKey = randomBytes(32); // 256-bit
const iv = randomBytes(16); // 128-bit

function aesEncrypt() {
  const cipher = createCipheriv('aes-256-cbc', aesKey, iv);
  cipher.update(message, 'utf8', 'base64');
  cipher.final('base64');
}

function aesDecrypt() {
  const cipher = createCipheriv('aes-256-cbc', aesKey, iv);
  const encrypted =
    cipher.update(message, 'utf8', 'base64') + cipher.final('base64');

  const decipher = createDecipheriv('aes-256-cbc', aesKey, iv);
  decipher.update(encrypted, 'base64', 'utf8');
  decipher.final('utf8');
}

// 3. RSA Enkripsi + Dekripsi terhadap AES Key
function rsaEncryptKey() {
  publicEncrypt(publicKey, aesKey);
}

function rsaDecryptKey() {
  const encKey = publicEncrypt(publicKey, aesKey);
  privateDecrypt(privateKey, encKey);
}

// 🔬 Benchmarking
benchmark('AES-256 Encrypt', aesEncrypt);
benchmark('AES-256 Decrypt', aesDecrypt);
benchmark('RSA-2048 Encrypt AES Key', rsaEncryptKey);
benchmark('RSA-2048 Decrypt AES Key', rsaDecryptKey);
