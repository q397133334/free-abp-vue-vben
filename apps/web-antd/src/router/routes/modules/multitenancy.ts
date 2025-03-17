import type { RouteRecordRaw } from 'vue-router';

import { $t } from '#/locales';

const routes: RouteRecordRaw[] = [
  {
    meta: {
      title: $t('AbpUiMultiTenancy.Tenant'),
      icon: 'teenyicons:id-outline',
    },
    name: 'AbpMultiTenancy',
    path: '/multi-tenancy',
    component: () => import('#/views/multi-tenancy/index.vue'),
  },
];

export default routes;
