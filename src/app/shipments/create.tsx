// src/app/shipments/create.tsx
import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from "react-native";
import { useRouter } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";

// Giả lập danh sách lô hàng có thể xuất
const mockBatches = [
  { id: "B001", name: "Heo đợt 1 tháng 9" },
  { id: "B002", name: "Gà đợt 2 tháng 8" },
  { id: "B003", name: "Heo đợt 2 tháng 7" },
];

export default function CreateShipment() {
  const router = useRouter();

  const [batchId, setBatchId] = useState("");
  const [quantity, setQuantity] = useState("");
  const [destination, setDestination] = useState("");
  const [date, setDate] = useState("");
  const [note, setNote] = useState("");

  const handleCreate = () => {
    // TODO: gọi API gửi yêu cầu xuất lô
    console.log("Tạo yêu cầu xuất:", {
      batchId,
      quantity,
      destination,
      date,
      note,
    });

    // Sau khi tạo xong → quay về danh sách shipment
    router.back();
  };

  return (
    <SafeAreaView className="flex-1">
      {/* Header */}
      <View className="px-4 pt-10 pb-2 bg-primary shadow-md justify-start flex-row items-center">
        <TouchableOpacity onPress={() => router.back()} className="">
          <MaterialCommunityIcons name="arrow-left" size={28} color="white" />
        </TouchableOpacity>
        <Text className="text-white font-bold text-xl">Tạo yêu cầu xuất lô</Text>
      </View>
      <ScrollView className="flex-1 bg-white p-4">
        {/* <Text className="text-xl font-bold mb-4">Tạo yêu cầu xuất lô</Text> */}

      {/* Chọn lô */}
      <Text className="mb-2 font-semibold">Chọn lô</Text>
      {mockBatches.map((b) => (
        <TouchableOpacity
          key={b.id}
          onPress={() => setBatchId(b.id)}
          className={`p-3 mb-2 rounded-xl border ${
            batchId === b.id ? "border-primary bg-primary/10" : "border-gray-300"
          }`}
        >
          <Text className="text-gray-800">{b.name}</Text>
        </TouchableOpacity>
      ))}

      {/* Nhập số lượng */}
      <Text className="mb-2 font-semibold mt-4">Số lượng xuất</Text>
      <TextInput
        className="border border-gray-300 rounded-lg px-3 py-2 mb-4"
        placeholder="Nhập số lượng"
        keyboardType="numeric"
        value={quantity}
        onChangeText={setQuantity}
      />

      {/* Nơi nhận */}
      <Text className="mb-2 font-semibold">Nơi nhận</Text>
      <TextInput
        className="border border-gray-300 rounded-lg px-3 py-2 mb-4"
        placeholder="Nhập tên kho / nơi nhận"
        value={destination}
        onChangeText={setDestination}
      />

      {/* Ngày dự kiến */}
      <Text className="mb-2 font-semibold">Ngày dự kiến</Text>
      <TextInput
        className="border border-gray-300 rounded-lg px-3 py-2 mb-4"
        placeholder="VD: 2025-09-10"
        value={date}
        onChangeText={setDate}
      />

      {/* Ghi chú */}
      <Text className="mb-2 font-semibold">Ghi chú</Text>
      <TextInput
        className="border border-gray-300 rounded-lg px-3 py-2 mb-6"
        placeholder="Thêm ghi chú (không bắt buộc)"
        value={note}
        onChangeText={setNote}
        multiline
      />

      {/* Nút tạo */}
      <TouchableOpacity
        onPress={handleCreate}
        className="bg-primary rounded-2xl py-3"
      >
        <Text className="text-center text-white font-semibold text-lg">
          Gửi yêu cầu
        </Text>
      </TouchableOpacity>

      {/* Hủy */}
      <TouchableOpacity
        onPress={() => router.back()}
        className="mt-3 border border-gray-300 rounded-2xl py-3"
      >
        <Text className="text-center text-gray-700">Hủy</Text>
      </TouchableOpacity>
    </ScrollView>
  </SafeAreaView>
  );
}
