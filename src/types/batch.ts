// Định nghĩa các kiểu dữ liệu dựa trên JSON của bạn

interface ValueUnit<T> {
  value: T;
  unit: string;
}

interface Address {
  fullText: string;
  latitude: number;
  longitude: number;
}

export interface Feed {
  dosageKg: number;
  endDate: string;
  name: string;
  notes: string;
  startDate: string;
}

export interface Medication {
  dateApplied: string;
  dose: string;
  name: string;
  nextDueDate: string;
}

// Giả định cấu trúc Certificate dựa trên code cũ
export interface Certificate {
  name: string;
  media: {
    url: string;
  };
}

interface HistoryDetails {
  address: Address;
  certificates: Certificate[] | null; // Có thể là null
  expectedHarvestDate: string;
  facilityID: string;
  facilityName: string;
  feeds: Feed[];
  harvestDate: string;
  medications: Medication[];
  sowingDate: string;
  startDate: string;
}

interface HistoryItem {
  type: string;
  actorMSP: string;
  actorID: string;
  timestamp: string;
  txID: string;
  details: HistoryDetails;
}

// Đây là type chính cho toàn bộ đối tượng
export interface Batch {
  docType: "MeatAsset";
  assetID: string;
  sku: string;
  averageWeight: ValueUnit<number>;
  parentAssetIDs: string[];
  productName: string;
  status: string;
  ownerOrg: string;
  originalQuantity: ValueUnit<number>;
  currentQuantity: ValueUnit<number>;
  history: HistoryItem[];
}
