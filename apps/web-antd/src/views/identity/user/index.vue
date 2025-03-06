<script setup lang="ts">
import type { IdentityUserDto } from '@abp/identity';
import type { VbenFormProps, VxeGridProps } from '@abp/ui';

import { defineAsyncComponent } from 'vue';

import { Page, useVbenModal } from '@vben/common-ui';
import { $t } from '@vben/locales';

import { useUsersApi } from '@abp/identity';
import { useVbenVxeGrid } from '@abp/ui';
import { Button } from 'ant-design-vue';

import { useIcon } from '#/icons';

const { IconAdd, IconCheck, IconClose, IconDelete, IconEdit } = useIcon();

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

const handleEdit = (row: IdentityUserDto) => {
  userModalApi.setData(row as IdentityUserDto);
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
      width: 180,
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
          <div class="basis-1/2">
            <Button @click="handleEdit(row)" block type="link">
              <IconEdit />
              {{ $t('AbpUi.Edit') }}
            </Button>
          </div>
          <div class="basis-1/2">
            <Button block danger type="link">
              <IconDelete />
              {{ $t('AbpUi.Delete') }}
            </Button>
          </div>
        </div>
      </template>
    </Grid>
    <EditModal />
  </Page>
</template>

<style></style>
