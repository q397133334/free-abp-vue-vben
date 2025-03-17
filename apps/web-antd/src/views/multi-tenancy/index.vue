<script setup lang="ts">
import type { TenantDto } from '@abp/multi-tenancy';
import type { VxeGridProps } from '@abp/ui';

import { Page } from '@vben/common-ui';
import { $t } from '@vben/locales';

import { useTenantsApi } from '@abp/multi-tenancy';
import { useVbenVxeGrid } from '@abp/ui';

defineOptions({
  name: 'Tenant',
});

const { getPagedListApi } = useTenantsApi();

const gridOptions: VxeGridProps<TenantDto> = {
  columns: [
    {
      field: 'name',
      title: $t('AbpUiMultiTenancy.Name'),
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

const [Grid] = useVbenVxeGrid({
  gridOptions,
});
</script>
<template>
  <Page auto-content-height>
    <Grid />
  </Page>
</template>
