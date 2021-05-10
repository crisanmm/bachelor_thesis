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

// (async () => {
//   const exampleToken =
//     'eyJraWQiOiJcLzRUbTR1dUtlbnhyQ3I0N2YwdmRWaXpyM1wvaUpIQ0h5enBNT2NieE5Bemc9IiwiYWxnIjoiUlMyNTYifQ.eyJzdWIiOiJkMjc5ZTQwNC00NGIyLTQ5NTItYTZlNi0zZDMzZjM4Yzg1YWUiLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiaXNzIjoiaHR0cHM6XC9cL2NvZ25pdG8taWRwLmV1LWNlbnRyYWwtMS5hbWF6b25hd3MuY29tXC9ldS1jZW50cmFsLTFfYnpsNTdTWDA0IiwiY29nbml0bzp1c2VybmFtZSI6ImQyNzllNDA0LTQ0YjItNDk1Mi1hNmU2LTNkMzNmMzhjODVhZSIsImdpdmVuX25hbWUiOiJjcmlzYW4iLCJhdWQiOiJzZHBmcnB1a2lmZXR1cGFndmhnaDZ2aDVkIiwiZXZlbnRfaWQiOiI3YTBiZjI0OS1iOWUxLTQ5MzEtOGEzMi1kY2ZmYjNjYmEwMDMiLCJ0b2tlbl91c2UiOiJpZCIsImF1dGhfdGltZSI6MTYxNzgwMDMxMywiZXhwIjoxNjE4NDc1Nzk4LCJpYXQiOjE2MTg0NzIxOTgsImZhbWlseV9uYW1lIjoibWloYWkiLCJlbWFpbCI6ImNyaXNhbl9taWhhaTU1QGhvdG1haWwuY29tIn0.Xbb5QLXwIai4vi5MYnqzBitjWRuR7QU-1FDPs7O0gEXWLBhWtbs0X8FMmfgn6mic5ge71lRExOOGA2K8PFmLbWwRdrn0s7tC7Gp6-c5-oLyP1TBZP8LuOxbmJYYoPgbPsyup2l9Nt6fAartO8Q-fL0mt3waTzel2t4aHEX7aJGAL8DYO4qZaO8w3SSRt8SEihtbJi-XhR0K8KB7-A9dOji9JavRCx7587f3in5bIxlcYiPm5bTWwAx9-i9G20AnAdBeefpzymAPH2svUZ4vo-hKzWHtW0ApGSIjqNmODR04A9VmSN7qI-1E9-GfSpPYtLeaHVU34Q7yvenTMVSvLEA';
//   try {
//     console.log(
//       '🚀  -> file: validateJWT.ts  -> line 59  -> await validateJWT(exampleToken)',
//       await validateJWT(exampleToken),
//     );
//   } catch (e) {
//     console.log('🚀  -> file: validateJWT.ts  -> line 63  -> e', e);
//   }
// })();

export default validateJWT;
