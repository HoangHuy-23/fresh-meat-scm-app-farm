// src/app/shipments/[id].tsx
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// Mock data tạm
const mockShipment = {
  id: "SHIP123",
  batch: "Lô Heo 001",
  to: "Cơ sở chế biến A",
  status: "Pending",
  note: "Xuất ngày 10/09",
  createdAt: "2025-09-07",
  items: [
    { name: "Heo giống", quantity: 50, unit: "con" },
    { name: "Heo thịt", quantity: 20, unit: "con" },
  ],
};

export default function ShipmentDetail() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [loading, setLoading] = useState(true);
  const [shipment, setShipment] = useState<typeof mockShipment | null>(null);

  useEffect(() => {
    async function fetchShipment() {
      try {
        // TODO: fetch từ API bằng id
        setShipment(mockShipment);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchShipment();
  }, [id]);

  if (loading || !shipment) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View className="px-4 pt-10 pb-4 bg-primary flex-row items-center space-x-4 shadow-md">
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialCommunityIcons name="arrow-left" size={28} color="white" />
        </TouchableOpacity>
        <Text className="text-white font-bold text-xl">Chi tiết yêu cầu xuất lô</Text>
      </View>

      <ScrollView className="flex-1 p-4">
        {/* Thông tin cơ bản */}
        <View className="mb-6">
          <Text className="text-lg font-semibold mb-2">Thông tin lô</Text>
          <Text className="mb-1">ID yêu cầu: {shipment.id}</Text>
          <Text className="mb-1">Lô: {shipment.batch}</Text>
          <Text className="mb-1">Nơi nhận: {shipment.to}</Text>
          <Text className="mb-1">Trạng thái: {shipment.status}</Text>
          <Text className="mb-1">Ngày tạo: {shipment.createdAt}</Text>
          <Text className="mb-1">Ghi chú: {shipment.note}</Text>
        </View>

        {/* Danh sách sản phẩm trong lô */}
        <View className="mb-6">
          <Text className="text-lg font-semibold mb-2">Chi tiết sản phẩm</Text>
          {shipment.items.map((item, index) => (
            <View
              key={index}
              className="flex-row justify-between border p-2 rounded-lg mb-2"
            >
              <Text>{item.name}</Text>
              <Text>{item.quantity} {item.unit}</Text>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Floating Update Button */}
      <TouchableOpacity
        onPress={() => router.push(`/shipments/update/${shipment.id}`)}
        className="absolute bottom-6 right-6 bg-[#FF4D6D] w-14 h-14 rounded-full items-center justify-center shadow-lg"
      >
        <MaterialCommunityIcons name="pencil" size={26} color="white" />
      </TouchableOpacity>
    </View>
  );
}
