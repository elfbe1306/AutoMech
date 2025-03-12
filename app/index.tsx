import { Text, View } from "react-native";
import Chap2_CDC  from "../components/chap2_CDC"
import Chap2_PPTST from "../components/chap2_PPTST"

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Edit app/index.tsx to edit this screen.</Text>

      <Chap2_CDC/>

      <Chap2_PPTST/>

    </View>
  );
}
