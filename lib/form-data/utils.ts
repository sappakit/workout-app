import { ReactNativeFile } from "@/types/common/file.types";
import { Platform } from "react-native";

export async function appendImageToFormData(
  formData: FormData,
  image: ReactNativeFile,
) {
  if (Platform.OS === "web") {
    const response = await fetch(image.uri);
    const blob = await response.blob();

    const file = new File([blob], image.name, {
      type: image.type,
    });

    formData.append("image", file);
    return;
  }

  formData.append("image", {
    uri: image.uri,
    name: image.name,
    type: image.type,
  } as unknown as Blob);
}
