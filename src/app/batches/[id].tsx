// src/app/batches/[id].tsx
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

// ================= Mock Data =================
const mockProduct = {
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

// ================= Types =================
type Certificate = { name: string; url: string };

type FarmDetails = {
  startDate: string;
  expectedHarvestDate: string;
  feed: string[];
  medications: string[];
  certificates: Certificate[];
};

type Product = {
  assetID: string;
  productName: string;
  quantity: { unit: string; value: number };
  details: FarmDetails;
};

// ================= Component =================
export default function ProductDetail() {
  const router = useRouter();
  const { id } = useLocalSearchParams() as { id: string };

  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    async function fetchProduct() {
      try {
        const data: Product = mockProduct; // TODO: replace bằng API
        setProduct(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [id]);

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
        <Text className="text-white font-bold text-xl">
          Chi tiết lô {product.assetID}
        </Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 120 }}>
        {/* Thông tin cơ bản */}
        <Text className="font-bold text-lg mb-2">Thông tin cơ bản</Text>
        <Text className="mb-1">Loại vật nuôi: {product.productName}</Text>
        <Text className="mb-1">
          Số lượng ban đầu: {product.quantity.value} {product.quantity.unit}
        </Text>
        <Text className="mb-1">
          Ngày bắt đầu nuôi: {product.details.startDate}
        </Text>
        <Text className="mb-1">
          Ngày dự kiến xuất chuồng: {product.details.expectedHarvestDate}
        </Text>

        {/* Thức ăn */}
        <Text className="mb-1 mt-2 font-semibold">Thức ăn:</Text>
        {product.details.feed.map((item, index) => (
          <Text key={index} className="ml-2 mb-1">
            - {item}
          </Text>
        ))}

        {/* Thuốc / Vaccine */}
        <Text className="mb-1 mt-2 font-semibold">Thuốc / Vaccine:</Text>
        {product.details.medications.map((item, index) => (
          <Text key={index} className="ml-2 mb-1">
            - {item}
          </Text>
        ))}

        {/* Chứng chỉ */}
        <Text className="font-bold text-lg mb-2 mt-4">Chứng chỉ</Text>
        <View className="flex-row flex-wrap -mx-1">
          {product.details.certificates.map((cert, index) => (
            <View key={index} className="w-1/2 p-1 mb-2">
              <TouchableOpacity
                onPress={() => {}}
                className="border rounded-lg overflow-hidden"
              >
                <Image
                  source={{ uri: cert.url }}
                  className="w-full h-32"
                  resizeMode="cover"
                />
                <Text className="text-center p-1">{cert.name}</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Floating Update Button: Thông tin cơ bản */}
      <TouchableOpacity
        onPress={() => router.push(`/batches/update/${product.assetID}`)}
        className="absolute bottom-6 right-6 bg-[#FF4D6D] w-14 h-14 rounded-full items-center justify-center shadow-lg"
      >
        <MaterialCommunityIcons name="pencil" size={26} color="white" />
      </TouchableOpacity>

      {/* Floating Update Button: Chứng chỉ */}
      <TouchableOpacity
        onPress={() =>
          router.push(`/batches/update-certificates/${product.assetID}`)
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
