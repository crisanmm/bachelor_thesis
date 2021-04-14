import * as JWT from 'jsonwebtoken';
import jwkToPem, { JWK } from 'jwk-to-pem';
import JWKS from './jwks.json';

const validateJWT = async (token: string) =>
  new Promise((resolve, reject) => {
    const decodedJWT = JWT.decode(token, { complete: true });
    /**
     * If the token couldn't be decoded then it is invalid.
     */
    if (!decodedJWT) return false;

    const { header, payload, signature } = decodedJWT;
    const matchedJWK = JWKS.keys.find((JWK) => (JWK.kid = header.kid)) as JWK;
    /**
     * If the JWT Key ID doesn't match with a Key ID from one of the JWT then it is invalid.
     */
    if (!matchedJWK) return false;

    const pem = jwkToPem(matchedJWK);

    return JWT.verify(token, pem, { algorithms: ['RS256'] }, (err, decodedJWT) => {
      if (err) reject(false);
      resolve(decodedJWT);
    });
  });

// (async () => {
//   try {
//     console.log(
//       '🚀  -> file: validateJWT.ts  -> line 35  -> await validateJWT(exampleToken)',
//       await validateJWT(exampleToken),
//     );
//   } catch (e) {
//     console.log('🚀  -> file: validateJWT.ts  -> line 36  -> e', e);
//   }
// })();

export default validateJWT;
