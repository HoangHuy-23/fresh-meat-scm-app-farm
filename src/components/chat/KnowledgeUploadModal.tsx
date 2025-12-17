import React, { useState } from "react";
import {
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useKnowledge } from "../../hooks/useKnowledge";

interface Props {
  visible: boolean;
  onClose: () => void;
  onUploaded?: () => void;
}

export const KnowledgeUploadModal: React.FC<Props> = ({
  visible,
  onClose,
  onUploaded,
}) => {
  const { upload, uploading, error } = useKnowledge();
  const [content, setContent] = useState("");
  const [stage, setStage] = useState("");
  const [species, setSpecies] = useState("heo");
  const [minAge, setMinAge] = useState("90");
  const [maxAge, setMaxAge] = useState("100");
  const [feed, setFeed] = useState("CP 201");
  const [dosage, setDosage] = useState("2.5 kg/con/ngày");
  const [medication, setMedication] = useState("");
  const [notes, setNotes] = useState("");

  const handleSubmit = async () => {
    const item = {
      content: content || undefined,
      stage: stage || undefined,
      species: species || undefined,
      min_age_days: minAge ? Number(minAge) : undefined,
      max_age_days: maxAge ? Number(maxAge) : undefined,
      recommended_feed: feed || undefined,
      feed_dosage: dosage || undefined,
      medication: medication || undefined,
      notes: notes || undefined,
    };
    const res = await upload([item]);
    if (res.success) {
      onUploaded?.();
      onClose();
    }
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <ScrollView className="flex-1 bg-white p-4">
        <Text className="text-xl font-semibold mb-4">Upload Knowledge</Text>
        {error && <Text className="text-red-500 mb-2">{error}</Text>}

        <Text className="text-sm text-gray-700 mb-1">Content</Text>
        <TextInput
          value={content}
          onChangeText={setContent}
          placeholder="Nội dung"
          className="border rounded p-2 mb-3"
          multiline
        />

        <Text className="text-sm text-gray-700 mb-1">Stage</Text>
        <TextInput
          value={stage}
          onChangeText={setStage}
          placeholder="Tăng trọng"
          className="border rounded p-2 mb-3"
        />

        <Text className="text-sm text-gray-700 mb-1">Species</Text>
        <TextInput
          value={species}
          onChangeText={setSpecies}
          placeholder="heo"
          className="border rounded p-2 mb-3"
        />

        <View className="flex-row gap-2 mb-3">
          <View className="flex-1">
            <Text className="text-sm text-gray-700 mb-1">Min Age (days)</Text>
            <TextInput
              value={minAge}
              onChangeText={setMinAge}
              keyboardType="numeric"
              className="border rounded p-2"
            />
          </View>
          <View className="flex-1">
            <Text className="text-sm text-gray-700 mb-1">Max Age (days)</Text>
            <TextInput
              value={maxAge}
              onChangeText={setMaxAge}
              keyboardType="numeric"
              className="border rounded p-2"
            />
          </View>
        </View>

        <Text className="text-sm text-gray-700 mb-1">Recommended Feed</Text>
        <TextInput
          value={feed}
          onChangeText={setFeed}
          placeholder="CP 201"
          className="border rounded p-2 mb-3"
        />

        <Text className="text-sm text-gray-700 mb-1">Feed Dosage</Text>
        <TextInput
          value={dosage}
          onChangeText={setDosage}
          placeholder="2.5 kg/con/ngày"
          className="border rounded p-2 mb-3"
        />

        <Text className="text-sm text-gray-700 mb-1">Medication</Text>
        <TextInput
          value={medication}
          onChangeText={setMedication}
          className="border rounded p-2 mb-3"
        />

        <Text className="text-sm text-gray-700 mb-1">Notes</Text>
        <TextInput
          value={notes}
          onChangeText={setNotes}
          className="border rounded p-2 mb-3"
        />

        <View className="flex-row justify-end gap-3 mt-4">
          <TouchableOpacity
            onPress={onClose}
            className="px-4 py-2 border rounded"
          >
            <Text>Đóng</Text>
          </TouchableOpacity>
          <TouchableOpacity
            disabled={uploading}
            onPress={handleSubmit}
            className="px-4 py-2 bg-green-500 rounded"
          >
            <Text className="text-white">
              {uploading ? "Đang tải..." : "Tải lên"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </Modal>
  );
};

export default KnowledgeUploadModal;
