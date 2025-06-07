import { generateId } from 'ai';

export async function generateHashedPassword(
  password: string,
): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);

  // Generate a random salt
  const salt = crypto.getRandomValues(new Uint8Array(16));

  // Import the password as a key
  const key = await crypto.subtle.importKey(
    'raw',
    data,
    { name: 'PBKDF2' },
    false,
    ['deriveBits'],
  );

  // Derive the hash
  const hashBuffer = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt,
      iterations: 100000,
      hash: 'SHA-256',
    },
    key,
    256,
  );

  // Combine salt and hash
  const hashArray = new Uint8Array(hashBuffer);
  const combined = new Uint8Array(salt.length + hashArray.length);
  combined.set(salt);
  combined.set(hashArray, salt.length);

  // Return as base64
  return btoa(String.fromCharCode(...combined));
}

export async function verifyPassword(
  password: string,
  hash: string,
): Promise<boolean> {
  try {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);

    // Decode the stored hash
    const combined = new Uint8Array(
      atob(hash)
        .split('')
        .map((c) => c.charCodeAt(0)),
    );

    // Extract salt and hash
    const salt = combined.slice(0, 16);
    const storedHash = combined.slice(16);

    // Import the password as a key
    const key = await crypto.subtle.importKey(
      'raw',
      data,
      { name: 'PBKDF2' },
      false,
      ['deriveBits'],
    );

    // Derive the hash with the same salt
    const hashBuffer = await crypto.subtle.deriveBits(
      {
        name: 'PBKDF2',
        salt,
        iterations: 100000,
        hash: 'SHA-256',
      },
      key,
      256,
    );

    const hashArray = new Uint8Array(hashBuffer);

    // Compare hashes
    return hashArray.every((byte, i) => byte === storedHash[i]);
  } catch {
    return false;
  }
}

export async function generateDummyPassword(): Promise<string> {
  const password = generateId(12);
  const hashedPassword = await generateHashedPassword(password);

  return hashedPassword;
}
