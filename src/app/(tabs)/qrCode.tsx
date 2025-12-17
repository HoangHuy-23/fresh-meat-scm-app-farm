import { shipmentApi } from "@/src/api/shipmentApi";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useFocusEffect, useIsFocused } from "@react-navigation/native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Button,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type ScanStatus = "scanning" | "loading" | "success" | "error";

export default function QRCode() {
  const [permission, requestPermission] = useCameraPermissions();
  const router = useRouter();
  const isFocused = useIsFocused();

  const [status, setStatus] = useState<ScanStatus>("scanning");
  const [message, setMessage] = useState<string>("");

  useFocusEffect(
    useCallback(() => {
      setStatus("scanning");
      setMessage("");
    }, [])
  );

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View className="flex-1 justify-center items-center p-4 bg-white">
        <Text className="text-center text-base mb-4">
          Vui lòng cấp quyền truy cập camera để quét mã QR.
        </Text>
        <Button onPress={requestPermission} title="Cấp quyền" />
      </View>
    );
  }

  const handleBarCodeScanned = async ({ data }: { data: string }) => {
    if (status !== "scanning") return;

    setStatus("loading");
    setMessage("Đang xác thực thông tin...");

    try {
      const parsed = JSON.parse(data);
      const { shipmentID, facilityID, items } = parsed;

      if (!shipmentID || !facilityID || !items || items.length === 0) {
        throw new Error("Mã QR không hợp lệ hoặc thiếu thông tin.");
      }

      const actualItems = items.map((item: any) => ({
        assetID: item.assetID,
        quantity: {
          value: item.quantity?.value,
          unit: item.quantity?.unit,
        },
      }));

      await shipmentApi.confirmPickupShipment(shipmentID, {
        facilityID,
        actualItems,
      });

      setStatus("success");
      setMessage(`Đã xác nhận nhận lô hàng ${shipmentID} thành công!`);

    } catch (err: any) {
      setStatus("error");

      // ==================================================================
      // MODIFIED: Cải tiến logic bắt lỗi để xử lý trường hợp 403
      // ==================================================================

      // 1. Kiểm tra xem đây có phải là lỗi từ API (có object 'response')
      if (err.response) {
        // 2. Nếu là lỗi API, kiểm tra status code cụ thể
        if (err.response.status === 403) {
          // Nếu là lỗi 403, hiển thị thông báo không có quyền
          setMessage("Lỗi: Bạn không có quyền xác nhận lô hàng này.");
        } else {
          // Với các lỗi API khác (404, 500, ...), hiển thị thông báo chung
          const apiErrorMessage = err.response.data?.message || "Không thể xác nhận do lỗi từ máy chủ.";
          setMessage(`Lỗi: ${apiErrorMessage}`);
        }
      }
      // 3. Kiểm tra lỗi parse JSON từ QR code
      else if (err instanceof SyntaxError) {
        setMessage("Lỗi: Mã QR không đúng định dạng.");
      }
      // 4. Bắt các lỗi khác (mất mạng, etc.)
      else {
        setMessage("Lỗi không xác định đã xảy ra. Vui lòng kiểm tra kết nối và thử lại.");
      }

      // Luôn log lỗi đầy đủ ra console để debug
      console.error("Scan Error:", err);
    }
  };

  const handleScanAgain = () => {
    setStatus("scanning");
    setMessage("");
  };

  const renderFooterContent = () => {
    switch (status) {
      case "loading":
        return (
          <>
            <ActivityIndicator size="large" color="#ffffff" />
            <Text className="text-white text-base text-center p-5 font-semibold">
              {message}
            </Text>
          </>
        );
      case "success":
        return (
          <>
            <MaterialCommunityIcons name="check-circle-outline" size={60} color="#4ade80" />
            <Text className="text-green-400 text-lg text-center p-5 font-bold">
              {message}
            </Text>
            <TouchableOpacity
              className="bg-blue-500 py-3 px-8 rounded-lg"
              onPress={handleScanAgain}
            >
              <Text className="text-white text-lg font-bold">Quét tiếp</Text>
            </TouchableOpacity>
          </>
        );
      case "error":
        return (
          <>
            <MaterialCommunityIcons name="alert-circle-outline" size={60} color="#f87171" />
            <Text className="text-red-400 text-lg text-center p-5 font-bold">
              {message}
            </Text>
            <TouchableOpacity
              className="bg-red-500 py-3 px-8 rounded-lg"
              onPress={handleScanAgain}
            >
              <Text className="text-white text-lg font-bold">Thử lại</Text>
            </TouchableOpacity>
          </>
        );
      case "scanning":
      default:
        return (
          <>
            <Text className="text-white text-base text-center p-5">
              Di chuyển camera đến gần mã QR để quét
            </Text>
            <TouchableOpacity
              className="bg-gray-500 py-3 px-8 rounded-lg"
              onPress={() => router.back()}
            >
              <Text className="text-white text-lg font-bold">Hủy</Text>
            </TouchableOpacity>
          </>
        );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {isFocused && (
        <CameraView
          style={styles.camera}
          onBarcodeScanned={status === "scanning" ? handleBarCodeScanned : undefined}
          barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
          facing="back"
        />
      )}

      <View className="absolute inset-0 justify-between items-center">
        <View className="w-full items-center bg-black/60 pt-5">
          <Text className="text-2xl font-bold text-white p-4">Quét mã QR</Text>
        </View>

        <View className="w-[250px] h-[250px] justify-center items-center">
          <View className="absolute top-0 left-0 w-10 h-10 border-t-[5px] border-l-[5px] border-white" />
          <View className="absolute top-0 right-0 w-10 h-10 border-t-[5px] border-r-[5px] border-white" />
          <View className="absolute bottom-0 left-0 w-10 h-10 border-b-[5px] border-l-[5px] border-white" />
          <View className="absolute bottom-0 right-0 w-10 h-10 border-b-[5px] border-r-[5px] border-white" />
        </View>

        <View className="w-full items-center bg-black/60 pb-10 min-h-[180px] justify-center">
          {renderFooterContent()}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  camera: {
    flex: 1,
  },
});