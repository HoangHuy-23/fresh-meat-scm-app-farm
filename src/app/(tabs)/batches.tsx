import { getStatusColors, getStatusText } from "@/src/constants/Utils";
import { fetchBatches } from "@/src/hooks/useBatches";
import { AppDispatch, RootState } from "@/src/store/store";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
import React, { useCallback } from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";

export default function BatchesScreen() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { batches, error, status } = useSelector(
    (state: RootState) => state.batches
  );

  // Hàm được gọi khi người dùng kéo xuống để refresh
  const onRefresh = useCallback(() => {
    dispatch(fetchBatches());
  }, [dispatch]);

  useFocusEffect(
    useCallback(() => {
      dispatch(fetchBatches());
    }, [dispatch])
  );

  if (status === "loading" && batches.length === 0) {
    // Chỉ hiển thị màn hình loading toàn trang khi chưa có dữ liệu
    return (
      <View className="flex-1 bg-gray-50">
        <Text className="text-2xl font-bold pt-10 pb-2 px-4 bg-primary text-white text-center w-full">
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
        <Text className="text-2xl font-bold pt-10 pb-2 px-4 bg-primary text-white text-center w-full">
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
      <Text className="text-2xl font-bold pt-10 pb-2 px-4 bg-primary text-white text-center w-full">
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
                <Text className="text-gray-500 text-sm">
                  Mã lô: {item.assetID}
                </Text>
                <Text className="text-lg font-bold text-gray-800">
                  {item.productName}{" "}
                </Text>
                <Text className="text-gray-500 text-sm">
                  Số lượng: {item.currentQuantity.value}
                </Text>
              </View>
              <View
                className="px-3 py-1 rounded-full"
                style={{ backgroundColor: getStatusColors(item.status).bg }}
              >
                <Text
                  className="text-xs font-semibold"
                  style={{ color: getStatusColors(item.status).text }}
                >
                  {getStatusText(item.status)}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
        // Thêm 2 props dưới đây để có tính năng pull-to-refresh
        onRefresh={onRefresh}
        refreshing={status === "loading"}
      />
      {/* Floating Add Button */}
      <TouchableOpacity
        onPress={() => router.push("/batches/create")}
        className="absolute bottom-6 right-6 bg-primary w-14 h-14 rounded-full items-center justify-center shadow-lg"
      >
        <MaterialCommunityIcons name="plus" size={28} color="white" />
      </TouchableOpacity>
    </View>
  );
}
