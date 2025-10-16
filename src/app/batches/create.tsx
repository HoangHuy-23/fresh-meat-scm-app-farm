// src/app/batches/create.tsx
import { BatchApi } from "@/src/api/batchApi";
import { productApi } from "@/src/api/productApi";
import { mapUnitToVietnamese } from "@/src/constants/Utils";
import { AppDispatch } from "@/src/store/store";
import { Product } from "@/src/types/product";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useDispatch } from "react-redux";

// Định nghĩa các loại vật nuôi và mapping với sourceType
const ANIMAL_TYPES = [
  { label: "Heo", value: "PORK" },
  { label: "Gà", value: "CHICKEN" },
  { label: "Bò", value: "BEEF" },
];

// Helper functions
const formatDateForApi = (date: Date): string =>
  date.toISOString().split("T")[0];
const formatDateForDisplay = (date: Date): string =>
  new Intl.DateTimeFormat("vi-VN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);

// ================= COMPONENT CON TÁI SỬ DỤNG =================

// ----- COMPONENT Picker CHUNG -----
type PickerItem = { label: string; value: string };
type PickerProps = {
  label: string;
  items: PickerItem[];
  selectedValue: string | null;
  onValueChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
};

const Picker: React.FC<PickerProps> = ({
  label,
  items,
  selectedValue,
  onValueChange,
  placeholder = "Chọn...",
  disabled = false,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const selectedItem = items.find((item) => item.value === selectedValue);

  return (
    <View className="mb-5">
      <Text className="text-base font-bold text-gray-700 mb-2">{label}</Text>
      <TouchableOpacity
        onPress={() => !disabled && setModalVisible(true)}
        disabled={disabled}
        className={`flex-row items-center justify-between border rounded-lg p-4 ${disabled ? "bg-gray-200 border-gray-300" : "bg-white border-gray-300"}`}
      >
        <Text
          className={`text-base ${selectedItem ? "text-gray-900" : "text-gray-400"}`}
        >
          {selectedItem ? selectedItem.label : placeholder}
        </Text>
        <MaterialCommunityIcons
          name="chevron-down"
          size={24}
          className="text-gray-500"
        />
      </TouchableOpacity>

      <Modal
        transparent
        visible={modalVisible}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.5)",
            justifyContent: "center",
          }}
          onPress={() => setModalVisible(false)}
        >
          <View
            className="mx-8 my-16 bg-white rounded-xl shadow-lg"
            onStartShouldSetResponder={() => true}
          >
            <FlatList
              data={items}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => {
                    onValueChange(item.value);
                    setModalVisible(false);
                  }}
                  className="p-4 border-b border-gray-100"
                >
                  <Text className="text-base">{item.label}</Text>
                </TouchableOpacity>
              )}
              ListHeaderComponent={
                <Text className="p-4 font-bold text-lg border-b border-gray-200">
                  {label}
                </Text>
              }
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

// ----- COMPONENT DateInput -----
const DateInput: React.FC<{
  label: string;
  date: Date | null;
  onPress: () => void;
  placeholder: string;
}> = ({ label, date, onPress, placeholder }) => (
  <View className="mb-5">
    <Text className="text-base font-bold text-gray-700 mb-2">{label}</Text>
    <TouchableOpacity
      onPress={onPress}
      className="flex-row items-center justify-between border border-gray-300 bg-white rounded-lg p-4"
    >
      <Text className={`text-base ${date ? "text-gray-900" : "text-gray-400"}`}>
        {date ? formatDateForDisplay(date) : placeholder}
      </Text>
      <MaterialCommunityIcons
        name="calendar"
        size={24}
        className="text-gray-500"
      />
    </TouchableOpacity>
  </View>
);

