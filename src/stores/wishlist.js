import { defineStore } from "pinia";
import { ref } from "vue";
import axios from "axios";

export const useWishlistStore = defineStore("wishlist", () => {
  const wishlist = ref([]);

  const fetchWishlist = async () => {
    try {
      const response = await axios.get("http://localhost:3000/wishlist");
      wishlist.value = response.data;
    } catch (error) {
      console.error("Error fetching wishlist:", error);
    }
  };

  const addToWishlist = async (productId) => {
    try {
      const response = await axios.post("http://localhost:3000/wishlist", {
        productId,
      });
      wishlist.value.push(response.data);
    } catch (error) {
      console.error("Error adding to wishlist:", error);
    }
  };

  const removeFromWishlist = async (productId) => {
    try {
      await axios.delete(`http://localhost:3000/wishlist/${productId}`);
      wishlist.value = wishlist.value.filter((item) => item.id !== productId);
    } catch (error) {
      console.error("Error removing from wishlist:", error);
    }
  };

  return {
    wishlist,
    fetchWishlist,
    addToWishlist,
    removeFromWishlist,
  };
});
