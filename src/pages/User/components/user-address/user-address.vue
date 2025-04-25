<template>
  <div class="w-full pt-10 flex justify-between">
    <div>
      <div class="font-medium text-lg">我的收货地址</div>
      <p class="text-[#808080] text-sm">常用地址</p>
    </div>
    <div>
      <button
        class="w-[100px] p-2 rounded-sm border-[1px] border-bg-fifth"
        @click="showNewAddressModal = true">
        添加地址
      </button>
    </div>
  </div>
  <table class="w-full border-t-1 border-bg-primary px-2 text-sm">
    <thead>
      <tr>
        <th>收货人</th>
        <th>电话</th>
        <th>所在地区</th>
        <th>详细地址</th>
        <th>操作</th>
        <th>移动设置</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="address in addressList" :key="address.id">
        <td>{{ address.name }}</td>
        <td>{{ address.phone }}</td>
        <td>{{ address.region }}</td>
        <td>{{ address.address }}</td>
        <td>
          <button class="mx-2 h-8" @click="editAddress(address)">修改</button>
          <button class="mx-2 h-8" @click="deleteAddress(address.id)">
            删除
          </button>
        </td>
        <td>
          <button
            class="w-[90px] h-8"
            @click="setDefaultAddress(address)"
            :style="{
              backgroundColor: address.isDefault ? 'rgb(242, 99, 113)' : '',
              color: address.isDefault ? 'white' : '',
            }">
            {{ address.isDefault ? '默认地址' : '设为默认' }}
          </button>
        </td>
      </tr>
    </tbody>
  </table>
  <div
    v-if="showNewAddressModal"
    class="modal-overlay"
    @click="showNewAddressModal = false">
    <div class="modal-content text-right px-4 py-10" @click.stop>
      <h5 class="text-left">添加收货地址</h5>
      <form @submit.prevent="addNewAddress" class="py-6">
        <div class="flex flex-col gap-6">
          <!-- 地址信息 -->
          <div class="flex">
            <label for="address" class="shrink-0 w-23"
              ><span class="text-font-primary">*</span>地址信息:</label
            ><input
              type="text"
              v-model="newAddress.region"
              required
              placeholder="请选择省/市/区/街道" />
          </div>
          <!-- 详细地址 -->
          <div class="flex">
            <label for="address" class="shrink-0 w-23"
              ><span class="text-font-primary">*</span>详细信息:</label
            >
            <span class="w-full mr-[20px]">
              <textarea
                class="h-24 resize-none outline-none"
                placeholder="请输入详细地址信息，如道路，门牌号，小区，楼栋号，单元等信息"
                v-model="newAddress.address"
                required />
              <p class="text-xs text-font-primary text-left">
                详细地址长度需要在2-120个汉字或字符，不能包含表情符号
              </p>
            </span>
          </div>
          <!-- 收货人 -->
          <div class="flex items-center">
            <label for="address" class="shrink-0 w-23"
              ><span class="text-font-primary">*</span>收货人姓名:</label
            >
            <input
              type="text"
              placeholder="长度不超过25字符"
              v-model="newAddress.name"
              required />
          </div>
          <div class="flex">
            <label for="address" class="shrink-0 w-23"
              ><span class="text-font-primary">*</span>手机号码:</label
            >
            <span class="w-full mr-[20px]">
              <input
                type="text"
                placeholder="必填"
                v-model="newAddress.phone"
                required />
              <!-- 设置为默认地址 -->

              <div class="py-2 flex items-center">
                <input
                  type="checkbox"
                  v-model="newAddress.isDefault"
                  id="defaultAddress" />
                <label for="defaultAddress" class="ml-2">设为默认地址</label>
              </div>
            </span>
          </div>
        </div>

        <div class="flex justify-evenly pt-2">
          <button
            type="button"
            @click="showNewAddressModal = false"
            class="border-[1px] border-bg-primary text-font-thirth w-20 h-8 rounded-1">
            取消
          </button>
          <button
            type="submit"
            class="bg-font-primary text-white w-20 h-8 rounded-1">
            确认
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
<script>
export default {
  name: 'UserAddress',
};
</script>
<script setup>
import { ref, onMounted, computed } from 'vue';
import { useAddressStore } from '/src/stores/address';

