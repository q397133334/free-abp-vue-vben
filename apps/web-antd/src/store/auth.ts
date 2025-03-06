import type { PasswordTokenRequestModel } from '@abp/account';

import type { UserInfo } from '@vben/types';

import { ref } from 'vue';
import { useRouter } from 'vue-router';

import { DEFAULT_HOME_PATH, LOGIN_PATH } from '@vben/constants';
import { resetAllStores, useAccessStore, useUserStore } from '@vben/stores';

import { useTokenApi, useUserInfoApi } from '@abp/account';
import { useAbpStore } from '@abp/core';
import { notification } from 'ant-design-vue';
import { defineStore } from 'pinia';

import { logoutApi } from '#/api';
import { useAbpConfigApi } from '#/api/core/abpConfiguration';
import { $t } from '#/locales';

const { getUserInfo } = useUserInfoApi();
const { token } = useTokenApi();

export const useAuthStore = defineStore('auth', () => {
  const accessStore = useAccessStore();
  const userStore = useUserStore();
  const router = useRouter();
  const { getConfigApi } = useAbpConfigApi();
  const abpStore = useAbpStore();
  const loginLoading = ref(false);

  /**
   * 异步处理登录操作
   * Asynchronously handle the login process
   * @param params 登录表单数据
   */
  async function authLogin(
    params: PasswordTokenRequestModel,
    onSuccess?: () => Promise<void> | void,
  ) {
    // 异步处理用户登录操作并获取 accessToken
    let userInfo: null | UserInfo = null;
    try {
      loginLoading.value = true;
      const { accessToken, refreshToken } = await token(params);

      // 如果成功获取到 accessToken
      if (accessToken) {
        accessStore.setAccessToken(accessToken);
        accessStore.setRefreshToken(refreshToken);

        // 获取用户信息并存储到 accessStore 中
        const fetchUserInfoResult = await fetchUserInfo();

        userInfo = fetchUserInfoResult;

        userStore.setUserInfo(userInfo);

        if (accessStore.loginExpired) {
          accessStore.setLoginExpired(false);
        } else {
          onSuccess
            ? await onSuccess?.()
            : await router.push(userInfo.homePath || DEFAULT_HOME_PATH);
        }

        if (userInfo?.realName) {
          notification.success({
            description: `${$t('authentication.loginSuccessDesc')}:${userInfo?.realName}`,
            duration: 3,
            message: $t('authentication.loginSuccess'),
          });
        }
      }
    } finally {
      loginLoading.value = false;
    }

    return {
      userInfo,
    };
  }

  async function logout(redirect: boolean = true) {
    try {
      await logoutApi();
    } catch {
      // 不做任何处理
    }
    resetAllStores();
    accessStore.setLoginExpired(false);

    // 回登录页带上当前路由地址
    await router.replace({
      path: LOGIN_PATH,
      query: redirect
        ? {
            redirect: encodeURIComponent(router.currentRoute.value.fullPath),
          }
        : {},
    });
  }

  async function fetchUserInfo(): Promise<UserInfo> {
    let userInfo: null | (UserInfo & { [key: string]: any }) = null;
    const userInfoRes = await getUserInfo();
    const abpConfig = await getConfigApi();
    userInfo = {
      userId: userInfoRes.sub ?? abpConfig.currentUser.id,
      username: userInfoRes.uniqueName ?? abpConfig.currentUser.userName,
      realName: userInfoRes.name ?? abpConfig.currentUser.name,
      // avatar: userInfoRes.avatarUrl ?? userInfoRes.picture?? '',
      avatar:
        'https://unpkg.com/@vbenjs/static-source@0.1.7/source/avatar-v1.webp',
      desc: userInfoRes.uniqueName ?? userInfoRes.name,
      email: userInfoRes.email ?? userInfoRes.email,
      emailVerified:
        userInfoRes.emailVerified ?? abpConfig.currentUser.emailVerified,
      phoneNumber: userInfoRes.phoneNumber ?? abpConfig.currentUser.phoneNumber,
      phoneNumberVerified:
        userInfoRes.phoneNumberVerified ??
        abpConfig.currentUser.phoneNumberVerified,
      token: '',
      roles: abpConfig.currentUser.roles,
      homePath: '/',
    };
    userStore.setUserInfo(userInfo);
    abpStore.setApplication(abpConfig);
    accessStore.setAccessCodes(Object.keys(abpConfig.auth.grantedPolicies));
    return userInfo;
  }

  function $reset() {
    loginLoading.value = false;
  }

  return {
    $reset,
    authLogin,
    fetchUserInfo,
    loginLoading,
    logout,
  };
});
