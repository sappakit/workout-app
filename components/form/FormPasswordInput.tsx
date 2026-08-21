import { AppButton } from "@/components/custom-ui/app-button";
import FormTextInput, {
  type FormTextInputProps,
} from "@/components/form/FormTextInput";
import { useState } from "react";
import { View } from "react-native";

export default function FormPasswordInputV2({ ...props }: FormTextInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View className="relative">
      <FormTextInput
        {...props}
        secureTextEntry={!showPassword}
        inputClassName="pr-10"
      />

      <View className="absolute right-2 top-0 h-full justify-center">
        <AppButton
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-full"
          icon={{
            name: showPassword ? "visibility" : "visibility-off",
            size: "sm",
          }}
          onPress={() => setShowPassword((prev) => !prev)}
        />
      </View>
    </View>
  );
}
