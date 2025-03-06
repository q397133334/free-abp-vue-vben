<script setup lang="ts">
import type { VbenFormProps, VxeGridListeners, VxeGridProps } from '@abp/ui';

import type { IdentityRoleDto } from '../../types/roles';

import { defineAsyncComponent } from 'vue';

import { useAccess } from '@vben/access';
import { Page, useVbenModal } from '@vben/common-ui';
import { $t } from '@vben/locales';

import { useAbpStore } from '@abp/core';
import { IdentityRolePermissions, useRolesApi } from '@abp/identity';
import { useVbenVxeGrid } from '@abp/ui';
import { Button, message, Modal, Tag } from 'ant-design-vue';

import { useIcon } from '#/icons';

defineOptions({
  name: 'RoleTable',
});

const { IconAdd, IconEdit, IconDelete, IconPermissionsOutlined } = useIcon();
const RoleModal = defineAsyncComponent(() => import('./modal.vue'));
const PermissionModal = defineAsyncComponent(
  () => import('../../permission/modal.vue'),
);

const abpStore = useAbpStore();
const { hasAccessByCodes } = useAccess();
const { cancel, deleteApi, getPagedListApi } = useRolesApi();

const formOptions: VbenFormProps = {
  // 默认展开
  collapsed: false,
  schema: [
    {
      component: 'Input',
      fieldName: 'filter',
      formItemClass: 'col-span-2 items-baseline',
      label: $t('AbpUi.Search'),
    },
  ],
  // 控制表单是否显示折叠按钮
  showCollapseButton: true,
  // 按下回车时是否提交表单
  submitOnEnter: true,
};

const gridOptions: VxeGridProps<IdentityRoleDto> = {
  columns: [
    {
      align: 'left',
      field: 'name',
      slots: { default: 'name' },
      title: $t('AbpIdentity.DisplayName:RoleName'),
    },
    {
      field: 'action',
      fixed: 'right',
      slots: { default: 'action' },
      title: $t('AbpUi.Actions'),
      width: 250,
    },
  ],
  height: 'auto',
  exportConfig: {},
  keepSource: true,
  proxyConfig: {
    ajax: {
      query: async ({ page }, formValues) => {
        return await getPagedListApi({
          maxResultCount: page.pageSize,
          skipCount: (page.currentPage - 1) * page.pageSize,
          ...formValues,
        });
      },
    },
    response: {
      total: 'totalCount',
      list: 'items',
    },
  },
  toolbarConfig: {
    custom: true,
    export: true,
    // import: true,
    refresh: true,
    zoom: true,
  },
};

const gridEvents: VxeGridListeners<IdentityRoleDto> = {
  cellClick: () => {},
};
const [RoleEditModal, roleModalApi] = useVbenModal({
  connectedComponent: RoleModal,
});

const [PermissionEditModal, permissionModalApi] = useVbenModal({
  connectedComponent: PermissionModal,
});
const [Grid, { query }] = useVbenVxeGrid({
  formOptions,
  gridEvents,
  gridOptions,
});

const handleAdd = () => {
  roleModalApi.setData({});
  roleModalApi.open();
};

const handleEdit = (row: IdentityRoleDto) => {
  roleModalApi.setData(row);
  roleModalApi.open();
};

const handleDelete = (row: IdentityRoleDto) => {
  Modal.confirm({
    centered: true,
    content: $t('AbpIdentity.RoleDeletionConfirmationMessage', [row.name]),
    onCancel: () => {
      cancel('User closed cancel delete modal.');
    },
    onOk: async () => {
      await deleteApi(row.id);
      message.success($t('AbpUi.SuccessfullyDeleted'));
      query();
    },
    title: $t('AbpUi.AreYouSure'),
  });
};

const handlePermission = async (row: IdentityRoleDto) => {
  const roles = abpStore.application?.currentUser.roles ?? [];
  permissionModalApi.setData({
    providerKey: row.name,
    providerName: 'R',
    displayName: row.name,
    roles,
  });
  permissionModalApi.open();
};
</script>

<template>
  <Page auto-content-height>
    <Grid :table-title="$t('AbpIdentity.Roles')">
      <template #toolbar-tools>
        <Button
          type="primary"
          v-access:code="[IdentityRolePermissions.Create]"
          @click="handleAdd"
        >
          <IconAdd />
          {{ $t('AbpIdentity.NewRole') }}
        </Button>
      </template>
      <template #name="{ row }">
        <Tag v-if="row.isStatic" color="#8baac4" style="margin-right: 5px">
          {{ $t('AbpIdentity.DisplayName:IsStatic') }}
        </Tag>
        <Tag v-if="row.isDefault" color="#108ee9" style="margin-right: 5px">
          {{ $t('AbpIdentity.DisplayName:IsDefault') }}
        </Tag>
        <Tag v-if="row.isPublic" color="#87d068" style="margin-right: 5px">
          {{ $t('AbpIdentity.DisplayName:IsPublic') }}
        </Tag>
        <span>{{ row.name }}</span>
      </template>
      <template #action="{ row }">
        <div class="flex flex-row">
          <div class="basis-1/3">
            <Button
              block
              type="link"
              v-access:code="[IdentityRolePermissions.Update]"
              @click="handleEdit(row)"
            >
              <IconEdit />
              {{ $t('AbpUi.Edit') }}
            </Button>
          </div>
          <div class="basis-1/3">
            <Button
              :disabled="row.isStatic"
              block
              danger
              type="link"
              v-access:code="[IdentityRolePermissions.Delete]"
              @click="handleDelete(row)"
            >
              <IconDelete />
              {{ $t('AbpUi.Delete') }}
            </Button>
          </div>
          <div class="basis-1/3">
            <Button
              v-if="
                hasAccessByCodes([IdentityRolePermissions.ManagePermissions])
              "
              block
              danger
              type="link"
              @click="handlePermission(row)"
            >
              <IconPermissionsOutlined />
              {{ $t('AbpPermissionManagement.Permissions') }}
            </Button>
          </div>
        </div>
      </template>
    </Grid>
    <RoleEditModal @change="() => query()" />
    <PermissionEditModal />
  </Page>
</template>

<style lang="scss" scoped></style>
