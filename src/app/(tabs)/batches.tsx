import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";

// Mock data
const batches = [
  { id: "101", name: "Thịt bò tươi", quantity: 20, status: "Đang nuôi" },
  { id: "102", name: "Thịt heo sạch", quantity: 15, status: "Sẵn sàng xuất" },
  { id: "103", name: "Thịt gà thả vườn", quantity: 8, status: "Sắp hết hạn" },
];

const getStatusStyle = (status: string) => {
  switch (status) {
    case "Đang nuôi":
      return "bg-green-100 text-green-700";
    case "Sẵn sàng xuất":
      return "bg-blue-100 text-blue-700";
    case "Sắp hết hạn":
      return "bg-red-100 text-red-700";
    default:
      return "bg-gray-100 text-gray-600";
  }
};

export default function BatchesScreen() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-gray-50">
      <Text className="text-2xl font-bold pt-10 pb-2 px-4 bg-primary text-white">
        Danh sách lô vật nuôi
      </Text>
      <FlatList
        data={batches}
        keyExtractor={(item) => item.id}
        style={{ marginTop: 8 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => router.push(`/batches/${item.id}`)}
            className="bg-white p-4 mx-4 mb-3 rounded-2xl shadow-sm border border-gray-100"
          >
            <View className="flex-row justify-between items-center">
              <View>
                <Text className="text-lg font-bold text-gray-800">
                  {item.name}
                </Text>
                <Text className="text-gray-500 text-sm">
                  Số lượng: {item.quantity}
                </Text>
              </View>
              <Text
                className={`px-3 py-1 text-xs rounded-full ${getStatusStyle(
                  item.status
                )}`}
              >
                {item.status}
              </Text>
            </View>
          </TouchableOpacity>
        )}
      />
      {/* Floating Add Button */}
      <TouchableOpacity
        onPress={() => router.push("/batches/create")}
        className="absolute bottom-6 right-6 bg-[#FF4D6D] w-14 h-14 rounded-full items-center justify-center shadow-lg"
      >
        <MaterialCommunityIcons name="plus" size={28} color="white" />
      </TouchableOpacity>
    </View>
  );
}
