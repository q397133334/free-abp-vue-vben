<script setup lang="ts">
import type { IdentityUserDto } from '@abp/identity';
import type { VbenFormProps, VxeGridProps } from '@abp/ui';

import { defineAsyncComponent } from 'vue';

import { useAccess } from '@vben/access';
import { Page, useVbenModal } from '@vben/common-ui';
import {
  IconAdd,
  IconCheck,
  IconClose,
  IconDelete,
  IconEdit,
  IconPermissionsOutlined,
} from '@vben/icons';
import { $t } from '@vben/locales';

import { useAbpStore } from '@abp/core';
import { IdentityUserPermissions, useUsersApi } from '@abp/identity';
import { useVbenVxeGrid } from '@abp/ui';
import { Button, message, Popconfirm } from 'ant-design-vue';

defineOptions({
  name: 'User',
});

const abpStore = useAbpStore();
// const { isEnabled } = useFeatures();
const { hasAccessByCodes } = useAccess();
const { getPagedListApi, deleteApi } = useUsersApi();

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

const gridOptions: VxeGridProps<IdentityUserDto> = {
  columns: [
    {
      field: 'isActive',
      slots: { default: 'active' },
      title: $t('AbpIdentity.DisplayName:IsActive'),
    },
    {
      field: 'userName',
      minWidth: '100px',
      title: $t('AbpIdentity.DisplayName:UserName'),
    },
    {
      field: 'email',
      minWidth: '120px',
      title: $t('AbpIdentity.DisplayName:Email'),
    },
    { field: 'surname', title: $t('AbpIdentity.DisplayName:Surname') },
    { field: 'name', title: $t('AbpIdentity.DisplayName:Name') },
    { field: 'phoneNumber', title: $t('AbpIdentity.DisplayName:PhoneNumber') },
    {
      field: 'action',
      fixed: 'right',
      slots: { default: 'action' },
      title: $t('AbpUi.Actions'),
      width: 250,
    },
  ],
  exportConfig: {},
  height: 'auto',
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
    // export: true,
    // import: true,
    refresh: true,
    // zoom: true,
  },
};
const [Grid, { query }] = useVbenVxeGrid({
  formOptions,
  gridOptions,
});
const UserModal = defineAsyncComponent(() => import('./modal.vue'));
const [EditModal, userModalApi] = useVbenModal({
  connectedComponent: UserModal,
});

const PermissionModal = defineAsyncComponent(
  () => import('#/views/permission/modal.vue'),
);

const [PermissionEditModal, permissionModalApi] = useVbenModal({
  connectedComponent: PermissionModal,
});
const handleAdd = () => {
  userModalApi.setData({ id: null });
  userModalApi.open();
};

const handleEdit = (row: IdentityUserDto) => {
  userModalApi.setData(row as IdentityUserDto);
  userModalApi.open();
};

const handleDelete = async (row: IdentityUserDto) => {
  try {
    await deleteApi(row.id);
    message.success($t('AbpUi.SuccessfullyDeleted'));
    query();
  } catch {}
};

const handlePermission = async (row: IdentityUserDto) => {
  const roles = abpStore.application?.currentUser.roles ?? [];
  permissionModalApi.setData({
    providerKey: row.userName,
    providerName: 'R',
    displayName: row.userName,
    roles,
  });
  permissionModalApi.open();
};
</script>

<template>
  <Page auto-content-height>
    <Grid :table-title="$t('AbpIdentity.Users')">
      <template #toolbar-tools>
        <Button type="primary" @click="handleAdd">
          <IconAdd /> {{ $t('AbpIdentity.NewUser') }}
        </Button>
      </template>
      <template #active="{ row }">
        <div class="flex flex-row justify-center">
          <div :class="row.isActive ? 'text-green-600' : 'text-red-600'">
            <IconCheck v-if="row.isActive" />
            <IconClose v-else />
          </div>
        </div>
      </template>
      <template #action="{ row }">
        <div class="flex flex-row">
          <div class="basis-1/3">
            <Button @click="handleEdit(row)" block type="link">
              <IconEdit />
              {{ $t('AbpUi.Edit') }}
            </Button>
          </div>
          <div class="basis-1/3">
            <Popconfirm
              placement="topRight"
              v-if="
                hasAccessByCodes([IdentityUserPermissions.ManagePermissions])
              "
              :title="$t('AbpUi.AreYouSure')"
              @confirm="
                async () => {
                  handleDelete(row);
                }
              "
            >
              <Button block type="link" danger>
                <IconDelete />
                {{ $t('AbpUi.Delete') }}
              </Button>
            </Popconfirm>
          </div>
          <div class="basis-1/3">
            <Button
              block
              type="link"
              @click="handlePermission(row)"
              v-if="
                hasAccessByCodes([IdentityUserPermissions.ManagePermissions])
              "
            >
              <IconPermissionsOutlined />
              {{ $t('AbpPermissionManagement.Permissions') }}
            </Button>
          </div>
        </div>
      </template>
    </Grid>
    <EditModal
      @change="
        () => {
          query();
        }
      "
    />
    <PermissionEditModal />
  </Page>
</template>

<style></style>
