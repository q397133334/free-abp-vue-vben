<script lang="ts" setup>
import type { IdentityUserDto } from '@/abp/identity';
import type { FormInstance } from 'ant-design-vue/es/form/Form';

import { defineOptions, ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';
import { $t } from '@vben/locales';

import { Form, Input, InputPassword, Tabs } from 'ant-design-vue';

defineOptions({
  name: 'IdentityUserModal',
});
// const emits = defineEmits<{
//   (event: 'change', data: IdentityUserDto): void;
// }>();
const FormItem = Form.Item;
const TabPane = Tabs.TabPane;

const formModel = {
  isActived: true,
} as IdentityUserDto;

const activateTab = ref('info');
const form = ref<FormInstance>();

const [Modal, modalApi] = useVbenModal({
  overlayBlur: 3,
  closeOnClickModal: false,
  title: $t('AbpIdentity.Users'),
  draggable: true,
  fullscreenButton: false, // 全屏按钮
  onCancel() {
    modalApi.close();
  },
  onConfirm: async () => {
    modalApi.close();
  },
  onOpenChange(isOpen: boolean) {
    if (!isOpen) {
      modalApi.close();
    }
  },
});
</script>
<template>
  <Modal>
    <Form
      ref="form"
      :model="formModel"
      :label-col="{ span: 6 }"
      :wrapper-col="{ span: 18 }"
    >
      <Tabs v-model:activate-key="activateTab">
        <TabPane key="info" :tab="$t('AbpIdentity.UserInformations')">
          <FormItem label="用户名" required>
            <Input v-model="formModel.userName" />
          </FormItem>
          <FormItem label="邮箱" required>
            <Input v-model="formModel.email" />
          </FormItem>
          <FormItem label="密码" required>
            <InputPassword v-model="formModel.password" />
          </FormItem>
          <FormItem label="确认密码" required>
            <InputPassword v-model="formModel.confirmPassword" />
          </FormItem>
          <FormItem label="是否激活">
            <CheckBox v-model="formModel.isActived" />
          </FormItem>
        </TabPane>
        <TabPane key="roles" :tab="$t('AbpIdentity.Roles')" />
        <!-- <TabPane key="claims" :tab="$t('AbpIdentity.OrganizationUnits')" /> -->
      </Tabs>
    </Form>
  </Modal>
</template>
<style lang="scss" scoped></style>
