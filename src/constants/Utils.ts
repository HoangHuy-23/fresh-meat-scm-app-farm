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

export const getStatusColors = (status: string) => {
  switch (status) {
    case "AT_FARM":
      return { bg: "#dcfce7", text: "#15803d" }; // green-100, green-700
    case "PARTIALLY_SHIPPED":
      return { bg: "#fef3c7", text: "#a16207" }; // yellow-100, yellow-700
    case "SHIPPED":
      return { bg: "#e9d5ff", text: "#7e22ce" }; // purple-100, purple-700
    case "COMPLETED":
      return { bg: "#f3f4f6", text: "#374151" }; // gray-100, gray-700
    default:
      return { bg: "#f3f4f6", text: "#6b7280" }; // gray-100, gray-600
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
