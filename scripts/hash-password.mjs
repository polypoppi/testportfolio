// Usage: node scripts/hash-password.mjs "your password"
// Prints a PBKDF2 hash to store as the ADMIN_PASSWORD_HASH secret.
const password = process.argv[2];
if (!password || password.length < 10) {
  console.error('Give a password of at least 10 characters.');
  process.exit(1);
}
const enc = new TextEncoder();
const hex = (b) => [...new Uint8Array(b)].map((x) => x.toString(16).padStart(2, '0')).join('');
const salt = crypto.getRandomValues(new Uint8Array(16));
const key = await crypto.subtle.importKey('raw', enc.encode(password), 'PBKDF2', false, ['deriveBits']);
const bits = await crypto.subtle.deriveBits({ name: 'PBKDF2', hash: 'SHA-256', salt, iterations: 100000 }, key, 256);
console.log(`pbkdf2$100000$${hex(salt)}$${hex(bits)}`);
