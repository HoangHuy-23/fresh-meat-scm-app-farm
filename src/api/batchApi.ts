import axiosClient from "./axiosClient";


export const BatchApi = {
    getBatchesByFarm: async () => {
        try {
            const response = await axiosClient.get(`/facilities/my/assets`);
            return response.data;
        } catch (error) {
            console.error('Error while fetching batches:', error);
            throw error;
        }
    },
    createBatch: async (batchData: any) => {
        try {
            const response = await axiosClient.post(`/assets/farming`, batchData);
            return response.data;
        } catch (error) {
            console.error('Error while creating batch:', error);
            throw error;
        }
    },
};