import type { RouteRecordRaw } from 'vue-router';

import { $t } from '#/locales';

const routes: RouteRecordRaw[] = [
  {
    meta: {
      title: $t('abp.identity.title'),
      icon: 'teenyicons:id-outline',
    },
    name: 'AbpIdentity',
    path: '/identity',
    children: [
      {
        meta: {
          title: $t('abp.identity.users.title'),
          icon: 'mdi:user-outline',
        },
        name: 'AbpIdentityUsers',
        path: '/identity/user',
        component: () => import('#/views/identity/user/index.vue'),
      },
      {
        component: () => import('#/views/identity/role/index.vue'),
        name: 'AbpIdentityRoles',
        path: '/identity/roles',
        meta: {
          title: $t('abp.identity.roles.title'),
          icon: 'carbon:user-role',
        },
      },
    ],
  },
];

export default routes;
