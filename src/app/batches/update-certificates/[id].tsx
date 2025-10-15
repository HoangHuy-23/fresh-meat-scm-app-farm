import { addCertificate } from "@/src/hooks/useBatches";
import { AppDispatch, RootState } from "@/src/store/store";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";

// ================= Component con cho Form =================

// Tái sử dụng FormInput
type FormInputProps = {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
};

const FormInput: React.FC<FormInputProps> = ({
  label,
  value,
  onChangeText,
  placeholder,
}) => (
  <View className="mb-5">
    <Text className="text-base font-bold text-gray-700 mb-2">{label}</Text>
    <TextInput
      className="p-4 bg-white border border-gray-300 rounded-lg text-base"
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
    />
  </View>
);

// Component mới cho việc chọn ảnh
type ImagePickerInputProps = {
  label: string;
  imageUri: string | null;
  onImagePicked: (uri: string) => void;
};

const ImagePickerInput: React.FC<ImagePickerInputProps> = ({
  label,
  imageUri,
  onImagePicked,
}) => {
  // Hàm để mở thư viện ảnh
  const pickImage = async () => {
    // Không cần xin quyền vì launchImageLibraryAsync sẽ tự động yêu cầu nếu cần
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      onImagePicked(result.assets[0].uri);
    }
  };

  return (
    <View className="mb-5">
      <Text className="text-base font-bold text-gray-700 mb-2">{label}</Text>
      <TouchableOpacity
        onPress={pickImage}
        className="h-48 border-2 border-dashed border-gray-300 rounded-lg justify-center items-center bg-gray-50 overflow-hidden"
      >
        {imageUri ? (
          <Image
            source={{ uri: imageUri }}
            className="w-full h-full"
            resizeMode="cover"
          />
        ) : (
          <View className="items-center">
            <MaterialCommunityIcons
              name="image-plus"
              size={48}
              className="text-gray-400"
            />
            <Text className="text-gray-500 mt-2">Chọn ảnh chứng chỉ</Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
};

// ================= Component chính: Màn hình thêm Certificate =================
export default function AddCertificateScreen() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { id } = useLocalSearchParams<{ id: string }>();

  // State cho form
  const [name, setName] = useState("");
  const [imageUri, setImageUri] = useState<string | null>(null); // Lưu trữ URI local của ảnh

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const batch = useSelector((state: RootState) =>
    state.batches.batches.find((b) => b.assetID === id)
  );

  const handleSave = async () => {
    if (!name.trim() || !imageUri) {
      setError("Tên chứng chỉ và hình ảnh là bắt buộc.");
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      const formData = new FormData();

      // Bước 2: Thêm các trường dữ liệu vào FormData
      // Thêm tên chứng chỉ với key là 'name'
      formData.append("name", name.trim());

      // Thêm file ảnh với key là 'photo'
      // Cần có uri, name (tên file), và type (MIME type)
      const filename = imageUri.split("/").pop() || `photo_${Date.now()}.jpg`;
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : `image`;

      formData.append("photo", {
        uri: imageUri,
        name: filename,
        type,
      } as any); // Cast as 'any' là cần thiết cho React Native

      // Bước 3: Gửi FormData đến API (Mô phỏng)
      // Trong thực tế, bạn sẽ dùng fetch hoặc axios để gửi formData này
      // Ví dụ: await axios.post(`/api/batches/${id}/certificates`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      console.log("Đang gửi FormData đến server:", {
        name: name.trim(),
        photo: { uri: imageUri, name: filename, type },
      });

      //await new Promise(resolve => setTimeout(resolve, 2000)); // Giả lập độ trễ mạng
      dispatch(addCertificate({ assetID: id, certificateData: formData }));

      console.log("Thêm chứng chỉ thành công!");
    } catch (apiError) {
      console.error("Lỗi khi thêm Certificate:", apiError);
      setError("Đã xảy ra lỗi. Vui lòng thử lại.");
    } finally {
      setIsSubmitting(false);
      Alert.alert("Thành công", "Đã thêm chứng chỉ mới.", [
        { text: "OK", onPress: () => router.back() },
      ]);
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
              Thêm chứng chỉ
            </Text>
            <Text className="text-sm font-bold text-white text-center">
              {batch.assetID}
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <FormInput
          label="Tên chứng chỉ / giấy tờ"
          value={name}
          onChangeText={setName}
          placeholder="Ví dụ: VietGAP, Giấy kiểm dịch"
        />
        <ImagePickerInput
          label="Hình ảnh chứng chỉ"
          imageUri={imageUri}
          onImagePicked={setImageUri}
        />

        {error && (
          <Text className="text-red-500 text-center mt-2">{error}</Text>
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
