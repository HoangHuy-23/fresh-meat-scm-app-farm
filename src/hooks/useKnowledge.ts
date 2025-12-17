import { useCallback, useState } from "react";
import { useSelector } from "react-redux";
import {
  KnowledgeItem,
  MyKnowledgeResponse,
  UploadKnowledgeResponse,
  getMyKnowledge,
  uploadKnowledge,
} from "../api/knowledgeApi";
import { RootState } from "../store/store";

export const useKnowledge = () => {
  const auth = useSelector((state: RootState) => state.auth);
  const [uploading, setUploading] = useState(false);
  const [listing, setListing] = useState(false);
  const [items, setItems] = useState<KnowledgeItem[]>([]);
  const [total, setTotal] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const upload = useCallback(
    async (payload: KnowledgeItem[]) => {
      if (!auth.token) {
        setError("Vui lòng đăng nhập để tải lên kiến thức.");
        return { success: false, inserted: 0 } as UploadKnowledgeResponse;
      }
      setUploading(true);
      setError(null);
      try {
        const res = await uploadKnowledge(auth.token, payload);
        return res;
      } catch (e: any) {
        setError(e?.message ?? "Upload thất bại");
        return { success: false, inserted: 0 } as UploadKnowledgeResponse;
      } finally {
        setUploading(false);
      }
    },
    [auth.token]
  );

  const listMine = useCallback(
    async (
      params: { limit?: number; offset?: number; include_email?: boolean } = {}
    ) => {
      if (!auth.token) {
        setError("Vui lòng đăng nhập để xem kiến thức của bạn.");
        return { count: 0, items: [] } as MyKnowledgeResponse;
      }
      setListing(true);
      setError(null);
      try {
        const res = await getMyKnowledge(auth.token, params);
        setItems(res.items ?? []);
        setTotal(res.count ?? 0);
        return res;
      } catch (e: any) {
        setError(e?.message ?? "Không thể tải danh sách kiến thức");
        return { count: 0, items: [] } as MyKnowledgeResponse;
      } finally {
        setListing(false);
      }
    },
    [auth.token]
  );

  return { uploading, listing, items, total, error, upload, listMine };
};

export default useKnowledge;
