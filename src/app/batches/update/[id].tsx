// src/app/batches/update/[id].tsx
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

// mock data tạm
const mockData = {
  assetID: "BATCH123",
  productName: "Heo đợt 1 tháng 9",
  quantity: { unit: "con", value: 50 },
  details: {
    startDate: "2025-09-01",
    expectedHarvestDate: "2025-12-01",
    feed: ["Cám công nghiệp", "Ngô nghiền"],
    medications: ["Vitamin tổng hợp", "Kháng sinh phòng bệnh"],
    certificates: [],
  },
};

type FarmDetailsAPI = {
  startDate: string;
  expectedHarvestDate: string;
  feed: string[];
  medications: string[];
};

type ProductAPI = {
  assetID: string;
  productName: string;
  quantity: { unit: string; value: number };
  details: FarmDetailsAPI;
};

export default function UpdateProduct() {
  const router = useRouter();
  const { id } = useLocalSearchParams() as { id: string };

  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState<ProductAPI | null>(null);

  const [type, setType] = useState("heo");
  const [batchName, setBatchName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [startDate, setStartDate] = useState("");
  const [expectedHarvestDate, setExpectedHarvestDate] = useState("");
  const [feed, setFeed] = useState("");
  const [medications, setMedications] = useState("");

  useEffect(() => {
    async function fetchProduct() {
      try {
        const data = mockData; // mock tạm
        setProduct(data);

        setType(data.productName.toLowerCase());
        setBatchName(data.productName);
        setQuantity(String(data.quantity.value));
        setStartDate(data.details.startDate);
        setExpectedHarvestDate(data.details.expectedHarvestDate);
        setFeed(data.details.feed.join("\n"));
        setMedications(data.details.medications.join("\n"));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [id]);

  const handleUpdate = async () => {
    const payload = {
      details: JSON.stringify({
        startDate,
        expectedHarvestDate,
        feed: feed.split("\n").filter(Boolean),
        medications: medications.split("\n").filter(Boolean),
      }),
    };

    try {
      console.log("Update payload:", payload);
      router.back();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading || !product) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View className="px-4 pt-10 pb-2 bg-primary shadow-md flex-row items-center space-x-4">
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialCommunityIcons name="arrow-left" size={28} color="white" />
        </TouchableOpacity>
        <Text className="text-white font-bold text-xl">Cập nhật lô {product?.assetID}</Text>
      </View>

      <ScrollView
        className="flex-1 p-4"
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
      >
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
          value={batchName}
          editable={false}
        />

        {/* Số lượng */}
        <Text className="mb-2 font-semibold">Số lượng ban đầu</Text>
        <TextInput
          className="border border-gray-300 rounded-lg px-3 py-2 mb-4"
          value={quantity}
          editable={false}
        />

        {/* Ngày bắt đầu */}
        <Text className="mb-2 font-semibold">Ngày bắt đầu nuôi</Text>
        <TextInput
          className="border border-gray-300 rounded-lg px-3 py-2 mb-4"
          value={startDate}
          onChangeText={setStartDate}
        />

        {/* Ngày dự kiến xuất chuồng */}
        <Text className="mb-2 font-semibold">Ngày dự kiến xuất chuồng</Text>
        <TextInput
          className="border border-gray-300 rounded-lg px-3 py-2 mb-4"
          value={expectedHarvestDate}
          onChangeText={setExpectedHarvestDate}
        />

        {/* Thức ăn */}
        <Text className="mb-2 font-semibold">Thức ăn</Text>
        <TextInput
          className="border border-gray-300 rounded-lg px-3 py-2 mb-4"
          multiline
          value={feed}
          onChangeText={setFeed}
        />

        {/* Thuốc / Vaccine */}
        <Text className="mb-2 font-semibold">Thuốc / Vaccine</Text>
        <TextInput
          className="border border-gray-300 rounded-lg px-3 py-2 mb-6"
          multiline
          value={medications}
          onChangeText={setMedications}
        />
      </ScrollView>

      <View className="px-4 pt-2 mb-6">
        {/* Nút cập nhật */}
        <TouchableOpacity
          onPress={handleUpdate}
          className="bg-primary rounded-2xl py-3"
        >
          <Text className="text-center text-white font-semibold text-lg">
            Cập nhật
          </Text>
        </TouchableOpacity>

        {/* Nút hủy */}
        <TouchableOpacity
          onPress={() => router.back()}
          className="mt-3 border border-gray-300 rounded-2xl py-3"
        >
          <Text className="text-center text-gray-700">Hủy</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