// ================= COMPONENT CHÍNH =================
export default function CreateBatchScreen() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  // State
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Form state
  const [selectedAnimalType, setSelectedAnimalType] = useState<string | null>(
    "PORK"
  );
  const [selectedSku, setSelectedSku] = useState<string | null>(null);
  const [quantity, setQuantity] = useState("");
  const [sowingDate, setSowingDate] = useState<Date>(new Date());
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [expectedHarvestDate, setExpectedHarvestDate] = useState<Date>(
    new Date()
  );

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pickerFor, setPickerFor] = useState<
    "sowing" | "start" | "harvest" | null
  >(null); // <<== CẬP NHẬT STATE NÀY

  const fetchProducts = async () => {
    try {
      const rawProducts = await productApi.getProductSource(
        selectedAnimalType!
      );
      setProducts(rawProducts);
    } catch (error) {
      console.error("Error fetching products:", error);
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch dữ liệu sản phẩm khi component mount
  useEffect(() => {
    setTimeout(() => {
      fetchProducts();
      setIsLoading(false);
    }, 500);
  }, []);

  // Lọc danh sách sản phẩm khi loại vật nuôi thay đổi
  useEffect(() => {
    if (selectedAnimalType) {
      setFilteredProducts(
        products.filter((p) => p.sourceType === selectedAnimalType)
      );
    } else {
      setFilteredProducts([]);
    }
  }, [selectedAnimalType, products]);

  // Hàm xử lý khi thay đổi loại vật nuôi
  const handleAnimalTypeChange = (type: string) => {
    setSelectedAnimalType(type);
    // RESET lựa chọn sản phẩm và số lượng khi thay đổi loại vật nuôi
    setSelectedSku(null);
    setQuantity("");
  };

  const handleCreate = async () => {
    const selectedProduct = products.find((p) => p.sku === selectedSku);

    // 1. Validation
    if (!selectedProduct) {
      setError("Vui lòng chọn một loại sản phẩm.");
      return;
    }
    const quantityNum = parseInt(quantity, 10);
    if (isNaN(quantityNum) || quantityNum <= 0) {
      setError("Số lượng phải là một số nguyên dương.");
      return;
    }

    setError(null);
    setIsSubmitting(true);

    // 2. Tạo payload chính xác theo mẫu
    const payload = {
      sku: selectedProduct.sku,
      quantity: {
        unit: selectedProduct.unit,
        value: quantityNum,
      },
      sourceType: selectedProduct.sourceType, // Lấy từ sản phẩm đã chọn
      details: {
        sowingDate: formatDateForApi(sowingDate),
        startDate: formatDateForApi(startDate),
        expectedHarvestDate: formatDateForApi(expectedHarvestDate),
        // feeds và medications được bỏ trống theo yêu cầu
        feeds: [],
        medications: [],
      },
    };

    try {
      // 3. Gọi API bằng BatchApi
      console.log(
        "Đang gửi payload để tạo lô mới:",
        JSON.stringify(payload, null, 2)
      );

      // Dòng này sẽ gọi API thật của bạn
      await BatchApi.createBatch(payload);

      Alert.alert(
        "Thành công",
        `Đã tạo lô ${selectedProduct.name} thành công.`
      );

      // 4. Cập nhật lại danh sách và quay về
      // Bỏ comment dòng này nếu bạn muốn tự động refresh danh sách
      // await dispatch(fetchBatches()).unwrap();
      router.back();
    } catch (apiError: any) {
      console.error(
        "Lỗi khi tạo lô:",
        apiError.response?.data || apiError.message
      );
      setError(
        apiError.response?.data?.error || "Đã có lỗi xảy ra khi tạo lô."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDateChange = (
    event: DateTimePickerEvent,
    selectedDate?: Date
  ) => {
    const currentPicker = pickerFor;
    setPickerFor(null);
    if (event.type === "set" && selectedDate) {
      if (currentPicker === "sowing") setSowingDate(selectedDate);
      if (currentPicker === "start") setStartDate(selectedDate);
      if (currentPicker === "harvest") setExpectedHarvestDate(selectedDate);
    }
  };

  const selectedProduct = products.find((p) => p.sku === selectedSku);

  if (isLoading) {
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
              Tạo lô vật nuôi mới
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <Text className="text-lg font-bold text-gray-700 mb-2">
          Thông tin sản phẩm
        </Text>

        {/* ----- PICKER 1: LOẠI VẬT NUÔI ----- */}
        <Picker
          label="Loại vật nuôi"
          items={ANIMAL_TYPES}
          selectedValue={selectedAnimalType}
          onValueChange={handleAnimalTypeChange}
          placeholder="Chọn loại vật nuôi"
        />

        {/* ----- PICKER 2: SẢN PHẨM (SKU) ----- */}
        <Picker
          label="Sản phẩm (SKU)"
          items={filteredProducts.map((p) => ({
            label: `${p.name} (${p.sku})`,
            value: p.sku,
          }))}
          selectedValue={selectedSku}
          onValueChange={setSelectedSku}
          placeholder="Chọn sản phẩm"
          disabled={!selectedAnimalType} // Vô hiệu hóa nếu chưa chọn loại vật nuôi
        />

        {selectedProduct && (
          <View>
            <Text className="text-base font-bold text-gray-700 mb-2">
              Số lượng ban đầu
            </Text>
            <View className="flex-row items-center border border-gray-300 bg-white rounded-lg mb-5">
              <TextInput
                className="flex-1 p-4 text-base"
                placeholder="Nhập số lượng"
                keyboardType="number-pad"
                value={quantity}
                onChangeText={setQuantity}
              />
              <Text className="px-4 text-base text-gray-500 font-semibold">
                {mapUnitToVietnamese(selectedProduct.unit)}
              </Text>
            </View>
          </View>
        )}

        <Text className="text-lg font-bold text-gray-700 mb-2 mt-2">
          Mốc thời gian
        </Text>
        <DateInput
          label="Ngày gieo trồng / nhập giống"
          date={sowingDate}
          onPress={() => setPickerFor("sowing")}
          placeholder="Chọn ngày"
        />
        <DateInput
          label="Ngày bắt đầu nuôi"
          date={startDate}
          onPress={() => setPickerFor("start")}
          placeholder="Chọn ngày"
        />
        <DateInput
          label="Ngày dự kiến thu hoạch"
          date={expectedHarvestDate}
          onPress={() => setPickerFor("harvest")}
          placeholder="Chọn ngày"
        />

        {error && (
          <Text className="text-red-500 text-center mt-2">{error}</Text>
        )}

        {pickerFor && (
          <DateTimePicker
            value={pickerFor === "sowing" ? sowingDate : startDate}
            mode="date"
            display="spinner"
            onChange={handleDateChange}
          />
        )}
      </ScrollView>

      <View className="p-4 bg-gray-100 border-t border-gray-200">
        <TouchableOpacity
          onPress={handleCreate}
          disabled={isSubmitting}
          className={`flex-row justify-center items-center rounded-lg py-4 ${isSubmitting ? "bg-primary/60" : "bg-primary active:bg-primary/80"}`}
        >
          {isSubmitting ? (
            <>
              <ActivityIndicator color="white" className="mr-2" />
              <Text className="text-white font-bold text-lg">Đang tạo...</Text>
            </>
          ) : (
            <Text className="text-white font-bold text-lg">Tạo lô mới</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}
