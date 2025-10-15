import { addFeed } from "@/src/hooks/useBatches";
import { AppDispatch, RootState } from "@/src/store/store";
import { Feed } from "@/src/types/batch";
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
  TextInputProps, // Import TextInputProps để lấy keyboardType
  TouchableOpacity,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";

// Helper functions (không đổi)
const formatDateForApi = (date: Date): string =>
  date.toISOString().split("T")[0];
const formatDateForDisplay = (date: Date): string =>
  new Intl.DateTimeFormat("vi-VN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);

// ================= Component con cho Form (ĐÃ THÊM PROPS) =================

// Định nghĩa Props cho FormInput
type FormInputProps = {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  keyboardType?: TextInputProps["keyboardType"]; // Sử dụng type từ React Native
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

// Định nghĩa Props cho DateInput
type DateInputProps = {
  label: string;
  date: Date | null;
  onPress: () => void;
  placeholder: string;
  onClear?: () => void; // onClear là optional
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

// ================= Component chính: Màn hình thêm Feed =================
export default function AddFeedScreen() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { id } = useLocalSearchParams<{ id: string }>();

  // State (không đổi)
  const [name, setName] = useState("");
  const [dosage, setDosage] = useState("");
  const [notes, setNotes] = useState("");
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [pickerVisible, setPickerVisible] = useState<"start" | "end" | null>(
    null
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const batch = useSelector((state: RootState) =>
    state.batches.batches.find((b) => b.assetID === id)
  );

  // handleDateChange (không đổi)
  const handleDateChange = (
    event: DateTimePickerEvent,
    selectedDate?: Date
  ) => {
    const currentPicker = pickerVisible;
    setPickerVisible(null);

    if (event.type === "set" && selectedDate) {
      if (currentPicker === "start") {
        setStartDate(selectedDate);
      } else if (currentPicker === "end") {
        setEndDate(selectedDate);
      }
    }
  };

  // handleSave (không đổi)
  const handleSave = async () => {
    if (!name.trim() || !dosage.trim()) {
      setError("Tên thức ăn và liều lượng là bắt buộc.");
      return;
    }
    const dosageNum = parseFloat(dosage);
    if (isNaN(dosageNum) || dosageNum <= 0) {
      setError("Liều lượng phải là một số lớn hơn 0.");
      return;
    }

    setError(null);
    setIsSubmitting(true);

    const newFeed: Omit<Feed, "endDate"> & { endDate?: string } = {
      name: name.trim(),
      dosageKg: dosageNum,
      startDate: formatDateForApi(startDate),
      notes: notes.trim(),
    };

    if (endDate) {
      newFeed.endDate = formatDateForApi(endDate);
    }

    try {
      console.log("Đang gửi dữ liệu Feed mới:", newFeed);
      // await new Promise((resolve) => setTimeout(resolve, 1500));
      await dispatch(
        addFeed({
          assetID: batch!.assetID,
          feedData: newFeed,
        })
      );

      console.log("Thêm Feed thành công!");

      Alert.alert("Thành công", "Đã thêm thông tin thức ăn mới.", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch (apiError) {
      console.error("Lỗi khi thêm Feed:", apiError);
      setError("Đã xảy ra lỗi. Vui lòng thử lại.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // JSX (không đổi)
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
              Thêm thức ăn
            </Text>
            <Text className="text-sm font-bold text-white text-center">
              {batch.assetID}
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <FormInput
          label="Tên thức ăn"
          value={name}
          onChangeText={setName}
          placeholder="Ví dụ: Cám Con Cò"
        />
        <FormInput
          label="Liều lượng"
          value={dosage}
          onChangeText={setDosage}
          placeholder="Nhập tổng liều lượng (kg)"
          keyboardType="numeric"
        />
        <DateInput
          label="Ngày bắt đầu"
          date={startDate}
          onPress={() => setPickerVisible("start")}
          placeholder="Chọn ngày"
        />
        <DateInput
          label="Ngày kết thúc (Tùy chọn)"
          date={endDate}
          onPress={() => setPickerVisible("end")}
          onClear={() => setEndDate(null)}
          placeholder="Chọn ngày nếu có"
        />
        <View className="mb-5">
          <Text className="text-base font-bold text-gray-700 mb-2">
            Ghi chú
          </Text>
          <TextInput
            className="p-4 bg-white border border-gray-300 rounded-lg text-base h-28"
            value={notes}
            onChangeText={setNotes}
            placeholder="Thông tin thêm..."
            multiline={true}
            textAlignVertical="top"
          />
        </View>

        {error && (
          <Text className="text-red-500 text-center mt-2">{error}</Text>
        )}

        {pickerVisible && (
          <DateTimePicker
            value={
              pickerVisible === "start" ? startDate : endDate || new Date()
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
