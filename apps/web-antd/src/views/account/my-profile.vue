<script lang="ts" setup>
import type { ChangePasswordInput, UpdateProfileDto } from '@abp/account';

import { onMounted, ref } from 'vue';

import { Page } from '@vben/common-ui';
import { $t } from '@vben/locales';

import { useProfileApi } from '@abp/account';
import { message, TabPane, Tabs } from 'ant-design-vue';

import { useVbenForm, z } from '#/adapter/form';

defineOptions({
  name: 'MyProfile',
});
const activeKey = ref('1');

onMounted(async () => {
  const res = await get();
  personalFormApi.setValues(res);
  changePasswordFormApi.resetForm();
});

const { get, update, changePassword } = useProfileApi();

const [personalForm, personalFormApi] = useVbenForm({
  wrapperClass: 'grid-cols-1',
  actionWrapperClass: 'text-center max-w-3xl',
  commonConfig: {
    componentProps: {
      class: 'w-full max-w-3xl',
    },
  },
  layout: 'horizontal',
  handleSubmit: async () => {
    await update((await personalFormApi.getValues()) as UpdateProfileDto);
    message.success(
      $t('AbpAccount.PersonalSettingsChangedConfirmationModalTitle'),
    );
  },
  resetButtonOptions: {
    show: false,
  },
  submitButtonOptions: {
    content: $t('AbpAccount.PersonalSettingsSaved'),
  },
  schema: [
    {
      fieldName: 'userName',
      label: $t('AbpAccount.DisplayName:UserName'),
      component: 'Input',
      componentProps: {
        placeholder: '',
        disabled: true,
      },
      rules: 'required',
    },
    {
      fieldName: 'name',
      label: $t('AbpAccount.DisplayName:Name'),
      component: 'Input',
      componentProps: {
        placeholder: '',
      },
      rules: 'required',
    },
    {
      fieldName: 'email',
      label: $t('AbpAccount.DisplayName:Email'),
      component: 'Input',
      componentProps: {
        placeholder: '',
      },
      rules: 'required',
    },
    {
      fieldName: 'surname',
      label: $t('AbpAccount.DisplayName:Surname'),
      component: 'Input',
      componentProps: {
        placeholder: '',
      },
    },
    {
      fieldName: 'phoneNumber',
      label: $t('AbpAccount.DisplayName:PhoneNumber'),
      component: 'Input',
      componentProps: {
        placeholder: '',
      },
      rules: 'required',
    },
  ],
});

const [changePasswordForm, changePasswordFormApi] = useVbenForm({
  wrapperClass: 'grid-cols-1',
  actionWrapperClass: 'text-center max-w-3xl',
  commonConfig: {
    componentProps: {
      class: 'w-full max-w-3xl',
    },
  },
  layout: 'horizontal',
  resetButtonOptions: {
    show: false,
  },
  submitButtonOptions: {},
  handleSubmit: async () => {
    await changePassword(
      (await changePasswordFormApi.getValues()) as ChangePasswordInput,
    );
    message.success($t('AbpAccount.PasswordChangedMessage'));
    changePasswordFormApi.resetForm();
  },
  schema: [
    {
      fieldName: 'currentPassword',
      label: $t('AbpAccount.DisplayName:CurrentPassword'),
      component: 'Input',
      componentProps: {
        placeholder: '',
        type: 'password',
        autocomplete: 'current-password',
      },
      rules: 'required',
    },
    {
      fieldName: 'newPassword',
      label: $t('AbpAccount.DisplayName:NewPassword'),
      component: 'Input',
      componentProps: {
        placeholder: '',
        type: 'password',
        autocomplete: 'new-password',
      },
      rules: 'required',
    },
    {
      fieldName: 'newPasswordRepeat',
      label: $t('AbpAccount.DisplayName:NewPasswordConfirm'),
      component: 'Input',
      componentProps: {
        placeholder: '',
        type: 'password',
        autocomplete: 'new-password',
      },
      dependencies: {
        triggerFields: ['newPassword'],
        rules(values) {
          return z.string().refine((value) => value === values.newPassword, {
            message: $t(
              'AbpIdentity.Volo_Abp_Identity:PasswordConfirmationFailed',
            ),
          });
        },
      },
    },
  ],
});
</script>
<template>
  <Page auto-content-height>
    <Tabs
      v-model:active-key="activeKey"
      tab-position="left"
      :label="$t('AbpAccount.MyProfile')"
    >
      <TabPane key="1" :tab="$t('AbpAccount.ProfileTab:PersonalInfo')">
        <personalForm />
      </TabPane>
      <TabPane key="2" :tab="$t('AbpAccount.ProfileTab:Password')">
        <changePasswordForm />
      </TabPane>
    </Tabs>
  </Page>
</template>
