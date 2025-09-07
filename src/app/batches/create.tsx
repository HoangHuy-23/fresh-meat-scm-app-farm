// src/app/batches/create.tsx
import { BatchApi } from "@/src/api/batchApi";
import { fetchBatches } from "@/src/hooks/useBatches";
import { AppDispatch } from "@/src/store/store";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useDispatch } from "react-redux";

export default function CreateProduct() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const [type, setType] = useState("heo");
  const [batchName, setBatchName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [startDate, setStartDate] = useState("");
  const [expectedHarvestDate, setExpectedHarvestDate] = useState("");
  const [feed, setFeed] = useState("");
  const [medications, setMedications] = useState("");

  const handleCreate = async () => {
    // Tạo assetID ngẫu nhiên
    const assetID = "FARM-BATCH-" + Math.random().toString(36).substr(2, 9);

    // Chia feed/medications từ input multiline thành mảng
    const feedArray = feed
      .split("\n")
      .map((f) => f.trim())
      .filter(Boolean);
    const medicationsArray = medications
      .split("\n")
      .map((m) => m.trim())
      .filter(Boolean);

    // Tạo payload object
    const payload = {
      assetID,
      productName: batchName,
      quantity: { unit: "con", value: Number(quantity) },
      details: {
        sowingDate: startDate,
        startDate,
        expectedHarvestDate,
        feed: feedArray,
        medications: medicationsArray,
      },
    };

    console.log("Payload gửi API:", payload);

    try {
      await BatchApi.createBatch(payload);
      console.log("Tạo lô thành công");
      // await dispatch(fetchBatches()).unwrap(); // load lại danh sách lô
      router.back(); // quay về danh sách lô
    } catch (error) {
      console.error("Error creating batch:", error);
    } finally {
      console.log("Request to create batch completed");
    }
  };

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View className="px-4 pt-10 pb-2 bg-primary shadow-md flex-row items-center space-x-4">
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialCommunityIcons name="arrow-left" size={28} color="white" />
        </TouchableOpacity>
        <Text className="text-white font-bold text-xl">Tạo lô vật nuôi</Text>
      </View>

      <ScrollView className="flex-1 p-4">
        {/* Loại vật nuôi */}
        <Text className="mb-2 font-semibold">Loại vật nuôi</Text>
        <View className="flex-row mb-4">
          <TouchableOpacity
            onPress={() => setType("heo")}
            className={`px-4 py-2 rounded-l-xl border ${
              type === "heo" ? "bg-primary" : "bg-gray-200"
            }`}
          >
            <Text className={type === "heo" ? "text-white" : "text-gray-700"}>
              Heo
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setType("gà")}
            className={`px-4 py-2 rounded-r-xl border ${
              type === "gà" ? "bg-primary" : "bg-gray-200"
            }`}
          >
            <Text className={type === "gà" ? "text-white" : "text-gray-700"}>
              Gà
            </Text>
          </TouchableOpacity>
        </View>

        {/* Tên lô */}
        <Text className="mb-2 font-semibold">Tên lô</Text>
        <TextInput
          className="border border-gray-300 rounded-lg px-3 py-2 mb-4"
          placeholder="VD: Lô Heo đợt 1 tháng 9"
          value={batchName}
          onChangeText={setBatchName}
        />

        {/* Số lượng */}
        <Text className="mb-2 font-semibold">Số lượng ban đầu</Text>
        <TextInput
          className="border border-gray-300 rounded-lg px-3 py-2 mb-4"
          placeholder="Nhập số lượng con"
          keyboardType="numeric"
          value={quantity}
          onChangeText={setQuantity}
        />

        {/* Ngày bắt đầu */}
        <Text className="mb-2 font-semibold">Ngày bắt đầu nuôi</Text>
        <TextInput
          className="border border-gray-300 rounded-lg px-3 py-2 mb-4"
          placeholder="YYYY-MM-DD"
          value={startDate}
          onChangeText={setStartDate}
        />

        {/* Ngày dự kiến xuất chuồng */}
        <Text className="mb-2 font-semibold">Ngày dự kiến xuất chuồng</Text>
        <TextInput
          className="border border-gray-300 rounded-lg px-3 py-2 mb-4"
          placeholder="YYYY-MM-DD"
          value={expectedHarvestDate}
          onChangeText={setExpectedHarvestDate}
        />

        {/* Thức ăn */}
        <Text className="mb-2 font-semibold">Thức ăn</Text>
        <TextInput
          className="border border-gray-300 rounded-lg px-3 py-2 mb-4"
          placeholder="Nhập từng loại thức ăn, mỗi dòng 1 loại"
          multiline
          value={feed}
          onChangeText={setFeed}
        />

        {/* Thuốc / Vaccine */}
        <Text className="mb-2 font-semibold">Thuốc / Vaccine</Text>
        <TextInput
          className="border border-gray-300 rounded-lg px-3 py-2 mb-6"
          placeholder="Nhập từng loại thuốc, mỗi dòng 1 loại"
          multiline
          value={medications}
          onChangeText={setMedications}
        />

        {/* Nút tạo */}
        <TouchableOpacity
          onPress={handleCreate}
          className="bg-primary rounded-2xl py-3"
        >
          <Text className="text-center text-white font-semibold text-lg">
            Tạo mới
          </Text>
        </TouchableOpacity>

        {/* Nút hủy */}
        <TouchableOpacity
          onPress={() => router.back()}
          className="mt-3 border border-gray-300 rounded-2xl py-3"
        >
          <Text className="text-center text-gray-700">Hủy</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
