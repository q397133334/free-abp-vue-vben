import type {
  OAuthTokenResult,
  PasswordTokenRequestModel,
  TokenResult,
} from '../types';

import { useAppConfig } from '@vben/hooks';

import { useRequest } from '@abp/request';

export { useAccountApi } from './useAccountApi';
export { useProfileApi } from './useProfileApi';
export { useTokenApi } from './useTokenApi';
export { useUserInfoApi } from './useUserInfoApi';

export const register = () => {};
export const sendPasswordResetCode = () => {};
export const verifyPasswordResetCode = () => {};
export const resetPassword = () => {};

export const token = async (
  input: PasswordTokenRequestModel,
): Promise<TokenResult> => {
  const { request } = useRequest();
  const { audience, clientId, clientSecret } = useAppConfig(
    import.meta.env,
    import.meta.env.PROD,
  );
  const result = await request<OAuthTokenResult>('/connect/token', {
    data: {
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: 'password',
      scope: audience,
      ...input,
    },
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    method: 'POST',
  });
  return {
    accessToken: result.access_token,
    expiresIn: result.expires_in,
    refreshToken: result.refresh_token,
    tokenType: result.token_type,
  };
};
export const refreshToken = () => {};
export const logout = () => {};
export const userinfo = () => {};
export const revocat = () => {};
export const device = () => {};
