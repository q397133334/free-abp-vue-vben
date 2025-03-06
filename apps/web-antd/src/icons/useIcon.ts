import { createIconifyIcon } from '@vben/icons';

export function useIcon() {
  const IconAdd = createIconifyIcon('ant-design:plus-outlined');
  const IconCheck = createIconifyIcon('ant-design:check-outlined');
  const IconClose = createIconifyIcon('ant-design:close-outlined');
  const IconEdit = createIconifyIcon('ant-design:edit-outlined');
  const IconDelete = createIconifyIcon('ant-design:delete-outlined');
  const MenuOutlined = createIconifyIcon('heroicons-outline:menu-alt-3');
  const IconPermissionsOutlined = createIconifyIcon(
    'icon-park-outline:permissions',
  );

  return {
    IconAdd,
    IconCheck,
    IconClose,
    IconDelete,
    IconEdit,
    IconPermissionsOutlined,
    MenuOutlined,
  };
}
