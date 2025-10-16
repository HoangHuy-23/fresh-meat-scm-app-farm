import axiosClient from "./axiosClient";

export const BatchApi = {
  getBatchesByFarm: async () => {
    try {
      const response = await axiosClient.get(`/facilities/my/assets`);
      return response.data;
    } catch (error) {
      console.error("Error while fetching batches:", error);
      throw error;
    }
  },
  createBatch: async (batchData: any) => {
    try {
      const response = await axiosClient.post(`/assets/farming`, batchData);
      return response.data;
    } catch (error) {
      console.error("Error while creating batch:", error);
      throw error;
    }
  },
  updateAverageWeight: async (assetID: string, averageWeightData: any) => {
    try {
      const response = await axiosClient.patch(
        `/assets/${assetID}/farming/average-weight`,
        averageWeightData
      );
      return response.data;
    } catch (error) {
      console.error("Error while updating average weight:", error);
      throw error;
    }
  },
  updateExpectedHarvestDate: async (
    assetID: string,
    expectedHarvestDate: string
  ) => {
    try {
      const response = await axiosClient.patch(
        `/assets/${assetID}/farming/expected-harvest-date`,
        { expectedHarvestDate }
      );
      return response.data;
    } catch (error) {
      console.error("Error while updating expected harvest date:", error);
      throw error;
    }
  },
  addFeed: async (assetID: string, feedData: any) => {
    try {
      const response = await axiosClient.post(
        `/assets/${assetID}/farming/feeds`,
        feedData
      );
      return response.data;
    } catch (error) {
      console.error("Error while adding feed:", error);
      throw error;
    }
  },
  addMedication: async (assetID: string, medicationData: any) => {
    try {
      const response = await axiosClient.post(
        `/assets/${assetID}/farming/medications`,
        medicationData
      );
      return response.data;
    } catch (error) {
      console.error("Error while adding medication:", error);
      throw error;
    }
  },
  addCertificate: async (assetID: string, certificateData: any) => {
    try {
      const response = await axiosClient.post(
        `/assets/${assetID}/farming/certificates`,
        certificateData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error while adding certificate:", error);
      throw error;
    }
  },
  getBatchAtFarm: async (assetID: string) => {
    try {
      const response = await axiosClient.get(`/assets/${assetID}/farming`);
      return response.data;
    } catch (error) {
      console.error("Error while fetching batch details:", error);
      throw error;
    }
  },
};
