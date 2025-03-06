import type { ListResultDto, PagedResultDto } from '@abp/core';

import type { IdentityRoleDto } from '../types';
import type {
  GetUserPagedListInput,
  IdentityUserCreateDto,
  IdentityUserDto,
  IdentityUserUpdateDto,
} from '../types/users';

import { useRequest } from '@abp/request';

export function useUsersApi() {
  const { cancel, request } = useRequest();

  /**
   * 新增用户
   * @param input 参数
   * @returns 用户实体数据传输对象
   */
  function createApi(input: IdentityUserCreateDto): Promise<IdentityUserDto> {
    return request<IdentityUserDto>('/api/identity/users', {
      data: input,
      method: 'POST',
    });
  }

  /**
   * 删除用户
   * @param id 用户id
   */
  function deleteApi(id: string): Promise<void> {
    return request(`/api/identity/users/${id}`, {
      method: 'DELETE',
    });
  }

  /**
   * 查询用户
   * @param id 用户id
   * @returns 用户实体数据传输对象
   */
  function getApi(id: string): Promise<IdentityUserDto> {
    return request<IdentityUserDto>(`/api/identity/users/${id}`, {
      method: 'GET',
    });
  }

  /**
   * 更新用户
   * @param id 用户id
   * @returns 用户实体数据传输对象
   */
  function updateApi(
    id: string,
    input: IdentityUserUpdateDto,
  ): Promise<IdentityUserDto> {
    return request<IdentityUserDto>(`/api/identity/users/${id}`, {
      data: input,
      method: 'PUT',
    });
  }

  /**
   * 查询用户分页列表
   * @param input 过滤参数
   * @returns 用户实体数据传输对象分页列表
   */
  function getPagedListApi(
    input?: GetUserPagedListInput,
  ): Promise<PagedResultDto<IdentityUserDto>> {
    return request<PagedResultDto<IdentityUserDto>>(`/api/identity/users`, {
      method: 'GET',
      params: input,
    });
  }

  /**
   * 获取可用的角色列表
   */
  function getAssignableRolesApi(): Promise<ListResultDto<IdentityRoleDto>> {
    return request<ListResultDto<IdentityRoleDto>>(
      `/api/identity/users/assignable-roles`,
      {
        method: 'GET',
      },
    );
  }

  /**
   * 获取用户角色列表
   * @param id 用户id
   */
  function getRolesApi(id: string): Promise<ListResultDto<IdentityRoleDto>> {
    return request<ListResultDto<IdentityRoleDto>>(
      `/api/identity/users/${id}/roles`,
      {
        method: 'GET',
      },
    );
  }

  return {
    cancel,
    createApi,
    deleteApi,
    getApi,
    getAssignableRolesApi,
    getPagedListApi,
    getRolesApi,
    updateApi,
  };
}
