import jwt from "jsonwebtoken";
import jwksClient from "jwks-rsa";

// Initialize the JWKS client to fetch your Supabase project's public keys
const supabaseUrl = process.env.SUPABASE_URL;
const client = jwksClient({
  jwksUri: `${supabaseUrl}/auth/v1/.well-known/jwks.json`
});

function getKey(header, callback) {
  client.getSigningKey(header.kid, function(err, key) {
    if (err) {
      console.error("Error fetching JWKS key:", err);
      return callback(err, null);
    }
    const signingKey = key.publicKey || key.rsaPublicKey;
    callback(null, signingKey);
  });
}

export const verifySupabaseToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: "No authorization header provided" });
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }

  // Verify the asymmetric token using the JWKS endpoint
  jwt.verify(token, getKey, { algorithms: ["ES256", "RS256", "HS256"] }, (err, decoded) => {
    if (err) {
      console.error("JWT Verification Error:", err.message);
      return res.status(403).json({ error: "Invalid or expired token" });
    }
    
    req.user = decoded; // Contains user ID (decoded.sub), email, etc.
    next();
  });
};