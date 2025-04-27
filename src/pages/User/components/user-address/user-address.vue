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
        <td>{{ address.consignee }}</td>
        <td>{{ address.phone }}</td>
        <td>{{ address.region }}</td>
        <td>{{ address.detail }}</td>
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
              backgroundColor: address.is_default ? 'rgb(242, 99, 113)' : '',
              color: address.is_default ? 'white' : '',
            }">
            {{ address.is_default ? '默认地址' : '设为默认' }}
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
            <label for="region" class="shrink-0 w-23"
              ><span class="text-font-primary">*</span>地址信息:</label
            >
            <select v-model="newAddress.region" required class="mr-[20px]">
              <option value="" disabled class="text-font-primary">
                请选择省/市/区/街道
              </option>
              <option
                v-for="option in addressOptions"
                :key="option"
                :value="option">
                {{ option }}
              </option>
            </select>
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
                @blur="validateAddress"
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
              @input="validateName"
              required />
          </div>
          <div class="flex">
            <label for="address" class="shrink-0 w-23"
              ><span class="text-font-primary">*</span>手机号码:</label
            >
            <span class="w-full mr-[20px]">
              <input
                type="tel"
                placeholder="必填"
                v-model="newAddress.phone"
                @input="validatePhone"
                required />
              <p v-if="phoneError" class="text-red-500">{{ phoneError }}</p>
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
const editingAddressId = ref('');
const newAddress = ref({
  user_id: '02',
  name: '',
  phone: '',
  region: [''],
  address: '',
  isDefault: false,
});

const nameError = ref('');
const addressError = ref('');
const phoneError = ref('');

// 使用computed获取地址列表
const addressList = computed(() => {
  return addressStore.addresses.map((addr) => ({
    id: addr.id,
    user_id: addr.user_id,
    consignee: addr.consignee,
    phone: addr.phone,
    region: Array.isArray(addr.region) ? addr.region.join(' ') : addr.region,
    detail: addr.detail,
    is_default: addr.is_default,
  }));
});

// 示例地址选项
const addressOptions = ref([
  '成都市/郫都区',
  '成都市/青羊区',
  '成都市/金牛区',
  '成都市/成华区',
  '成都市/高新区',
  '成都市/锦江区',
  '成都市/温江区',
  '成都市/双流区',
  '成都市/龙泉驿区',
  // 添加更多选项
]);

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
  if (address.is_default) {
    return;
  }
  try {
    await addressStore.setDefaultAddress(address.id);
  } catch (error) {
    console.error('设置默认地址失败:', error);
  }
}

// 收货人姓名校验
const validateName = () => {
  if (newAddress.value.name.length > 25) {
    nameError.value = '收货人姓名不能超过25个字符';
  } else {
    nameError.value = '';
  }
};

// 详细地址校验
const validateAddress = () => {
  const addressLength = newAddress.value.address.length;
  const emojiPattern = /[\u{1F600}-\u{1F64F}]/u; // 简单的表情符号检测
  if (
    addressLength < 2 ||
    addressLength > 120 ||
    emojiPattern.test(newAddress.value.address)
  ) {
    addressError.value =
      '详细地址长度需要在2-120个字符之间，且不能包含表情符号';
    alert('详细地址长度需要在2-120个字符之间，且不能包含表情符号');
  } else {
    addressError.value = '';
  }
};

// 手机号码校验
const validatePhone = () => {
  const phonePattern = /^[0-9]{10,11}$/; // 假设电话号码为10到11位数字
  if (!phonePattern.test(newAddress.value.phone)) {
    phoneError.value = '请输入有效的电话号码';
  } else {
    phoneError.value = '';
  }
};

// 添加新地址
async function addNewAddress() {
  try {
    const addressData = {
      user_id: newAddress.value.user_id,
      consignee: newAddress.value.name,
      phone: newAddress.value.phone,
      region: newAddress.value.region,
      detail: newAddress.value.address,
      is_default: newAddress.value.isDefault,
    };

    // 保证全局唯一
    if (addressData.is_default) {
      for (const addr of addressStore.addresses) {
        if (addr.is_default && addr.id !== editingAddressId.value) {
          await addressStore.updateAddress(addr.id, {
            ...addr,
            is_default: false,
          });
        }
      }
    }

    if (editingAddressId.value) {
      await addressStore.updateAddress(editingAddressId.value, addressData);
    } else {
      await addressStore.addAddress(addressData);
    }

    showNewAddressModal.value = false;
    editingAddressId.value = '';
    newAddress.value = {
      user_id: '02',
      name: '',
      phone: '',
      region: [''],
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
  // 编辑地址
  console.log('ditingAddressId', editingAddressId.value, address.id);
  newAddress.value = {
    // id: address.id,
    user_id: '02',
    name: address.consignee,
    phone: address.phone,
    region: address.region,
    address: address.detail,
    isDefault: address.is_default,
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
select {
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
