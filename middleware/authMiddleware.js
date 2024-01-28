const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const secretKey = '12345'; // Replace with your actual secret key

const base64UrlDecode = (str) => {
  return Buffer.from(str.replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString('utf-8');
};

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization;
  console.log('Token:', token);

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized - Token not provided' });
  }

  try {
    // Extracting the header and payload from the token
    const [encodedHeader, encodedPayload] = token.split('.');

    // Base64Url decoding the header and payload
    const decodedHeader = base64UrlDecode(encodedHeader);
    const decodedPayload = base64UrlDecode(encodedPayload);
    console.log('Decoded Header:', decodedHeader);
    console.log('Decoded Payload:', decodedPayload);

    // Creating the verification signature using HMAC-SHA256
    const verificationSignature = crypto.createHmac('sha256', secretKey)
      .update(`${encodedHeader}.${encodedPayload}`)
      .digest('base64')
      .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, ''); // Replace URL-safe characters

    // Extracting the provided signature from the token
    const providedSignature = token.split('.')[2];
    console.log('Provided Signature:', providedSignature);
    console.log('Verification Signature:', verificationSignature);

    // Comparing the computed signature with the provided one
    if (verificationSignature === providedSignature) {
      // Token is valid, proceed with decoding and attaching user information
      const decoded = jwt.verify(token, secretKey);
      console.log('Decoded Token:', decoded);
      req.user = decoded.user;
      next();
    } else {
      return res.status(401).json({ error: 'Unauthorized - Invalid token signature' });
    }
  } catch (error) {
    return res.status(401).json({ error: 'Unauthorized - Invalid token' });
  }
};

module.exports = authMiddleware;
