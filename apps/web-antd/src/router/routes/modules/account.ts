import type { RouteRecordRaw } from 'vue-router';

import { $t } from '#/locales';

const routes: RouteRecordRaw[] = [
  {
    meta: {
      title: $t('AbpAccount.Menu:Account'),
      icon: 'carbon:account',
      hideInMenu: true,
    },
    name: 'AbpAccount',
    path: '/account',
    children: [
      {
        meta: {
          hideInMenu: true,
          title: $t('AbpAccount.MyAccount'),
          icon: 'icon-park-outline:personal-collection',
        },
        name: 'AbpAccountMyProfile',
        path: '/account/my-profile',
        component: () => import('#/views/account/my-profile.vue'),
      },
    ],
  },
];

export default routes;
