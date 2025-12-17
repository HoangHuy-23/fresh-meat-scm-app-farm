import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { ReactNode } from "react";
import {
  Image,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import "../../../global.css";
import ChatBot from "../../components/ChatBot";
import ChatFloatingButton from "../../components/ChatFloatingButton";

// --- Type Definitions (Không đổi) ---
interface User {
  name: string;
  avatar: string;
}
interface QuickStat {
  id: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  label: string;
  value: string;
  color: string;
}
interface QuickAction {
  id: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  label: string;
  screen: string;
  path: string;
}
interface RecentActivity {
  id: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  color: string;
  text: string;
  time: string;
}
interface WelcomeHeaderProps {
  user: User;
}
interface QuickStatCardProps {
  item: QuickStat;
}
interface QuickActionButtonProps {
  item: QuickAction;
  onPress: () => void;
}
interface ActivityItemProps {
  item: RecentActivity;
}
interface AlertCardProps {
  level: "warning" | "danger";
  message: string;
}
interface SectionProps {
  title: string;
  children: ReactNode;
  hasMore?: boolean;
}

// --- Dữ liệu giả lập (Không đổi) ---
const quickStats: QuickStat[] = [
  {
    id: "1",
    icon: "package-variant-closed",
    label: "Số lô đang nuôi",
    value: "12",
    color: "#4CAF50",
  },
  {
    id: "2",
    icon: "check-circle-outline",
    label: "Sẵn sàng xuất",
    value: "5",
    color: "#2196F3",
  },
  {
    id: "3",
    icon: "truck-delivery-outline",
    label: "Đơn xuất/tuần",
    value: "8",
    color: "#FF9800",
  },
  {
    id: "4",
    icon: "clock-alert-outline",
    label: "Sắp hết hạn",
    value: "2",
    color: "#F44336",
  },
];
const quickActions: QuickAction[] = [
  {
    id: "1",
    icon: "plus-box-outline",
    label: "Tạo lô mới",
    screen: "CreateHarvest",
    path: "/batches/create",
  },
  {
    id: "2",
    icon: "send-outline",
    label: "Yêu cầu xuất",
    screen: "CreateExportRequest",
    path: "/shipments/create",
  },
  // { id: "3", icon: "qrcode-scan", label: "Quét QR", screen: "Scanner" },
];
const recentActivities: RecentActivity[] = [
  {
    id: "1",
    icon: "check-circle",
    color: "#4CAF50",
    text: "Tạo lô sản phẩm #123 thành công",
    time: "1 giờ trước",
  },
  {
    id: "2",
    icon: "cube-send",
    color: "#2196F3",
    text: "Xuất lô #122 đến Processor",
    time: "5 giờ trước",
  },
  {
    id: "3",
    icon: "bell-outline",
    color: "#FFC107",
    text: "Lô #120 đã được Processor xác nhận",
    time: "Hôm qua",
  },
];

// --- Components Con (Thiết kế lại) ---

// Cải tiến: Thêm khoảng cách và làm nổi bật tên
const WelcomeHeader: React.FC<WelcomeHeaderProps> = ({ user }) => (
  <View className="flex-row items-center justify-between px-4 w-full bg-primary pt-10 pb-2 shadow-sm">
    {/* Trái: Avatar + info */}
    <View className="flex-row items-center">
      <Image
        source={{ uri: user.avatar }}
        className="w-12 h-12 rounded-full mr-3 border-2 border-white"
      />
      <View>
        <Text className="text-sm text-white/80">Trang trại Hòa Bình</Text>
        <Text className="text-lg font-bold text-white">
          Xin chào, {user.name} 👋
        </Text>
        <Text className="text-xs text-white/70">
          Hôm nay: {new Date().toLocaleDateString("vi-VN")}
        </Text>
      </View>
    </View>

    {/* Phải: các nút nhỏ */}
    <View className="flex-row space-x-4 gap-1">
      <TouchableOpacity className="relative">
        <MaterialCommunityIcons name="bell-outline" size={24} color="#fff" />
        {/* Badge số lượng thông báo */}
        <View className="absolute -top-1 -right-1 bg-red-500 rounded-full w-4 h-4 flex items-center justify-center border border-white">
          <Text className="text-white text-[10px] font-bold">2</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity>
        <MaterialCommunityIcons name="cog-outline" size={24} color="#fff" />
      </TouchableOpacity>
    </View>
  </View>
);

// QuickStatCard: bo góc lớn, số to hơn, icon nổi bật hơn
const QuickStatCard: React.FC<QuickStatCardProps> = ({ item }) => (
  <View className="bg-white rounded-3xl p-5 w-[48%] mb-4 shadow-md border border-gray-100">
    <View className="flex-row justify-between items-center">
      <Text className="text-5xl font-extrabold text-gray-900">
        {item.value}
      </Text>
      <View
        className="w-10 h-10 rounded-full justify-center items-center"
        style={{ backgroundColor: `${item.color}20` }}
      >
        <MaterialCommunityIcons name={item.icon} size={24} color={item.color} />
      </View>
    </View>
    <Text className="text-sm text-gray-500 mt-3">{item.label}</Text>
  </View>
);

// QuickActionButton: icon tròn, màu primary nổi bật hơn
const QuickActionButton: React.FC<QuickActionButtonProps> = ({
  item,
  onPress,
}) => (
  <TouchableOpacity
    onPress={onPress}
    activeOpacity={0.8}
    className="flex-1 items-center justify-center mx-1.5"
  >
    <View className="w-16 h-16 rounded-full bg-primary justify-center items-center shadow-md">
      <MaterialCommunityIcons name={item.icon} size={28} color="#fff" />
    </View>
    <Text className="text-sm font-semibold text-gray-800 mt-2 text-center">
      {item.label}
    </Text>
  </TouchableOpacity>
);

// ActivityItem: icon tròn màu nhẹ, chữ rõ ràng
const ActivityItem: React.FC<ActivityItemProps> = ({ item }) => (
  <View className="flex-row items-center bg-white p-4 rounded-2xl mb-3 shadow-sm">
    <View
      className="w-12 h-12 rounded-full justify-center items-center"
      style={{ backgroundColor: `${item.color}20` }}
    >
      <MaterialCommunityIcons name={item.icon} size={24} color={item.color} />
    </View>
    <View className="flex-1 ml-3">
      <Text className="text-base text-gray-900 font-medium">{item.text}</Text>
      <Text className="text-sm text-gray-500">{item.time}</Text>
    </View>
  </View>
);

// AlertCard: thêm nền nhẹ + icon rõ ràng
const AlertCard: React.FC<AlertCardProps> = ({ level, message }) => {
  const isWarning = level === "warning";
  const bg = isWarning ? "bg-yellow-50" : "bg-red-50";
  const border = isWarning ? "border-yellow-300" : "border-red-300";
  const iconColor = isWarning ? "#f59e0b" : "#ef4444";
  const iconName = isWarning ? "alert-outline" : "alert-circle-outline";

  return (
    <View
      className={`flex-row items-center rounded-2xl p-4 mb-3 border ${bg} ${border} shadow-sm`}
    >
      <MaterialCommunityIcons name={iconName} size={24} color={iconColor} />
      <Text className="ml-3 text-base flex-1 font-medium text-gray-800">
        {message}
      </Text>
    </View>
  );
};

// Cải tiến: Tiêu đề to và rõ ràng hơn
const Section: React.FC<SectionProps> = ({
  title,
  children,
  hasMore = false,
}) => (
  <View className="mb-6">
    <View className="flex-row justify-between items-center mb-4 px-1">
      <Text className="text-xl font-bold text-gray-900">{title}</Text>
      {hasMore && (
        <TouchableOpacity onPress={() => console.log("View all")}>
          <Text className="text-base font-semibold text-primary">
            Xem tất cả
          </Text>
        </TouchableOpacity>
      )}
    </View>
    {children}
  </View>
);

// --- Màn hình chính ---
const DashboardScreen: React.FC = () => {
  const router = useRouter();
  const user: User = {
    name: "Nguyễn Văn A",
    avatar: "https://static.vecteezy.com/system/resources/previews/036/280/651/original/default-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-illustration-vector.jpg",
  };
  const handleActionPress = (path: string) => {
    console.log(`Navigating to ${path}`);
    // Navigation logic here
    router.push(path as any);
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50 items-center">
      <WelcomeHeader user={user} />
      <ScrollView
        contentContainerStyle={{ padding: 16 }}
        showsVerticalScrollIndicator={false}
        // stickyHeaderIndices={[0]}
      >
        <Section title="Thông báo quan trọng">
          <AlertCard level="danger" message="Lô #118 sắp hết hạn bảo quản." />
          <AlertCard
            level="warning"
            message="Lỗi đồng bộ blockchain lúc 10:30 AM."
          />
        </Section>

        <Section title="Thống kê nhanh">
          <View className="flex-row flex-wrap justify-between">
            {quickStats.map((item) => (
              <QuickStatCard key={item.id} item={item} />
            ))}
          </View>
        </Section>

        <Section title="Hành động nhanh">
          <View className="flex-row justify-around">
            {quickActions.map((item) => (
              <QuickActionButton
                key={item.id}
                item={item}
                onPress={() => handleActionPress(item.path)}
              />
            ))}
          </View>
        </Section>

        <Section title="Hoạt động gần đây" hasMore>
          {recentActivities.map((item) => (
            <ActivityItem key={item.id} item={item} />
          ))}
        </Section>
      </ScrollView>

      {/* Chat Components */}
      <ChatFloatingButton />
      <ChatBot />
    </SafeAreaView>
  );
};

export default DashboardScreen;
