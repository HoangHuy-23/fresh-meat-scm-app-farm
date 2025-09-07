// src/app/batches/update-certificates/[id].tsx
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

// Mock data tạm
const mockData = {
  assetID: "BATCH123",
  productName: "Heo",
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
};

type Certificate = {
  name: string;
  url: string;
};

export default function UpdateCertificates() {
  const router = useRouter();
  const { id } = useLocalSearchParams() as { id: string };

  const [loading, setLoading] = useState(true);
  const [certificates, setCertificates] = useState<Certificate[]>([]);

  useEffect(() => {
    async function fetchProduct() {
      try {
        const data = mockData; // mock tạm
        setCertificates(data.certificates);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [id]);

  const handleAddCertificate = () => {
    const newCert: Certificate = {
      name: `Chứng chỉ ${certificates.length + 1}`,
      url: "https://example.com/certificate_new.png",
    };
    setCertificates([...certificates, newCert]);
  };

  const handleRemoveCertificate = (index: number) => {
    const updated = [...certificates];
    updated.splice(index, 1);
    setCertificates(updated);
  };

  const handleUpdate = () => {
    // Gửi payload lên API
    console.log("Updated certificates:", certificates);
    router.back();
  };

  if (loading) {
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
        <Text className="text-white font-bold text-xl">Cập nhật chứng chỉ</Text>
      </View>

      <ScrollView className="flex-1 p-4">
        <Text className="mb-2 font-semibold">Danh sách chứng chỉ</Text>

        {certificates.map((cert, index) => (
          <View
            key={index}
            className="flex-row items-center justify-between border p-2 rounded-lg mb-4"
          >
            <View className="flex-1">
              <Text className="font-medium">{cert.name}</Text>
              <Image
                source={{ uri: cert.url }}
                className="w-full h-40 mt-2 rounded-lg bg-gray-200"
                resizeMode="contain"
              />
            </View>
            <TouchableOpacity
              onPress={() => handleRemoveCertificate(index)}
              className="px-2 py-1 bg-red-500 rounded ml-2"
            >
              <Text className="text-white">Xóa</Text>
            </TouchableOpacity>
          </View>
        ))}

        <TouchableOpacity
          onPress={handleAddCertificate}
          className="bg-blue-500 rounded-2xl py-3 mb-6"
        >
          <Text className="text-center text-white font-semibold">
            Thêm chứng chỉ
          </Text>
        </TouchableOpacity>
      </ScrollView>

      <View className="px-4 pt-2 mb-6">
        <TouchableOpacity
          onPress={handleUpdate}
          className="bg-primary rounded-2xl py-3"
        >
          <Text className="text-center text-white font-semibold text-lg">
            Cập nhật chứng chỉ
          </Text>
        </TouchableOpacity>

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
