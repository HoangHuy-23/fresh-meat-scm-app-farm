export const mapUnitToVietnamese = (unit: string) => {
  switch (unit) {
    case "kg":
      return "kilogram";
    case "g":
      return "gram";
    case "l":
      return "lít";
    case "m":
      return "mét";
    case "piece":
      return "con";
    case "box":
      return "hộp";
    case "bag":
      return "túi";
    case "tray":
      return "khay";
    default:
      return unit;
  }
};

export const getStatusStyle = (status: string) => {
  console.log("getStatusStyle called with status:", status);
  switch (status) {
    case "AT_FARM":
      return "bg-green-100 text-green-700";
    case "PARTIALLY_SHIPPED":
      return "bg-yellow-100 text-yellow-700";
    case "Sẵn sàng xuất":
      return "bg-blue-100 text-blue-700";
    case "Sắp hết hạn":
      return "bg-red-100 text-red-700";
    case "SHIPPED":
      return "bg-purple-100 text-purple-700";
    case "COMPLETED":
      return "bg-gray-100 text-gray-700";
    default:
      return "bg-gray-100 text-gray-600";
  }
};

export const getStatusText = (status: string) => {
  switch (status) {
    case "AT_FARM":
      return "Đang nuôi";
    case "PARTIALLY_SHIPPED":
      return "Đang xuất";
    case "SHIPPED":
      return "Đã xuất";
    case "COMPLETED":
      return "Hoàn thành";
    default:
      return status;
  }
};
