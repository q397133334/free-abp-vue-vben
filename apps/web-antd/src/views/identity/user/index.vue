<script setup lang="ts">
import type { IdentityUserDto } from '@abp/identity';
import type { VbenFormProps, VxeGridProps } from '@abp/ui';

import { defineAsyncComponent, h } from 'vue';

import { Page, useVbenModal } from '@vben/common-ui';
import { createIconifyIcon } from '@vben/icons';
import { $t } from '@vben/locales';

import { useUsersApi } from '@abp/identity';
import { useVbenVxeGrid } from '@abp/ui';
import { Button, Dropdown, Menu } from 'ant-design-vue';

const MenuItem = Menu.Item;
const AddIcon = createIconifyIcon('ant-design:plus-outlined');
const CheckIcon = createIconifyIcon('ant-design:check-outlined');
const CloseIcon = createIconifyIcon('ant-design:close-outlined');
const PasswordIcon = createIconifyIcon('carbon:password');
const MenuOutlined = createIconifyIcon('heroicons-outline:menu-alt-3');
const ClaimOutlined = createIconifyIcon('la:id-card-solid');
const PermissionsOutlined = createIconifyIcon('icon-park-outline:permissions');
const AuditLogIcon = createIconifyIcon('fluent-mdl2:compliance-audit');

// const abpStore = useAbpStore();
// const { isEnabled } = useFeatures();
// const { hasAccessByCodes } = useAccess();
const { getPagedListApi } = useUsersApi();

const Modal = defineAsyncComponent(() => import('./modal.vue'));
const [EditModal, userModalApi] = useVbenModal({
  connectedComponent: Modal,
});

const handleAdd = () => {
  userModalApi.setData({});
  userModalApi.open();
};

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
      width: 220,
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

const [Grid] = useVbenVxeGrid({
  formOptions,
  gridOptions,
});
</script>

<template>
  <Page auto-content-height>
    <Grid :table-title="$t('AbpIdentity.Users')">
      <template #toolbar-tools>
        <Button type="primary" @click="handleAdd">
          <AddIcon /> {{ $t('AbpIdentity.NewUser') }}
        </Button>
      </template>
      <template #active="{ row }">
        <div class="flex flex-row justify-center">
          <div :class="row.isActive ? 'text-green-600' : 'text-red-600'">
            <CheckIcon v-if="row.isActive" />
            <CloseIcon v-else />
          </div>
        </div>
      </template>
      <template>
        <div class="flex flex-row">
          <div class="basis-1/3">
            <Button block type="link">
              {{ $t('AbpUi.Edit') }}
            </Button>
          </div>
          <div class="basis-1/3">
            <Button block danger type="link">
              {{ $t('AbpUi.Delete') }}
            </Button>
          </div>
          <div class="basis-1/3">
            <Dropdown>
              <template #overlay>
                <Menu>
                  <MenuItem key="lock">
                    {{ $t('AbpIdentity.Lock') }}
                  </MenuItem>
                  <MenuItem key="unlock">
                    {{ $t('AbpIdentity.UnLock') }}
                  </MenuItem>
                  <MenuItem key="permissions" :icon="h(PermissionsOutlined)">
                    {{ $t('AbpPermissionManagement.Permissions') }}
                  </MenuItem>
                  <MenuItem key="claims" :icon="h(ClaimOutlined)">
                    {{ $t('AbpIdentity.ManageClaim') }}
                  </MenuItem>
                  <MenuItem key="password" :icon="h(PasswordIcon)">
                    {{ $t('AbpIdentity.SetPassword') }}
                  </MenuItem>
                  <MenuItem key="menus" :icon="h(MenuOutlined)">
                    {{ $t('AppPlatform.Menu:Manage') }}
                  </MenuItem>
                  <MenuItem key="entity-changes" :icon="h(AuditLogIcon)">
                    {{ $t('AbpAuditLogging.EntitiesChanged') }}
                  </MenuItem>
                </Menu>
              </template>
              <Button type="link" />
            </Dropdown>
          </div>
        </div>
      </template>
    </Grid>
    <EditModal />
  </Page>
</template>

<style></style>
