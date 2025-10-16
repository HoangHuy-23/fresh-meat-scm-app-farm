// src/app/batches/[id].tsx
import { RootState } from "@/src/store/store";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSelector } from "react-redux";

// Import type Batch từ file định nghĩa (hoặc định nghĩa ở trên)
import { getStatusText, mapUnitToVietnamese } from "@/src/constants/Utils";
import { Batch, Certificate } from "@/src/types/batch";

// ================= Components con với TypeScript & NativeWind =================

type SectionProps = {
  title: string;
  // Giúp TypeScript gợi ý tên icon chính xác
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  children: React.ReactNode;
  actionButton?: React.ReactNode;
};

const Section: React.FC<SectionProps> = ({
  title,
  icon,
  children,
  actionButton,
}) => (
  <View className="bg-white rounded-xl p-4 mb-4 shadow-sm">
    {/* Bọc header trong một View để căn chỉnh */}
    <View className="flex-row items-center justify-between mb-3 pb-3 border-b border-gray-200">
      {/* Nhóm icon và title */}
      <View className="flex-row items-center">
        <MaterialCommunityIcons
          name={icon}
          size={22}
          className="text-gray-700"
        />
        <Text className="font-bold text-lg text-gray-800 ml-2">{title}</Text>
      </View>
      {/* Hiển thị nút hành động nếu có */}
      {actionButton}
    </View>
    <View>{children}</View>
  </View>
);

// Bạn có thể đặt component này trong cùng file hoặc tạo file riêng
type ActionButtonProps = {
  onPress: () => void;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  label: string;
};

const ActionButton: React.FC<ActionButtonProps> = ({
  onPress,
  icon,
  label,
}) => (
  <TouchableOpacity
    onPress={onPress}
    className="flex-row items-center bg-green-50 py-1 px-2 rounded-md active:bg-green-100"
  >
    <MaterialCommunityIcons
      name={icon}
      size={18}
      className="text-primary-light"
    />
    <Text className="text-primary-dark font-semibold text-sm ml-1">
      {label}
    </Text>
  </TouchableOpacity>
);

type InfoRowProps = {
  label: string;
  value: string | number | undefined;
};

const InfoRow: React.FC<InfoRowProps> = ({ label, value }) => (
  <View className="flex-row justify-between items-start py-2.5">
    <Text className="text-base text-gray-600 w-2/5">{label}</Text>
    <Text className="text-base text-gray-900 font-semibold text-right flex-1">
      {value || "N/A"}
    </Text>
  </View>
);

type ListItemCardProps = {
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  title: string;
  details: string[];
};

const ListItemCard: React.FC<ListItemCardProps> = ({
  icon,
  title,
  details,
}) => (
  <View className="flex-row items-start bg-green-50 p-3 rounded-lg mb-2 border-l-4 border-green-400">
    <MaterialCommunityIcons
      name={icon}
      size={24}
      className="text-green-600 mr-3 mt-1"
    />
    <View className="flex-1">
      <Text className="font-bold text-base text-gray-800">{title}</Text>
      {details.map((detail, index) => (
        <Text key={index} className="text-sm text-gray-600 mt-1">
          {detail}
        </Text>
      ))}
    </View>
  </View>
);

type CertificateCardProps = {
  certificate: Certificate;
};

