// src/app/batches/[id].tsx
import { Batch } from "@/src/hooks/useBatches";
import { RootState } from "@/src/store/store";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSelector } from "react-redux";

// ================= Mock Data =================
const mockBatch = {
  assetID: "BATCH123",
  productName: "Heo",
  quantity: { unit: "con", value: 50 },
  details: {
    startDate: "2025-09-01",
    expectedHarvestDate: "2025-12-01",
    feed: ["Cám công nghiệp", "Ngô nghiền"],
    medications: ["Vitamin tổng hợp", "Kháng sinh phòng bệnh"],
    certificates: [
      {
        name: "Giấy kiểm dịch",
        url: "https://th.bing.com/th/id/R.31f119cbebfd615a4649fb462ecd1c24?rik=njRwD1x6rIYaOw&pid=ImgRaw&r=0",
      },
      {
        name: "Chứng nhận an toàn",
        url: "https://th.bing.com/th/id/R.31f119cbebfd615a4649fb462ecd1c24?rik=njRwD1x6rIYaOw&pid=ImgRaw&r=0",
      },
    ],
  },
};


// ================= Component =================
export default function BatchDetail() {
  const router = useRouter();
  const { id } = useLocalSearchParams() as { id: string };

  const [loading, setLoading] = useState(true);
  const [Batch, setBatch] = useState<Batch | null>(null);
  const { batches } = useSelector((state: RootState) => state.batches);

  useEffect(() => {
    const foundBatch = batches.find((b) => b.assetID === id);
    if (foundBatch) {
      setBatch(foundBatch);
    } else {
      // Nếu không tìm thấy trong store, dùng mock tạm
      setBatch(null);
    }
    setLoading(false);
  }, [id]);

  if (loading || !Batch) {
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
        <Text className="text-white font-bold text-xl">
          Chi tiết lô {Batch.assetID}
        </Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 120 }}>
        {/* Thông tin cơ bản */}
        <Text className="font-bold text-lg mb-2">Thông tin cơ bản</Text>
        <Text className="mb-1">Loại vật nuôi: {Batch.productName}</Text>
        <Text className="mb-1">
          Số lượng ban đầu: {Batch.originalQuantity.value} {Batch.originalQuantity.unit}
        </Text>
        <Text className="mb-1">
          Số lượng hiện tại: {Batch.currentQuantity.value} {Batch.currentQuantity.unit}
        </Text>
        <Text className="mb-1">
          Ngày bắt đầu nuôi: {Batch.history[0].details.startDate}
        </Text>
        <Text className="mb-1">
          Ngày dự kiến xuất chuồng: {Batch.history[0].details.expectedHarvestDate}
        </Text>

        {/* Thức ăn */}
        <Text className="mb-1 mt-2 font-semibold">Thức ăn:</Text>
        {Batch.history[0].details.feed &&Batch.history[0].details.feed.length > 0 && Batch.history[0].details.feed.map((item, index) => (
          <Text key={index} className="ml-2 mb-1">
            - {item}
          </Text>
        ))}

        {/* Thuốc / Vaccine */}
        <Text className="mb-1 mt-2 font-semibold">Thuốc / Vaccine:</Text>
        {Batch.history[0].details.medications && Batch.history[0].details.medications.length > 0 && Batch.history[0].details.medications.map((item, index) => (
          <Text key={index} className="ml-2 mb-1">
            - {item}
          </Text>
        ))}

        {/* Chứng chỉ */}
        <Text className="font-bold text-lg mb-2 mt-4">Chứng chỉ</Text>
        <View className="flex-row flex-wrap -mx-1">
          {Batch.history[0].details.certificates && Batch.history[0].details.certificates.map((cert, index) => (
            <View key={index} className="w-1/2 p-1 mb-2">
              <TouchableOpacity
                onPress={() => {}}
                className="border rounded-lg overflow-hidden"
              >
                <Image
                  source={{ uri: cert.s3Key || mockBatch.details.certificates[0].url }}
                  className="w-full h-32"
                  resizeMode="cover"
                />
                <Text className="text-center p-1">{mockBatch.details.certificates[0].name}</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Floating Update Button: Thông tin cơ bản */}
      <TouchableOpacity
        onPress={() => router.push(`/batches/update/${Batch.assetID}`)}
        className="absolute bottom-6 right-6 bg-[#FF4D6D] w-14 h-14 rounded-full items-center justify-center shadow-lg"
      >
        <MaterialCommunityIcons name="pencil" size={26} color="white" />
      </TouchableOpacity>

      {/* Floating Update Button: Chứng chỉ */}
      <TouchableOpacity
        onPress={() =>
          router.push(`/batches/update-certificates/${Batch.assetID}`)
        }
        className="absolute bottom-24 right-6 bg-[#4DB8FF] w-14 h-14 rounded-full items-center justify-center shadow-lg"
      >
        <MaterialCommunityIcons
          name="certificate-outline"
          size={26}
          color="white"
        />
      </TouchableOpacity>
    </View>
  );
}
