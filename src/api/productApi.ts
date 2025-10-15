import axiosClient from "./axiosClient";

export const productApi = {
  getProductSource: async (sourceType: string) => {
    // Call API to get products by sourceType
    try {
      const response = await axiosClient.get(
        `products?sourceType=${sourceType}&category=RAW_MATERIAL`
      );
      return response.data;
    } catch (error) {
      console.error("Error while fetching products by sourceType:", error);
      throw error;
    }
  },
  getProductProcessed: async (sourceType: string) => {
    try {
      const response = await axiosClient.get(
        `products?sourceType=${sourceType}&category=FINISHED_GOOD`
      );
      return response.data;
    } catch (error) {
      console.error("Error while fetching products by processedType:", error);
      throw error;
    }
  },
};
