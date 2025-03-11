<script lang="ts" setup>
import type { UpdateProfileDto } from '@abp/account';
import type { FormInstance } from 'ant-design-vue';

import { ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';
import { $t } from '@vben/locales';

import { useProfileApi } from '@abp/account';
import { Form, Input } from 'ant-design-vue';

defineOptions({
  name: 'MyProfileModal',
});

const form = ref<FormInstance>();
const formModel = ref<UpdateProfileDto>({} as UpdateProfileDto);

const [Modal, modalApi] = useVbenModal({
  title: $t('AbpAccount.MyProfile'),
  onCancel() {
    modalApi.close();
  },
  onConfirm: async () => {},
  onOpenChange: async (isOpen: boolean) => {
    if (isOpen) {
      const { get } = useProfileApi();
      const profile = await get();
      formModel.value = profile;
      formModel.value = {
        userName: profile.userName,
        name: profile.name,
        surname: profile.surname,
        email: profile.email,
        phoneNumber: profile.phoneNumber,
        concurrencyStamp: profile.concurrencyStamp,
        extraProperties: profile.extraProperties,
      };
    }
  },
});
</script>
<template>
  <Modal>
    <Form
      ref="form"
      :label-col="{ span: 6 }"
      :model="formModel"
      :wrapper-col="{ span: 18 }"
    >
      <Form.Item
        :label="$t('AbpAccount.DisplayName:Name')"
        name="name"
        required
      >
        <Input v-model:value="formModel.name" />
      </Form.Item>
      <Form.Item
        :label="$t('AbpAccount.DisplayName:Email')"
        name="email"
        required
      >
        <Input v-model:value="formModel.email" />
      </Form.Item>
      <Form.Item :label="$t('AbpAccount.DisplayName:Surname')" name="surname">
        <Input v-model:value="formModel.surname" />
      </Form.Item>
      <Form.Item :label="$t('AbpAccount.DisplayName:Phone')" name="phoneNumber">
        <Input v-model:value="formModel.phoneNumber" />
      </Form.Item>
    </Form>
  </Modal>
</template>
