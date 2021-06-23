/* eslint-disable consistent-return */
import * as JWT from 'jsonwebtoken';
import jwkToPem, { JWK } from 'jwk-to-pem';
import type { JWT as JWTPayloadType } from '../shared';
import JWKS from './jwks.json';

type JWTCompleteType = {
  [key: string]: any;
};

interface ValidateJWT {
  (token: string): Promise<JWTPayloadType>;
}

/**
 * Validates a JWT.
 * @param token JWT in string format
 * @returns The decoded JWT in case of success, an Error object otherwise.
 */
const validateJWT: ValidateJWT = async (token: string) =>
  new Promise((resolve, reject) => {
    const decodedJWT = JWT.decode(token, { complete: true }) as JWTCompleteType | null;
    /**
     * If the token couldn't be decoded
     * then reject validation.
     */
    if (!decodedJWT) {
      reject(new JWT.JsonWebTokenError('Token could not be decoded.'));
      return;
    }

    /**
     * If the user's email is not verified
     * then reject validation.
     */
    // if (!decodedJWT.payload.email_verified) {
    //   reject(new JWT.JsonWebTokenError("User's email address is not verified."));
    //   return;
    // }

    const matchedJWK = JWKS.keys.find((JWK) => JWK.kid === decodedJWT.header.kid) as JWK;
    /**
     * If the JWT Key ID doesn't match with a Key ID from one of the JWK
     * then reject validation.
     */
    if (!matchedJWK) {
      reject(new JWT.JsonWebTokenError('No JWK found with the same Key ID as token.'));
      return;
    }

    const pem = jwkToPem(matchedJWK);
    return JWT.verify(token, pem, { algorithms: ['RS256'] }, (err, decodedJWT) => {
      if (err) reject(err);
      resolve(decodedJWT! as JWTPayloadType);
    });
  });

export default validateJWT;
