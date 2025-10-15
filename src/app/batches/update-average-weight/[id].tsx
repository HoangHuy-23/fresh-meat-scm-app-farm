import { mapUnitToVietnamese } from "@/src/constants/Utils";
import { updateAverageWeight } from "@/src/hooks/useBatches";
import { AppDispatch, RootState } from "@/src/store/store";
import { Batch } from "@/src/types/batch";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";

// ================= Component con cho màn hình này =================

type InputGroupProps = {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  unit: string;
  keyboardType?: "numeric" | "default";
  isEditable?: boolean;
  disabled?: boolean;
};

// Component Input có kèm đơn vị, giúp giao diện gọn gàng hơn
const InputGroup: React.FC<InputGroupProps> = ({
  label,
  value,
  onChangeText,
  unit,
  keyboardType = "numeric",
  isEditable = false,
  disabled = false,
}) => (
  <View className="mb-6">
    <Text className="text-lg font-bold text-gray-700 mb-2">{label}</Text>
    <View
      className={`flex-row items-center border border-gray-300 ${disabled ? "bg-gray-50" : "bg-white"} rounded-lg`}
    >
      <TextInput
        className={`flex-1 p-4 text-base`}
        editable={isEditable && !disabled}
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        placeholder={`Nhập ${label.toLowerCase()}`}
      />
      <Text className={`px-4 text-base`}>{unit}</Text>
    </View>
  </View>
);

// ================= Component chính: Màn hình cập nhật =================
export default function UpdateWeightScreen() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { id } = useLocalSearchParams<{ id: string }>();

  const [batch, setBatch] = useState<Batch | null>(null);

  // State riêng cho các giá trị trên form
  const [currentQuantity, setCurrentQuantity] = useState("");
  const [averageWeight, setAverageWeight] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Lấy dữ liệu lô từ Redux store
  const { batches } = useSelector((state: RootState) => state.batches);

  // Tìm lô và điền dữ liệu vào form khi màn hình được tải
  useEffect(() => {
    const foundBatch = batches.find((b: Batch) => b.assetID === id);
    if (foundBatch) {
      setBatch(foundBatch);
      setCurrentQuantity(foundBatch.currentQuantity.value.toString());
      setAverageWeight(foundBatch.averageWeight.value.toString());
    }
  }, [id, batches]);

  // Hàm xử lý khi nhấn nút "Lưu thay đổi"
  const handleUpdate = async () => {
    if (!batch) return;

    // Validate dữ liệu
    // const quantityNum = parseFloat(currentQuantity);
    const weightNum = parseFloat(averageWeight);

    if (
      // isNaN(quantityNum) ||
      isNaN(weightNum) ||
      // quantityNum < 0 ||
      weightNum < 0
    ) {
      setError("Vui lòng nhập số hợp lệ cho cân nặng.");
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      // ---- BẮT ĐẦU MÔ PHỎNG GỌI API ----
      console.log("Đang gửi dữ liệu cập nhật:", {
        assetID: batch.assetID,
        // currentQuantity: {
        //   value: quantityNum,
        //   unit: batch.currentQuantity.unit,
        // },
        averageWeight: { value: weightNum, unit: batch.averageWeight.unit },
      });

      // Giả lập thời gian chờ của mạng
      // await new Promise((resolve) => setTimeout(resolve, 1500));

      // Trong ứng dụng thật, bạn sẽ gọi một action của Redux Thunk ở đây
      // Ví dụ: await dispatch(updateBatchWeight({ id: batch.assetID, ... }));
      await dispatch(
        updateAverageWeight({
          assetID: batch.assetID,
          averageWeightData: { value: weightNum, unit: batch.averageWeight.unit },
        })
      );

      console.log("Cập nhật thành công!");
      // ---- KẾT THÚC MÔ PHỎNG GỌI API ----

      // Hiển thị thông báo và quay lại
      Alert.alert("Thành công", "Đã cập nhật thông tin lô thành công.", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch (apiError) {
      console.error("Lỗi cập nhật:", apiError);
      setError("Đã xảy ra lỗi. Vui lòng thử lại.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Nếu chưa tìm thấy thông tin lô, hiển thị loading
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
              Cập nhật cân nặng
            </Text>
            <Text className="text-sm font-bold text-white text-center">
              {batch.assetID}
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <Text className="text-lg font-bold text-gray-700 mb-2">
          Mã lô: {batch.assetID}
        </Text>
        <InputGroup
          label="Số lượng hiện tại"
          value={currentQuantity}
          onChangeText={setCurrentQuantity}
          unit={mapUnitToVietnamese(batch.currentQuantity.unit)}
          isEditable={false}
          disabled={true}
        />

        <InputGroup
          label="Cân nặng trung bình"
          value={averageWeight}
          onChangeText={setAverageWeight}
          unit={mapUnitToVietnamese(batch.averageWeight.unit)}
          isEditable={true}
        />

        {error && (
          <Text className="text-red-500 text-center mt-2">{error}</Text>
        )}
      </ScrollView>

      {/* Nút lưu luôn ở dưới cùng */}
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
