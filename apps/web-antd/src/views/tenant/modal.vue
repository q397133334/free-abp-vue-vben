<script setup lang="ts">
import type { TenantCreateDto } from '@abp/tenant';

import { useVbenModal } from '@vben/common-ui';
import { $t } from '@vben/locales';

import { useTenantsApi } from '@abp/tenant';
import { useVbenForm, z } from '@abp/ui';
import { message } from 'ant-design-vue';

defineOptions({
  name: 'TenantModal',
});

const emits = defineEmits<{
  (event: 'change'): void;
}>();

const [Modal, modalApi] = useVbenModal({
  draggable: true,
  fullscreenButton: false,
  onCancel() {
    modalApi.close();
  },
  onClosed() {},
  onConfirm: async () => {
    formApi.validateAndSubmitForm();
  },
  onOpenChange: async (isOpen) => {
    if (isOpen) {
      formApi.resetForm();
      formApi.setState(() => {
        return {
          schema: defaultSchema,
          title: $t('AbpTenantManagement.NewTenant'),
        };
      });
      if (modalApi.getData()?.id) {
        formApi.setState((prev) => {
          const currentSchema = prev?.schema ?? [];
          return {
            schema: currentSchema.slice(0, -3),
            title: $t('AbpUi.Edit'),
          };
        });
        const { getApi } = useTenantsApi();
        const tenant = await getApi(modalApi.getData()?.id);
        formApi.setValues(tenant);
      }
    }
  },
});
const defaultSchema = [
  {
    component: 'Input',
    fieldName: 'name',
    label: $t('AbpTenantManagement.DisplayName:TenantName'),
    componentProps: {
      placeholder: '',
    },
    rules: 'required',
  },
  {
    component: 'Input',
    fieldName: 'adminEmailAddress',
    label: $t('AbpTenantManagement.DisplayName:AdminEmailAddress'),
    componentProps: {
      placeholder: '',
    },
    rules: 'required',
  },
  {
    component: 'Input',
    fieldName: 'adminPassword',
    label: $t('AbpTenantManagement.DisplayName:AdminPassword'),
    componentProps: {
      placeholder: '',
      type: 'password',
      autocomplete: 'current-password',
    },
    rules: 'required',
  },
  {
    component: 'Input',
    fieldName: 'adminPasswordRepeat',
    label: $t('abp.AbpTenantManagement.AdminPasswordRepeat'),
    componentProps: {
      placeholder: '',
      type: 'password',
      autocomplete: 'current-password',
    },
    dependencies: {
      triggerFields: ['adminPassword'],
      rules(values: Record<string, any>) {
        return z.string().refine((value) => value === values.adminPassword, {
          message: $t(
            'abp.AbpTenantManagement.AdminPasswordConfirmationFailed',
          ),
        });
      },
    },
  },
];
const [Form, formApi] = useVbenForm({
  handleSubmit: async (values) => {
    if (modalApi.getData()?.id) {
      values.id = modalApi.getData()?.id;
      const { updateApi } = useTenantsApi();
      await updateApi(values.id, values as TenantCreateDto);
      message.success($t('AbpUi.SavedSuccessfully'));
    } else {
      const { createApi } = useTenantsApi();
      await createApi(values as TenantCreateDto);
      message.success($t('AbpUi.CreatedSuccessfully'));
    }

    emits('change');
    modalApi.close();
  },
  schema: defaultSchema,
  showDefaultActions: false,
});
</script>
<template>
  <Modal>
    <Form />
  </Modal>
</template>
<style scoped></style>
