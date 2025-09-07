import { fetchBatches } from "@/src/hooks/useBatches";
import { AppDispatch, RootState } from "@/src/store/store";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
import React, { useCallback } from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";

// Mock data
const batches = [
  { id: "101", name: "Thịt bò tươi", quantity: 20, status: "Đang nuôi" },
  { id: "102", name: "Thịt heo sạch", quantity: 15, status: "Sẵn sàng xuất" },
  { id: "103", name: "Thịt gà thả vườn", quantity: 8, status: "Sắp hết hạn" },
];

const getStatusStyle = (status: string) => {
  switch (status) {
    case "AT_FARM":
      return "bg-green-100 text-green-700";
    case "Sẵn sàng xuất":
      return "bg-blue-100 text-blue-700";
    case "Sắp hết hạn":
      return "bg-red-100 text-red-700";
    case "PARTIALLY_SHIPPED":
      return "bg-yellow-100 text-yellow-700";
    case "SHIPPED":
      return "bg-purple-100 text-purple-700";
    case "COMPLETED":
      return "bg-gray-100 text-gray-700";
    default:
      return "bg-gray-100 text-gray-600";
  }
};

const getStatusText = (status: string) => {
  switch (status) {
    case "AT_FARM":
      return "Đang nuôi";
    case "PARTIALLY_SHIPPED":
      return "Đang xuất";
    case "SHIPPED":
      return "Đã xuất";
    case "COMPLETED":
      return "Hoàn thành";
    default:
      return status;
  }
};

export default function BatchesScreen() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { batches, error, status } = useSelector(
    (state: RootState) => state.batches
  );
  useFocusEffect(
    useCallback(() => {
      dispatch(fetchBatches());
    }, [dispatch])
  );

  if (status === "loading") {
    return (
      <View className="flex-1 bg-gray-50">
        <Text className="text-2xl font-bold pt-10 pb-2 px-4 bg-primary text-white">
          Danh sách lô vật nuôi
        </Text>
        <View className="flex-1 justify-center items-center">
          <Text>Loading...</Text>
        </View>
      </View>
    );
  }
  if (error) {
    return (
      <View className="flex-1 bg-gray-50">
        <Text className="text-2xl font-bold pt-10 pb-2 px-4 bg-primary text-white">
          Danh sách lô vật nuôi
        </Text>
        <View className="flex-1 justify-center items-center">
          <Text className="text-red-500">Error: {error}</Text>
        </View>
      </View>
    );
  }
  return (
    <View className="flex-1 bg-gray-50">
      <Text className="text-2xl font-bold pt-10 pb-2 px-4 bg-primary text-white">
        Danh sách lô vật nuôi
      </Text>
      <FlatList
        data={batches}
        keyExtractor={(item) => item.assetID}
        style={{ marginTop: 8 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => router.push(`/batches/${item.assetID}`)}
            className="bg-white p-4 mx-4 mb-3 rounded-2xl shadow-sm border border-gray-100"
          >
            <View className="flex-row justify-between items-center">
              <View>
                <Text className="text-lg font-bold text-gray-800">
                  {item.productName}
                </Text>
                <Text className="text-gray-500 text-sm">
                  Số lượng: {item.currentQuantity.value}
                </Text>
              </View>
              <Text
                className={`px-3 py-1 text-xs rounded-full ${getStatusStyle(
                  item.status
                )}`}
              >
                {getStatusText(item.status)}
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
