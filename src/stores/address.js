import { defineStore } from 'pinia';
import axios from 'axios';
import { API_URL } from '/src/pages/const/index';

export const useAddressStore = defineStore('address', {
  state: () => ({
    addresses: [],
    loading: false,
    error: null,
  }),

  getters: {
    // 获取默认地址
    defaultAddress: (state) => state.addresses.find((addr) => addr.is_default),

    // 获取用户的所有地址
    userAddresses: (state) => (userId) =>
      state.addresses.filter((addr) => addr.user_id === userId),
  },

  actions: {
    // 获取所有地址
    async fetchAddresses() {
      this.loading = true;
      try {
        const response = await axios.get(`${API_URL}/addresses`, {
          params: { user_id: '02' },
        });

        // 确保返回的数据格式正确
        this.addresses = response.data.map((addr) => ({
          id: addr.id || '',
          user_id: addr.user_id || '02',
          consignee: addr.consignee || '',
          phone: addr.phone || '',
          region: addr.region || '',
          detail: addr.detail || '',
          is_default: addr.is_default || false,
        }));

        console.log('获取到的地址列表:', this.addresses);
        this.error = null;
      } catch (error) {
        this.error = error.message;
        console.error('获取地址失败:', error);
      } finally {
        this.loading = false;
      }
    },

    // 添加新地址
    async addAddress(addressData) {
      this.loading = true;
      try {
        const response = await axios.post(`${API_URL}/addresses`, addressData);
        this.addresses.push(response.data);
        this.error = null;
        return response.data;
      } catch (error) {
        this.error = error.message;
        console.error('添加地址失败:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // 更新地址
    async updateAddress(addressId, addressData) {
      this.loading = true;
      try {
        console.log('开始更新地址，ID:', addressId);
        console.log('更新数据:', addressData);

        // 检查地址ID是否有效
        if (!addressId) {
          throw new Error('无效的地址ID');
        }

        // 保持原有数据
        const originalAddress = this.addresses.find(
          (addr) => String(addr.id) === String(addressId)
        );
        if (!originalAddress) {
          throw new Error('地址不存在');
        }

        // 构建更新数据
        const updateData = {
          id: String(addressId),
          user_id: originalAddress.user_id,
          consignee: addressData.consignee,
          phone: addressData.phone,
          region: addressData.region,
          detail: addressData.detail,
          is_default: addressData.is_default,
        };

        console.log(
          '发送更新请求:',
          `${API_URL}/addresses/${String(addressId)}`
        );
        console.log('请求数据:', updateData);

        const response = await axios.put(
          `${API_URL}/addresses/${String(addressId)}`,
          updateData
        );

        console.log('更新响应:', response.data);

        // 更新本地状态
        if (response.data.code === 200) {
          this.addresses = this.addresses.map((addr) => {
            if (String(addr.id) === String(addressId)) {
              return { ...addr, ...updateData };
            }
            return addr;
          });
        }

        this.error = null;
        return response.data;
      } catch (error) {
        this.error = error.message;
        console.error('更新地址失败:', error);
        if (error.response) {
          console.error('错误响应:', error.response.data);
          console.error('错误状态:', error.response.status);
        }
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // 删除地址
    async deleteAddress(addressId) {
      this.loading = true;
      try {
        await axios.delete(`${API_URL}/addresses/${addressId}`);
        this.addresses = this.addresses.filter((addr) => addr.id !== addressId);
        this.error = null;
      } catch (error) {
        this.error = error.message;
        console.error('删除地址失败:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // 设置默认地址
    async setDefaultAddress(addressId) {
      this.loading = true;
      try {
        console.log('设置默认地址，ID:', addressId);

        // 检查地址ID是否有效
        if (!addressId) {
          throw new Error('无效的地址ID');
        }

        // 确保ID是字符串
        const stringId = String(addressId);

        // 找到要设置为默认的地址
        const address = this.addresses.find(
          (addr) => String(addr.id) === stringId
        );
        if (!address) {
          throw new Error('地址不存在');
        }

        // 如果已经是默认地址，直接返回
        if (address.is_default) {
          console.log('该地址已经是默认地址');
          return;
        }

        // 找到当前默认地址
        const currentDefault = this.addresses.find((addr) => addr.is_default);

        // 准备批量更新数据
        const updates = [];

        // 如果有当前默认地址，添加到更新列表
        if (currentDefault) {
          updates.push({
            id: currentDefault.id,
            data: { ...currentDefault, is_default: false },
          });
        }

        // 添加新的默认地址到更新列表
        updates.push({
          id: stringId,
          data: { ...address, is_default: true },
        });

        // 批量更新地址
        for (const update of updates) {
          console.log('更新地址:', update.id);
          await this.updateAddress(update.id, update.data);
        }

        // 更新本地状态
        this.addresses = this.addresses.map((addr) => {
          if (String(addr.id) === stringId) {
            return { ...addr, is_default: true };
          }
          if (addr.is_default) {
            return { ...addr, is_default: false };
          }
          return addr;
        });

        this.error = null;
      } catch (error) {
        this.error = error.message;
        console.error('设置默认地址失败:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },
  },
});
