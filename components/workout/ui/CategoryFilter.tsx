import { AppButton } from "@/components/custom-ui/AppButton";
import { ScrollView } from "react-native";

export function CategoryFilter() {
  const categories = ["All", "Full body", "Chests", "Shoulders", "Arms"];

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ gap: 8 }}
    >
      {categories.map((category) => {
        const isActive = category === "Full body";

        return (
          <AppButton
            key={category}
            className="h-8 px-6"
            title={category}
            variant={isActive ? "primary" : "secondary"}
            shape="pill"
            // icon={Dumbbell}
            // onPress={onStartWorkout}
          />
        );
      })}
    </ScrollView>
  );
}
