import axiosClient from "./axiosClient";

export const shipmentApi = {
  confirmPickupShipment: async (shipmentID: string, data: any) => {
    try {
      const response = await axiosClient.post(`/shipments/${shipmentID}/pickup`, data);
      return response.data;
    } catch (error) {
      console.error("Error while confirming shipment:", error);
      throw error;
    }
  },
};
