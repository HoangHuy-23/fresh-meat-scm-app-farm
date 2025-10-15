export interface Product {
  docType: "Product";
  sku: string;
  name: string;
  description: string;
  unit: string;
  averageWeight: { value: number; unit: string };
  sourceType: string;
  category: string;
  active: boolean;
}
