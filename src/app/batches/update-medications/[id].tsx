import { addMedication } from "@/src/hooks/useBatches";
import { AppDispatch, RootState } from "@/src/store/store";
import { Medication } from "@/src/types/batch";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Text,
  TextInput,
  TextInputProps,
  TouchableOpacity,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";

// Helper functions (tái sử dụng)
const formatDateForApi = (date: Date): string =>
  date.toISOString().split("T")[0];
const formatDateForDisplay = (date: Date): string =>
  new Intl.DateTimeFormat("vi-VN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);

// ================= Component con cho Form (Tái sử dụng) =================

type FormInputProps = {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  keyboardType?: TextInputProps["keyboardType"];
};

const FormInput: React.FC<FormInputProps> = ({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType = "default",
}) => (
  <View className="mb-5">
    <Text className="text-base font-bold text-gray-700 mb-2">{label}</Text>
    <TextInput
      className="p-4 bg-white border border-gray-300 rounded-lg text-base"
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      keyboardType={keyboardType}
    />
  </View>
);

type DateInputProps = {
  label: string;
  date: Date | null;
  onPress: () => void;
  placeholder: string;
  onClear?: () => void;
};

const DateInput: React.FC<DateInputProps> = ({
  label,
  date,
  onPress,
  placeholder,
  onClear,
}) => (
  <View className="mb-5">
    <Text className="text-base font-bold text-gray-700 mb-2">{label}</Text>
    <View className="flex-row">
      <TouchableOpacity
        onPress={onPress}
        className="flex-1 flex-row items-center justify-between border border-gray-300 bg-white rounded-lg p-4"
      >
        <Text
          className={`text-base ${date ? "text-gray-900" : "text-gray-400"}`}
        >
          {date ? formatDateForDisplay(date) : placeholder}
        </Text>
        <MaterialCommunityIcons
          name="calendar"
          size={24}
          className="text-gray-500"
        />
      </TouchableOpacity>
      {onClear && date && (
        <TouchableOpacity
          onPress={onClear}
          className="justify-center items-center ml-2 p-2"
        >
          <MaterialCommunityIcons
            name="close-circle-outline"
            size={24}
            className="text-gray-500"
          />
        </TouchableOpacity>
      )}
    </View>
  </View>
);

// ================= Component chính: Màn hình thêm Medication =================
export default function AddMedicationScreen() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { id } = useLocalSearchParams<{ id: string }>();

  // State cho từng trường trong form
  const [name, setName] = useState("");
  const [dose, setDose] = useState("");
  const [dateApplied, setDateApplied] = useState<Date>(new Date());
  const [nextDueDate, setNextDueDate] = useState<Date | null>(null); // Tùy chọn

  // State để quản lý DatePicker: 'applied' hoặc 'due'
  const [pickerVisible, setPickerVisible] = useState<"applied" | "due" | null>(
    null
  );

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const batch = useSelector((state: RootState) =>
    state.batches.batches.find((b) => b.assetID === id)
  );

  // Hàm xử lý chung cho việc thay đổi ngày
  const handleDateChange = (
    event: DateTimePickerEvent,
    selectedDate?: Date
  ) => {
    const currentPicker = pickerVisible;
    setPickerVisible(null);

    if (event.type === "set" && selectedDate) {
      if (currentPicker === "applied") {
        setDateApplied(selectedDate);
      } else if (currentPicker === "due") {
        setNextDueDate(selectedDate);
      }
    }
  };

  // Hàm xử lý khi nhấn nút "Lưu"
  const handleSave = async () => {
    // Validation
    if (!name.trim() || !dose.trim()) {
      setError("Tên thuốc/vaccine và liều lượng là bắt buộc.");
      return;
    }

    setError(null);
    setIsSubmitting(true);

    // Tạo object mới để gửi đi
    const newMedication: Omit<Medication, "nextDueDate"> & {
      nextDueDate?: string;
    } = {
      name: name.trim(),
      dose: dose.trim(),
      dateApplied: formatDateForApi(dateApplied),
    };

    if (nextDueDate) {
      newMedication.nextDueDate = formatDateForApi(nextDueDate);
    }

    try {
      console.log("Đang gửi dữ liệu Medication mới:", newMedication);
      //await new Promise(resolve => setTimeout(resolve, 1500));
      dispatch(
        addMedication({
          assetID: batch!.assetID,
          medicationData: newMedication,
        })
      );

      console.log("Thêm Medication thành công!");

      Alert.alert("Thành công", "Đã thêm thông tin y tế mới.", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch (apiError) {
      console.error("Lỗi khi thêm Medication:", apiError);
      setError("Đã xảy ra lỗi. Vui lòng thử lại.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!batch) {
    return <ActivityIndicator size="large" className="mt-10" />;
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
              Thêm thuốc / vaccine
            </Text>
            <Text className="text-sm font-bold text-white text-center">
              {batch.assetID}
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <FormInput
          label="Tên thuốc / vaccine"
          value={name}
          onChangeText={setName}
          placeholder="Ví dụ: Vitamin C, Vaccine LMLM"
        />
        <FormInput
          label="Liều lượng"
          value={dose}
          onChangeText={setDose}
          placeholder="Ví dụ: 500mg/con, 1ml/con"
        />
        <DateInput
          label="Ngày áp dụng"
          date={dateApplied}
          onPress={() => setPickerVisible("applied")}
          placeholder="Chọn ngày"
        />
        <DateInput
          label="Ngày tiếp theo (Tùy chọn)"
          date={nextDueDate}
          onPress={() => setPickerVisible("due")}
          onClear={() => setNextDueDate(null)}
          placeholder="Chọn ngày nếu có"
        />

        {error && (
          <Text className="text-red-500 text-center mt-2">{error}</Text>
        )}

        {pickerVisible && (
          <DateTimePicker
            value={
              pickerVisible === "applied"
                ? dateApplied
                : nextDueDate || new Date()
            }
            mode="date"
            display="spinner"
            onChange={handleDateChange}
          />
        )}
      </ScrollView>

      {/* Nút lưu */}
      <View className="p-4 bg-gray-100 border-t border-gray-200">
        <TouchableOpacity
          onPress={handleSave}
          disabled={isSubmitting}
          className={`flex-row justify-center items-center rounded-lg py-4 ${isSubmitting ? "bg-primary/60" : "bg-primary active:bg-primary/80"}`}
        >
          {isSubmitting ? (
            <>
              <ActivityIndicator color="white" className="mr-2" />
              <Text className="text-white font-bold text-lg">Đang lưu...</Text>
            </>
          ) : (
            <Text className="text-white font-bold text-lg">Thêm mới</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}
