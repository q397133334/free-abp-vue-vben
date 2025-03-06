import type {
  ChangePasswordInput,
  ConfirmEmailInput,
  ProfileDto,
  SendEmailConfirmCodeDto,
  UpdateProfileDto,
} from '../types/profile';

import { useRequest } from '@abp/request';

export function useProfileApi() {
  const { cancel, request } = useRequest();

  /**
   * 查询个人信息
   * @returns 个人信息
   */
  function get(): Promise<ProfileDto> {
    return request<ProfileDto>('/api/account/my-profile', {
      method: 'GET',
    });
  }

  /**
   * 更新个人信息
   * @param input 参数
   * @returns 个人信息
   */
  function update(input: UpdateProfileDto): Promise<ProfileDto> {
    return request<ProfileDto>('/api/account/my-profile', {
      data: input,
      method: 'PUT',
    });
  }

  /**
   * 修改密码
   * @param input 参数
   */
  function changePassword(input: ChangePasswordInput): Promise<void> {
    return request('/api/account/my-profile/change-password', {
      data: input,
      method: 'POST',
    });
  }

  /**
   * 发送邮件确认链接
   * @param input 参数
   */
  function sendEmailConfirmLink(input: SendEmailConfirmCodeDto): Promise<void> {
    return request('/api/account/my-profile/send-email-confirm-link', {
      data: input,
      method: 'POST',
    });
  }

  /**
   * 确认邮件
   * @param input 参数
   */
  function confirmEmail(input: ConfirmEmailInput) {
    return request('/api/account/my-profile/confirm-email', {
      data: input,
      method: 'PUT',
    });
  }

  return {
    cancel,
    changePassword,
    confirmEmail,
    get,
    sendEmailConfirmLink,
    update,
  };
}
