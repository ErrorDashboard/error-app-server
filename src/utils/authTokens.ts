import { ACCESS_SECRET_KEY, REFRESH_SECRET_KEY } from '@config';
import { User } from '@interfaces/users.interface';
import { DataStoredInToken, TokenData } from '@interfaces/auth.interface';
import { sign, verify } from 'jsonwebtoken';
import { type CookieOptions } from 'express';

export const generateAccessToken = (user: User): TokenData => {
  const dataStoredInToken: DataStoredInToken = { _id: user._id };
  const expiresIn: number = 60 * 60; // 1 hour

  return {
    expiresIn,
    token: sign(dataStoredInToken, ACCESS_SECRET_KEY, { expiresIn }),
  };
};

export const generateRefreshToken = (user: User): TokenData => {
  const dataStoredInToken: DataStoredInToken = { _id: user._id };
  const expiresIn: number = 60 * 60 * 24 * 30; // 30 days

  return {
    expiresIn,
    token: sign(dataStoredInToken, REFRESH_SECRET_KEY, { expiresIn }),
  };
};

export const createCookie = (
  tokenData: TokenData,
  tokenHeader: string,
): { name: string; value: string; options: CookieOptions } => {
  return {
    name: tokenHeader,
    value: tokenData.token,
    options: {
      httpOnly: true,
      path: '/',
      maxAge: tokenData.expiresIn * 1000,
    },
  };
};

export const verifyRefreshToken = (token: string): DataStoredInToken | null => {
  try {
    const decoded = verify(token, REFRESH_SECRET_KEY) as DataStoredInToken;
    return decoded;
  } catch (error) {
    return null;
  }
};

export const refreshToken = (refreshToken: string): TokenData | null => {
  const decodedToken = verifyRefreshToken(refreshToken);

  if (!decodedToken) {
    return null;
  }
};
