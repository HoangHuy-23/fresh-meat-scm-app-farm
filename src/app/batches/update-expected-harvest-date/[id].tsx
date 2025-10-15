import { updateExpectedHarvestDate } from "@/src/hooks/useBatches";
import { AppDispatch, RootState } from "@/src/store/store";
import { Batch } from "@/src/types/batch";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";

// Helper function để định dạng ngày sang YYYY-MM-DD (format của API)
const formatDateForApi = (date: Date): string => {
  return date.toISOString().split("T")[0];
};

// Helper function để định dạng ngày sang DD/MM/YYYY (format hiển thị)
const formatDateForDisplay = (date: Date): string => {
  return new Intl.DateTimeFormat("vi-VN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
};

// ================= Component chính: Màn hình cập nhật =================
export default function UpdateHarvestDateScreen() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { id } = useLocalSearchParams<{ id: string }>();

  const [batch, setBatch] = useState<Batch | null>(null);

  // State để lưu trữ ngày tháng dưới dạng đối tượng Date
  const [date, setDate] = useState<Date>(new Date());
  // State để điều khiển việc hiển thị/ẩn DatePicker
  const [showPicker, setShowPicker] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { batches } = useSelector((state: RootState) => state.batches);

  useEffect(() => {
    const foundBatch = batches.find((b: Batch) => b.assetID === id);
    if (foundBatch && foundBatch.history[0]?.details.expectedHarvestDate) {
      setBatch(foundBatch);
      // Chuyển đổi chuỗi ngày từ data sang đối tượng Date để picker có thể hiểu
      setDate(new Date(foundBatch.history[0].details.expectedHarvestDate));
    }
  }, [id, batches]);

  // Hàm được gọi khi người dùng chọn một ngày từ picker
  const handleDateChange = (
    event: DateTimePickerEvent,
    selectedDate?: Date
  ) => {
    // Luôn ẩn picker sau khi người dùng tương tác
    setShowPicker(false);
    if (event.type === "set" && selectedDate) {
      // Nếu người dùng nhấn "OK" hoặc chọn ngày, cập nhật state
      setDate(selectedDate);
    }
  };

  // Hàm xử lý khi nhấn nút "Lưu thay đổi"
  const handleUpdate = async () => {
    if (!batch || !date) return;

    setError(null);
    setIsSubmitting(true);

    try {
      const formattedDate = formatDateForApi(date);

      console.log("Đang gửi dữ liệu cập nhật:", {
        assetID: batch.assetID,
        expectedHarvestDate: formattedDate,
      });

      //await new Promise((resolve) => setTimeout(resolve, 1500));
      await dispatch(
        updateExpectedHarvestDate({
          assetID: batch.assetID,
          expectedHarvestDate: formattedDate,
        })
      );

      console.log("Cập nhật thành công!");

      Alert.alert("Thành công", "Đã cập nhật ngày dự kiến thu hoạch.", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch (apiError) {
      console.error("Lỗi cập nhật:", apiError);
      setError("Đã xảy ra lỗi. Vui lòng thử lại.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!batch) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-100">
      {/* Header */}
      <View className="px-4 pt-10 pb-3 bg-primary shadow-md  space-x-4">
        <TouchableOpacity
          onPress={() => router.back()}
          className="flex-row items-center"
        >
          <MaterialCommunityIcons
            name="step-backward"
            size={28}
            color="white"
            className=""
          />
          <View className="w-full -ml-6">
            <Text className="text-white font-bold text-2xl text-center">
              Cập nhật ngày
            </Text>
            <Text className="text-sm font-bold text-white text-center">
              {batch.assetID}
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <Text className="text-lg font-bold text-gray-700 mb-2">
          Ngày dự kiến thu hoạch
        </Text>

        {/* Nút để mở DatePicker */}
        <TouchableOpacity
          onPress={() => setShowPicker(true)}
          className="flex-row items-center justify-between border border-gray-300 bg-white rounded-lg p-4"
        >
          <Text className="text-base text-gray-900">
            {formatDateForDisplay(date)}
          </Text>
          <MaterialCommunityIcons
            name="calendar"
            size={24}
            className="text-gray-500"
          />
        </TouchableOpacity>

        {/* Component DatePicker sẽ được hiển thị khi showPicker là true */}
        {showPicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display="spinner" // 'spinner' hoặc 'calendar' trên iOS, 'default' trên Android
            onChange={handleDateChange}
          />
        )}

        {error && (
          <Text className="text-red-500 text-center mt-4">{error}</Text>
        )}
      </ScrollView>

      {/* Nút lưu */}
      <View className="p-4 bg-gray-100 border-t border-gray-200">
        <TouchableOpacity
          onPress={handleUpdate}
          disabled={isSubmitting}
          className={`flex-row justify-center items-center rounded-lg py-4 ${isSubmitting ? "bg-primary/60" : "bg-primary active:bg-primary/80"}`}
        >
          {isSubmitting ? (
            <>
              <ActivityIndicator color="white" className="mr-2" />
              <Text className="text-white font-bold text-lg">Đang lưu...</Text>
            </>
          ) : (
            <Text className="text-white font-bold text-lg">Lưu thay đổi</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}
