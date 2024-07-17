const textEncoder = new TextEncoder();
const textDecoder = new TextDecoder();
const ivLength = 12; // AES-GCM recommends 12 bytes IV

async function getKey() {
  const password = process.env.ENCRYPTION_SECRET || 'default_secret';
  const salt = textEncoder.encode('salt');
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    textEncoder.encode(password),
    { name: 'PBKDF2' },
    false,
    ['deriveKey']
  );
  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: salt,
      iterations: 100000,
      hash: 'SHA-256'
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

export async function encrypt(text: string): Promise<string> {
  const key = await getKey();
  const iv = crypto.getRandomValues(new Uint8Array(ivLength));
  const encodedText = textEncoder.encode(text);
  const encrypted = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv: iv },
    key,
    encodedText
  );
  const buffer = new Uint8Array(encrypted);
  const ivString = btoa(String.fromCharCode(...Array.from(iv)));
  const encryptedString = btoa(String.fromCharCode(...Array.from(buffer)));
  return `${ivString}:${encryptedString}`;
}

export async function decrypt(text: string): Promise<string> {
  const [ivString, encryptedString] = text.split(':');
  if (!ivString || !encryptedString) {
    throw new Error('Invalid input for decryption');
  }
  const iv = new Uint8Array(atob(ivString).split('').map(char => char.charCodeAt(0)));
  const encrypted = new Uint8Array(atob(encryptedString).split('').map(char => char.charCodeAt(0)));
  const key = await getKey();
  const decrypted = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv: iv },
    key,
    encrypted
  );
  return textDecoder.decode(decrypted);
}