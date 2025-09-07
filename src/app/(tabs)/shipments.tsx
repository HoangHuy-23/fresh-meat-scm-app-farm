// src/app/(tabs)/shipments.tsx
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";

const mockShipments = [
  {
    id: "SHP001",
    batchName: "Heo đợt 1 tháng 9",
    type: "heo",
    quantity: 20,
    date: "2025-09-05",
    status: "pending",
  },
  {
    id: "SHP002",
    batchName: "Gà đợt 2 tháng 8",
    type: "gà",
    quantity: 50,
    date: "2025-09-02",
    status: "shipping",
  },
  {
    id: "SHP003",
    batchName: "Heo đợt 2 tháng 7",
    type: "heo",
    quantity: 15,
    date: "2025-08-25",
    status: "completed",
  },
];

const statusColors: Record<string, string> = {
  pending: "bg-yellow-500",
  shipping: "bg-blue-500",
  completed: "bg-green-600",
  rejected: "bg-red-500",
};

export default function Shipments() {
  const router = useRouter();
  const [shipments] = useState(mockShipments);

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="px-4 pt-10 pb-2 bg-primary shadow-md">
        <Text className="text-white font-bold text-xl">Yêu cầu xuất lô</Text>
      </View>

      {/* Danh sách shipment */}
      <FlatList
        data={shipments}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() =>
              router.push({
                pathname: `/shipments/[id]`,
                params: { id: item.id },
              })
            }
            className="bg-white p-4 mb-3 rounded-2xl shadow-sm"
          >
            <View className="flex-row justify-between items-center mb-2">
              <Text className="font-bold text-lg">{item.batchName}</Text>
              <View
                className={`px-3 py-1 rounded-full ${statusColors[item.status]}`}
              >
                <Text className="text-white text-xs capitalize">
                  {item.status}
                </Text>
              </View>
            </View>
            <Text className="text-gray-600">Loại: {item.type}</Text>
            <Text className="text-gray-600">Số lượng: {item.quantity}</Text>
            <Text className="text-gray-400 text-xs mt-1">
              Ngày yêu cầu: {item.date}
            </Text>
          </TouchableOpacity>
        )}
        contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
      />

      {/* Nút tạo yêu cầu */}
      <TouchableOpacity
        onPress={() => router.push("/shipments/create")}
        className="absolute bottom-6 right-6 bg-primary w-16 h-16 rounded-full flex items-center justify-center shadow-lg"
      >
        <MaterialCommunityIcons name="plus" size={28} color="white" />
      </TouchableOpacity>
    </View>
  );
}
