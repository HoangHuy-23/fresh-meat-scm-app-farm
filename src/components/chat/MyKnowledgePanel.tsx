import React, { useEffect } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useKnowledge } from "../../hooks/useKnowledge";

interface Props {
  onClose: () => void;
}

export const MyKnowledgePanel: React.FC<Props> = ({ onClose }) => {
  const { listMine, items, listing, total, error } = useKnowledge();

  useEffect(() => {
    listMine({ limit: 20, offset: 0, include_email: true });
  }, [listMine]);

  return (
    <View className="absolute top-0 left-0 bottom-0 w-full z-[100] bg-white">
      <View className="flex-row items-center justify-between p-5 bg-green-600">
        <Text className="text-white font-bold text-2xl">Kiến thức của tôi</Text>
        <TouchableOpacity onPress={onClose} className="p-1">
          <Text className="text-white text-base">Đóng</Text>
        </TouchableOpacity>
      </View>
      {error && <Text className="text-red-500 p-3">{error}</Text>}
      <ScrollView className="flex-1 p-4">
        {listing ? (
          <Text className="text-gray-600 text-base">Đang tải...</Text>
        ) : items?.length === 0 ? (
          <Text className="text-gray-600 text-base">
            Chưa có kiến thức nào.
          </Text>
        ) : (
          items?.map((k) => (
            <View
              key={k._id ?? k.id}
              className="p-4 mb-4 border rounded-xl bg-white"
            >
              <View className="flex-row justify-between items-center mb-1">
                <Text className="text-sm px-2.5 py-0.5 bg-green-100 text-green-700 rounded-full">
                  {k.stage || "—"}
                </Text>
                {k.facilityID ? (
                  <Text className="text-xs px-2 py-0.5 bg-gray-100 text-gray-700 rounded-full">
                    {k.facilityID}
                  </Text>
                ) : null}
              </View>
              <Text className="font-semibold text-gray-900 text-lg leading-relaxed">
                {k.content}
              </Text>
              <View className="flex-row justify-between mt-3">
                <Text className="text-sm text-gray-600">{k.species ?? ""}</Text>
                <Text className="text-sm text-gray-600">
                  Từ {k.min_age_days ?? "-"} đến {k.max_age_days ?? "-"} ngày
                  tuổi
                </Text>
              </View>
              {(k.recommended_feed || k.feed_dosage) && (
                <Text className="text-sm text-gray-700 mt-2">
                  Thức ăn: {k.recommended_feed ?? "—"}
                  {k.feed_dosage ? ` • Liều: ${k.feed_dosage}` : ""}
                </Text>
              )}
              {k.medication && (
                <Text className="text-sm text-gray-700 mt-1">
                  Thuốc: {k.medication}
                </Text>
              )}
              {k.notes && (
                <Text className="text-sm text-gray-700 mt-1">
                  Ghi chú: {k.notes}
                </Text>
              )}
            </View>
          ))
        )}
        <Text className="text-sm text-gray-500 p-4">Tổng: {total}</Text>
      </ScrollView>
    </View>
  );
};

export default MyKnowledgePanel;
