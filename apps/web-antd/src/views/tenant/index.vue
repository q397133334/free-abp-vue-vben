<script setup lang="ts">
import type { TenantDto } from '@abp/tenant';
import type { VbenFormProps, VxeGridProps } from '@abp/ui';

import { defineAsyncComponent } from 'vue';

import { useAccess } from '@vben/access';
import { Page, useVbenModal } from '@vben/common-ui';
import { IconAdd, IconDelete, IconEdit } from '@vben/icons';
import { $t } from '@vben/locales';

import { useTenantsApi } from '@abp/tenant';
import { useVbenVxeGrid } from '@abp/ui';
import { Button, message, Popconfirm } from 'ant-design-vue';

defineOptions({
  name: 'Tenant',
});

const { getPagedListApi } = useTenantsApi();
const { hasAccessByCodes } = useAccess();

const gridOptions: VxeGridProps<TenantDto> = {
  columns: [
    {
      align: 'left',
      field: 'name',
      title: $t('AbpTenantManagement.DisplayName:TenantName'),
    },
    {
      field: 'action',
      fixed: 'right',
      slots: { default: 'action' },
      title: $t('AbpUi.Actions'),
      width: 250,
    },
  ],
  proxyConfig: {
    ajax: {
      query: async ({ page }, formValues) => {
        const { items, totalCount } = await getPagedListApi({
          maxResultCount: page.pageSize,
          skipCount: (page.currentPage - 1) * page.pageSize,
          ...formValues,
        });
        return { items, totalCount };
      },
    },
  },
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
  showCollapseButton: false,
  // 按下回车时是否提交表单
  submitOnEnter: true,
};

const [Grid, { query }] = useVbenVxeGrid({
  formOptions,
  gridOptions,
});

const [TenantModal, tenantModalApi] = useVbenModal({
  connectedComponent: defineAsyncComponent(() => import('./modal.vue')),
});

const [FeatureModel, featureModelApi] = useVbenModal({
  connectedComponent: defineAsyncComponent(
    () => import('../feature/feature-model.vue'),
  ),
});
</script>
<template>
  <Page auto-content-height>
    <Grid :title="$t('AbpTenantManagement.Tenants')">
      <template #toolbar-tools>
        <Button
          type="primary"
          v-if="hasAccessByCodes(['AbpTenantManagement.Tenants.Create'])"
          @click="
            () => {
              tenantModalApi.setData({});
              tenantModalApi.open();
            }
          "
        >
          <IconAdd />
          {{ $t('AbpTenantManagement.NewTenant') }}
        </Button>
      </template>
      <template #action="{ row }">
        <Button
          v-if="hasAccessByCodes(['AbpTenantManagement.Tenants.Update'])"
          type="link"
          size="small"
          @click="
            () => {
              tenantModalApi.setData(row);
              tenantModalApi.open();
            }
          "
        >
          <IconEdit />
          {{ $t('AbpUi.Edit') }}
        </Button>
        <Popconfirm
          v-if="hasAccessByCodes(['AbpTenantManagement.Tenants.Delete'])"
          placement="topRight"
          :title="$t('AbpUi.AreYouSure')"
          @confirm="
            async () => {
              const { deleteApi } = useTenantsApi();
              await deleteApi(row.id);
              message.success($t('AbpUi.DeletedSuccessfully'));
              query();
            }
          "
        >
          <Button type="link" danger size="small">
            <IconDelete />
            {{ $t('AbpUi.Delete') }}
          </Button>
        </Popconfirm>

        <Button
          type="link"
          size="small"
          v-if="
            hasAccessByCodes(['AbpTenantManagement.Tenants.ManageFeatures'])
          "
          @click="
            () => {
              featureModelApi.setData({
                displayName: row.name,
                providerKey: row.id,
                providerName: 'T',
                readonly: true,
              });
              featureModelApi.open();
            }
          "
        >
          {{ $t('AbpTenantManagement.Permission:ManageFeatures') }}
        </Button>
      </template>
    </Grid>
    <TenantModal
      @change="
        () => {
          query();
        }
      "
    />
    <FeatureModel />
  </Page>
</template>
