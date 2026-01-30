import crypto from "crypto";

const MAGIC_LINK_SECRET =
  process.env.MAGIC_LINK_SECRET || "default-secret-change-in-prod";

/**
 * Generates a signed token for magic links
 * Format: base64url(orderId.expirationTimestamp.signature)
 */
export function generateToken(
  orderId: string,
  expiryHours: number = 168 // 7 days default
): string {
  const expires = Date.now() + expiryHours * 60 * 60 * 1000;
  const payload = `${orderId}.${expires}`;
  const signature = crypto
    .createHmac("sha256", MAGIC_LINK_SECRET)
    .update(payload)
    .digest("hex");
  return Buffer.from(`${payload}.${signature}`).toString("base64url");
}

/**
 * Verifies a signed token
 */
export function verifyToken(token: string): {
  valid: boolean;
  orderId?: string;
  error?: string;
} {
  try {
    const decoded = Buffer.from(token, "base64url").toString("utf-8");
    const parts = decoded.split(".");
    if (parts.length !== 3) {
      return { valid: false, error: "Invalid token format" };
    }

    const [orderId, expiresStr, signature] = parts;
    const expires = parseInt(expiresStr);
    const payload = `${orderId}.${expiresStr}`;
    const expectedSignature = crypto
      .createHmac("sha256", MAGIC_LINK_SECRET)
      .update(payload)
      .digest("hex");

    // Constant time comparison to prevent timing attacks
    const signatureBuffer = Buffer.from(signature);
    const expectedBuffer = Buffer.from(expectedSignature);
    const validSignature =
      signatureBuffer.length === expectedBuffer.length &&
      crypto.timingSafeEqual(signatureBuffer, expectedBuffer);

    if (!validSignature) {
      return { valid: false, error: "Invalid signature" };
    }

    if (Date.now() > expires) {
      return { valid: false, error: "Link expired" };
    }

    return { valid: true, orderId };
  } catch {
    return { valid: false, error: "Malformed token" };
  }
}
