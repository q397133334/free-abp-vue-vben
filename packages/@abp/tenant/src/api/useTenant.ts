import type { PagedResultDto } from '@abp/core';

import type {
  GetTenantPagedListInput,
  TenantConnectionStringDto,
  TenantConnectionStringSetInput,
  TenantCreateDto,
  TenantDto,
  TenantUpdateDto,
} from '../types';

import { useRequest } from '@abp/request';

export function useTenantsApi() {
  const { cancel, request } = useRequest();
  /**
   * 创建租户
   * @param {TenantCreateDto} input 参数
   * @returns 创建的租户
   */
  function createApi(input: TenantCreateDto): Promise<TenantDto> {
    return request<TenantDto>('/api/multi-tenancy/tenants', {
      data: input,
      method: 'POST',
    });
  }

  /**
   * 编辑租户
   * @param {string} id 参数
   * @param {TenantUpdateDto} input 参数
   * @returns 编辑的租户
   */
  function updateApi(id: string, input: TenantUpdateDto): Promise<TenantDto> {
    return request<TenantDto>(`/api/multi-tenancy/tenants/${id}`, {
      data: input,
      method: 'PUT',
    });
  }

  /**
   * 查询租户
   * @param {string} id Id
   * @returns 查询的租户
   */
  function getApi(id: string): Promise<TenantDto> {
    return request<TenantDto>(`/api/multi-tenancy/tenants/${id}`, {
      method: 'GET',
    });
  }

  /**
   * 删除租户
   * @param {string} id Id
   * @returns {void}
   */
  function deleteApi(id: string): Promise<void> {
    return request(`/api/multi-tenancy/tenants/${id}`, {
      method: 'DELETE',
    });
  }

  /**
   * 查询租户分页列表
   * @param {GetTenantPagedListInput} input 参数
   * @returns {void}
   */
  function getPagedListApi(
    input?: GetTenantPagedListInput,
  ): Promise<PagedResultDto<TenantDto>> {
    return request<PagedResultDto<TenantDto>>(`/api/multi-tenancy/tenants`, {
      method: 'GET',
      params: input,
    });
  }

  /**
   * 设置连接字符串
   * @param {string} id 租户Id
   * @param {TenantConnectionStringSetInput} input 参数
   * @returns 连接字符串
   */
  function setDefaultConnectionStringApi(
    id: string,
    input: TenantConnectionStringSetInput,
  ): Promise<TenantConnectionStringDto> {
    return request<TenantConnectionStringDto>(
      `/api/multi-tenancy/tenants/${id}/default-connection-string`,
      {
        data: input,
        method: 'PUT',
      },
    );
  }

  /**
   * 查询连接字符串
   * @param {string} id 租户Id
   * @param {string} name 连接字符串名称
   * @returns 连接字符串
   */
  function getDefaultConnectionStringApi(
    id: string,
    name: string,
  ): Promise<TenantConnectionStringDto> {
    return request<TenantConnectionStringDto>(
      `/api/multi-tenancy/tenants/${id}/default-connection-string/${name}`,
      {
        method: 'GET',
      },
    );
  }

  /**
   * 查询所有连接字符串
   * @param {string} id 租户Id
   * @returns 连接字符串列表
   */
  // function getConnectionStringsApi(
  //   id: string,
  // ): Promise<ListResultDto<TenantConnectionStringDto>> {
  //   return request<ListResultDto<TenantConnectionStringDto>>(
  //     `/api/multi-tenancy/tenants/${id}/default-connection-string`,
  //     {
  //       method: 'GET',
  //     },
  //   );
  // }

  /**
   * 删除租户
   * @param {string} id 租户Id
   * @param {string} name 连接字符串名称
   * @returns {void}
   */
  function deleteDefaultConnectionStringApi(
    id: string,
    name: string,
  ): Promise<void> {
    return request(
      `/api/multi-tenancy/tenants/${id}/default-connection-string/${name}`,
      {
        method: 'DELETE',
      },
    );
  }

  return {
    cancel,
    createApi,
    deleteApi,
    deleteDefaultConnectionStringApi,
    getApi,
    getDefaultConnectionStringApi,
    getPagedListApi,
    setDefaultConnectionStringApi,
    updateApi,
  };
}
