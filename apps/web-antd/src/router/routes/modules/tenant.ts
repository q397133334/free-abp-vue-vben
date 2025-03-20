import type { RouteRecordRaw } from 'vue-router';

import { $t } from '#/locales';

const routes: RouteRecordRaw[] = [
  {
    meta: {
      title: $t('AbpTenantManagement.Menu:TenantManagement'),
      icon: 'mdi:warehouse',
      authority: ['AbpTenantManagement.Tenants'],
    },
    name: 'AbpTenantManagement',
    path: '/tenant-management',
    children: [
      {
        meta: {
          title: $t('AbpTenantManagement.Tenants'),
          icon: 'ant-design:team-outlined',
          authority: ['AbpTenantManagement.Tenants'],
        },
        name: 'AbpTenantManagement.Tenants',
        path: '/tenant-management/tenants',
        component: () => import('#/views/tenant/index.vue'),
      },
    ],
  },
];

export default routes;
