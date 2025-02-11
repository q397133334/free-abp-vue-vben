<script lang="ts" setup>
import type { IdentityRoleDto, IdentityUserDto } from '@abp/identity';
import type { FormInstance } from 'ant-design-vue/es/form/Form';

import { defineOptions, ref, toValue } from 'vue';

import { useVbenModal } from '@vben/common-ui';
import { $t } from '@vben/locales';

import { useRolesApi, useUsersApi } from '@abp/identity';
import {
  Checkbox,
  Form,
  Input,
  InputPassword,
  message,
  Tabs,
} from 'ant-design-vue';

defineOptions({
  name: 'IdentityUserModal',
});

const emits = defineEmits<{
  (event: 'change', data: IdentityUserDto): void;
}>();
const { getApi, createApi, updateApi, getRolesApi } = useUsersApi();
const { getPagedListApi } = useRolesApi();

const FormItem = Form.Item;
const TabPane = Tabs.TabPane;

const defaultModal = {
  isActive: true,
};

const activedTab = ref('info');
const form = ref<FormInstance>();
const formModel = ref<IdentityUserDto>({ ...defaultModal });
const roles = ref<IdentityRoleDto[]>([]);

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
    await form.value?.validate();
    const api = formModel.value.id
      ? updateApi(formModel.value.id, toValue(formModel))
      : createApi(toValue(formModel));

    modalApi.setState({
      confirmLoading: true,
    });

    api
      .then((res) => {
        message.success($t('AbpUi.SavedSuccessfully'));
        emits('change', res);
        modalApi.close();
      })
      .finally(() => {
        modalApi.setState({ confirmLoading: false });
      });

    modalApi.close();
  },
  onOpenChange: async (isOpen: boolean) => {
    if (isOpen) {
      activedTab.value = 'info';
      formModel.value = {
        ...defaultModal,
        userName: '',
        email: '',
        password: '',
        surname: '',
        name: '',
        phoneNumber: '',
      };
      modalApi.setState({
        title: $t('AbpIdentity.NewUser'),
        loading: true,
      });

      try {
        const userDto = modalApi.getData<IdentityUserDto>();
        await (userDto?.id
          ? Promise.all([initRoles(), initUserInfo(userDto.id)])
          : initRoles());
      } finally {
        modalApi.setState({
          loading: false,
        });
      }
    } else {
      modalApi.close();
    }
  },
});

async function initUserInfo(userId: string) {
  const user = await getApi(userId);
  const roles = await getRolesApi(userId);
  formModel.value = user;
  formModel.value.roleNames = roles.items.map((role) => role.name);
  modalApi.setState({
    title: `${$t('AbpIdentity.Users')} - ${user.userName}`,
  });
}

async function initRoles() {
  const resultRole = await getPagedListApi({ maxResultCount: 1000 });
  roles.value = resultRole.items;
}
</script>
<template>
  <Modal>
    <Form
      ref="form"
      :model="formModel"
      :label-col="{ span: 6 }"
      :wrapper-col="{ span: 18 }"
    >
      <Tabs v-model:activate-key="activedTab">
        <TabPane key="info" :tab="$t('AbpIdentity.UserInformations')">
          <FormItem :label="$t('AbpIdentity.DisplayName:IsActive')">
            <Checkbox v-model:checked="formModel.isActive">
              {{ $t('AbpIdentity.DisplayName:IsActive') }}
            </Checkbox>
          </FormItem>
          <FormItem
            :label="$t('AbpIdentity.UserName')"
            name="userName"
            required
          >
            <Input
              :disabled="formModel.id !== null"
              autocomplete="username"
              v-model:value="formModel.userName"
            />
          </FormItem>
          <FormItem
            v-if="!formModel.id"
            :label="$t('AbpIdentity.Password')"
            name="password"
            required
          >
            <InputPassword
              autocomplete="new-password"
              v-model:value="formModel.password"
            />
          </FormItem>
          <FormItem
            :label="$t('AbpIdentity.DisplayName:Email')"
            name="email"
            required
          >
            <Input autocomplete="off" v-model:value="formModel.email" />
          </FormItem>
          <FormItem
            :label="$t('AbpIdentity.DisplayName:Surname')"
            name="surname"
          >
            <Input autocomplete="off" v-model:value="formModel.surname" />
          </FormItem>
          <FormItem :label="$t('AbpIdentity.DisplayName:Name')" name="name">
            <Input autocomplete="off" v-model:value="formModel.name" />
          </FormItem>

          <FormItem
            :label="$t('AbpIdentity.DisplayName:PhoneNumber')"
            name="phoneNumber"
          >
            <Input autocomplete="off" v-model:value="formModel.phoneNumber" />
          </FormItem>
        </TabPane>
        <TabPane key="roles" :tab="$t('AbpIdentity.Roles')">
          <FormItem>
            <Checkbox.Group v-model:value="formModel.roleNames">
              <Checkbox
                name="rolelNames"
                v-for="role in roles"
                :key="role.name"
                :value="role.name"
              >
                {{ role.name }}
              </Checkbox>
            </Checkbox.Group>
          </FormItem>
        </TabPane>
        <!-- <TabPane key="claims" :tab="$t('AbpIdentity.OrganizationUnits')" /> -->
      </Tabs>
    </Form>
  </Modal>
</template>
<style lang="scss" scoped></style>
