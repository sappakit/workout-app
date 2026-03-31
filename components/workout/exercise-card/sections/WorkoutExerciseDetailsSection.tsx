import { AppButton } from "@/components/custom-ui/AppButton";
import { ExerciseCardInfoItem } from "@/lib/workout/utils";
import { FileText } from "lucide-react-native";
import { FlatList, View } from "react-native";
import {
  ExerciseInfoCard,
  ExerciseInfoCardEquipment,
} from "../base/ExerciseInfoCard";

interface WorkoutExerciseDetailsSectionProps {
  infoData: ExerciseCardInfoItem[];
  equipment: string[];
  onPressMoreDetail?: () => void;
}

export default function WorkoutExerciseDetailsSection({
  infoData,
  equipment,
  onPressMoreDetail,
}: WorkoutExerciseDetailsSectionProps) {
  return (
    <>
      <FlatList
        data={infoData}
        numColumns={3}
        keyExtractor={(item) => item.key}
        scrollEnabled={false}
        columnWrapperStyle={{ gap: 8 }}
        contentContainerStyle={{ gap: 8 }}
        renderItem={({ item }) => (
          <View style={{ flex: 1 }}>
            <ExerciseInfoCard label={item.label} value={item.value} />
          </View>
        )}
      />

      <ExerciseInfoCardEquipment equipment={equipment} className="mt-2" />

      <AppButton
        title="More detail"
        variant="secondary"
        icon={FileText}
        className="mt-2 rounded-md"
        textClassName="font-medium"
        onPress={onPressMoreDetail}
      />
    </>
  );
}