const CertificateCard: React.FC<CertificateCardProps> = ({ certificate }) => {
  // Dùng optional chaining (?.) để truy cập an toàn và cung cấp ảnh mặc định
  const imageUrl = certificate.media?.url || "https://via.placeholder.com/150";

  return (
    <View className="w-1/2 p-1">
      <TouchableOpacity className="bg-white rounded-lg overflow-hidden border border-gray-200 active:opacity-70">
        <Image
          source={{ uri: imageUrl }}
          className="w-full h-32 bg-gray-200"
          resizeMode="cover"
        />
        <Text className="text-center p-2 text-sm text-gray-700">
          {certificate.name}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

// ================= Component chính =================
export default function BatchDetail() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const [loading, setLoading] = useState(true);
  // Sử dụng type `Batch` cho state
  const [batch, setBatch] = useState<Batch | null>(null);

  // Giả định `state.batches.batches` là một mảng `Batch[]`
  const { batches } = useSelector((state: RootState) => state.batches);

  useEffect(() => {
    // `foundBatch` sẽ có kiểu `Batch | undefined`
    const foundBatch = batches.find((b: Batch) => b.assetID === id);
    setBatch(foundBatch || null);
    setLoading(false);
  }, [id, batches]);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <ActivityIndicator size="large" color="#FF4D6D" />
      </View>
    );
  }

  if (!batch) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50 p-4">
        <Text className="text-lg text-gray-600">
          Không tìm thấy thông tin lô.
        </Text>
      </View>
    );
  }

  // Sử dụng optional chaining (?.) để truy cập an toàn, tránh lỗi khi history rỗng
  const historyItem = batch.history?.[0];
  const details = historyItem?.details;

  const navTo = (path: string) =>
    router.push(`/batches/${path}/${batch.assetID}`);

  return (
    <View className="flex-1 bg-gray-100">
      {/* Header */}
      <View className="px-4 pt-10 pb-3 bg-primary shadow-md  space-x-4">
        <TouchableOpacity onPress={() => router.back()} className="flex-row items-start relative">
          <MaterialCommunityIcons
            name="step-backward"
            size={28}
            color="white"
            className="absolute left-0 top-0"
          />
          <Text className="text-white font-bold text-2xl text-center w-full">Thông tin lô</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 120 }}>
        <Section title="Thông tin chung" icon="information-outline">
          <InfoRow label="Mã lô" value={batch.assetID} />
          <InfoRow label="Tên sản phẩm" value={batch.productName} />
          <InfoRow label="Nông trại" value={details?.facilityName} />
          <InfoRow label="Trạng thái" value={getStatusText(batch.status)} />
          <InfoRow label="Địa chỉ" value={details?.address.fullText} />
        </Section>

        <Section
          title="Số lượng & Cân nặng"
          icon="scale-balance"
          actionButton={
            <ActionButton
              onPress={() => navTo("update-average-weight")}
              icon="pencil-outline"
              label="Cập nhật"
            />
          }
        >
          <InfoRow
            label="Ban đầu"
            value={`${batch.originalQuantity.value} ${mapUnitToVietnamese(batch.originalQuantity.unit)}`}
          />
          <InfoRow
            label="Hiện tại"
            value={`${batch.currentQuantity.value} ${mapUnitToVietnamese(batch.currentQuantity.unit)}`}
          />
          <InfoRow
            label="Cân nặng TB"
            value={`${batch.averageWeight.value} ${mapUnitToVietnamese(batch.averageWeight.unit)}`}
          />
        </Section>

        <Section
          title="Mốc thời gian"
          icon="calendar-clock"
          actionButton={
            <ActionButton
              onPress={() => navTo("update-expected-harvest-date")}
              icon="calendar-edit"
              label="Cập nhật"
            />
          }
        >
          <InfoRow label="Ngày sinh" value={details?.sowingDate} />
          <InfoRow label="Ngày bắt đầu" value={details?.startDate} />
          <InfoRow
            label="Dự kiến thu hoạch"
            value={details?.expectedHarvestDate}
          />
        </Section>

        <Section
          title="Dinh dưỡng & Thức ăn"
          icon="food-apple-outline"
          actionButton={
            <ActionButton
              onPress={() => navTo("update-feeds")}
              icon="plus-circle-outline"
              label="Thêm"
            />
          }
        >
          {details?.feeds && details.feeds.length > 0 ? (
            details.feeds.map((item, index) => (
              <ListItemCard
                key={index}
                icon="barley"
                title={item.name}
                details={[
                  `Liều lượng: ${item.dosageKg} kg`,
                  `Thời gian: ${item.startDate}${item.endDate ? ` - ${item.endDate}` : ""}`,
                  item.notes ? `Ghi chú: ${item.notes}` : "Không có ghi chú",
                ]}
              />
            ))
          ) : (
            <Text className="text-gray-500 italic">
              Không có dữ liệu về thức ăn.
            </Text>
          )}
        </Section>

        <Section
          title="Y tế & Vaccine"
          icon="needle"
          actionButton={
            <ActionButton
              onPress={() => navTo("update-medications")}
              icon="plus-circle-outline"
              label="Thêm"
            />
          }
        >
          {details?.medications && details.medications.length > 0 ? (
            details.medications.map((item, index) => (
              <ListItemCard
                key={index}
                icon="pill"
                title={item.name}
                details={[
                  `Liều lượng: ${item.dose}`,
                  `Ngày áp dụng: ${item.dateApplied}`,
                  item.nextDueDate
                    ? `Ngày tiếp theo: ${item.nextDueDate}`
                    : "Không có lịch tiếp theo",
                ]}
              />
            ))
          ) : (
            <Text className="text-gray-500 italic">
              Không có dữ liệu về y tế.
            </Text>
          )}
        </Section>

        <Section
          title="Chứng chỉ & Giấy tờ"
          icon="certificate-outline"
          actionButton={
            <ActionButton
              onPress={() => navTo("update-certificates")}
              icon="plus-circle-outline"
              label="Thêm"
            />
          }
        >
          {details?.certificates && details.certificates.length > 0 ? (
            <View className="flex-row flex-wrap -m-1">
              {details.certificates.map((cert, index) => (
                <CertificateCard key={index} certificate={cert} />
              ))}
            </View>
          ) : (
            <Text className="text-gray-500 italic">
              Chưa có chứng chỉ nào được cập nhật.
            </Text>
          )}
        </Section>
      </ScrollView>

      {/* Floating Action Buttons */}
      {/* <TouchableOpacity
        onPress={() => router.push(`/batches/update/${batch.assetID}`)}
        className="absolute bottom-6 right-6 bg-[#FF4D6D] w-14 h-14 rounded-full items-center justify-center shadow-lg active:bg-red-600"
      >
        <MaterialCommunityIcons name="pencil" size={26} color="white" />
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() =>
          router.push(`/batches/update-certificates/${batch.assetID}`)
        }
        className="absolute bottom-24 right-6 bg-[#4DB8FF] w-14 h-14 rounded-full items-center justify-center shadow-lg active:bg-sky-500"
      >
        <MaterialCommunityIcons
          name="certificate-outline"
          size={26}
          color="white"
        />
      </TouchableOpacity> */}
    </View>
  );
}