const addressStore = useAddressStore();
const showNewAddressModal = ref(false);
const editingAddressId = ref(null);
const newAddress = ref({
  name: '',
  phone: '',
  region: '',
  address: '',
  isDefault: false,
});

// 使用computed获取地址列表
const addressList = computed(() => {
  return addressStore.addresses.map((addr) => ({
    id: addr.id,
    name: addr.consignee,
    phone: addr.phone,
    region: Array.isArray(addr.region) ? addr.region.join(' ') : addr.region,
    address: addr.detail,
    isDefault: addr.is_default,
  }));
});

// 初始化加载地址列表
onMounted(async () => {
  try {
    await addressStore.fetchAddresses();
  } catch (error) {
    console.error('加载地址失败:', error);
  }
});

// 设置默认地址
async function setDefaultAddress(address) {
  try {
    await addressStore.setDefaultAddress(address.id);
  } catch (error) {
    console.error('设置默认地址失败:', error);
  }
}

// 添加新地址
async function addNewAddress() {
  try {
    const addressData = {
      user_id: '02',
      consignee: newAddress.value.name,
      phone: newAddress.value.phone,
      region: newAddress.value.region.split(' '),
      detail: newAddress.value.address,
      is_default: newAddress.value.isDefault,
    };

    if (editingAddressId.value) {
      // 编辑现有地址
      if (newAddress.value.isDefault) {
        // 如果设置为默认地址，先将其他地址设置为非默认
        for (const addr of addressList.value) {
          if (addr.isDefault && addr.id !== editingAddressId.value) {
            await addressStore.updateAddress(addr.id, {
              ...addr,
              is_default: false,
            });
          }
        }
      }
      await addressStore.updateAddress(editingAddressId.value, addressData);
    } else {
      // 添加新地址
      if (newAddress.value.isDefault) {
        // 如果设置为默认地址，先将其他地址设置为非默认
        for (const addr of addressList.value) {
          if (addr.isDefault) {
            await addressStore.updateAddress(addr.id, {
              ...addr,
              is_default: false,
            });
          }
        }
      }
      await addressStore.addAddress(addressData);
    }

    showNewAddressModal.value = false;
    editingAddressId.value = null;
    newAddress.value = {
      name: '',
      phone: '',
      region: '',
      address: '',
      isDefault: false,
    };
  } catch (error) {
    console.error('保存地址失败:', error);
  }
}

// 编辑地址
function editAddress(address) {
  editingAddressId.value = address.id;
  newAddress.value = {
    name: address.name,
    phone: address.phone,
    region: address.region,
    address: address.address,
    isDefault: address.isDefault,
  };
  showNewAddressModal.value = true;
}

// 删除地址
async function deleteAddress(id) {
  if (confirm('确定要删除这个地址吗？')) {
    try {
      await addressStore.deleteAddress(id);
    } catch (error) {
      console.error('删除地址失败:', error);
    }
  }
}
</script>
<style scoped>
td,
th {
  border-bottom: 1px solid #e5e5e5;
  padding: 10px 20px;
}
th {
  background: rgb(229, 229, 229, 0.2);
  font-size: 18px;
}
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(66, 68, 67, 0.15);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: white;
  border-radius: 34px;
  width: 660px;
  height: 500px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}
textarea {
  border: 1px solid #e5e5e5;
  border-radius: 7px;
  margin: 0 10px;
  padding: 0 10px;
  width: 100%;
}
span > p {
  margin: 0 10px;
}
input {
  border: 1px solid #e5e5e5;
  border-radius: 7px;
  height: 36px;
  margin: 0 10px;
  padding: 0 10px;
  outline: none;
  width: 100%;
}
input::placeholder {
  color: #d2d2d2;
  font-size: 14px;
}
textarea::placeholder {
  color: #d2d2d2;
  font-size: 14px;
}
label {
  color: #424443;
}
input[type='checkbox'] {
  width: 18px;
  height: 18px;
  margin: 0 10px;
  outline: none;
}
button:hover {
  color: #f26371;
}
</style>
