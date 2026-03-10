import BackIcon2 from "@/assets/icons/BackIcon2";
import { Dimensions, StyleProp, Text, View, ViewStyle } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { styles } from "./ProfileScreen.styles";

const { width } = Dimensions.get("window");
const PADDING = 32;
const size = width - PADDING * 2;
const x = PADDING;
const y = 75;

const gray = "#91A1BD";

export function ProfileScreen() {
  const NeuMorph = ({
    size,
    children,
    style,
  }: {
    size?: number;
    children?: React.ReactNode;
    style?: StyleProp<ViewStyle>;
  }) => {
    return (
      <View style={styles.topShadow}>
        <View style={styles.bottomShadow}>
          <View
            style={[
              styles.inner,
              {
                width: size ?? 40,
                height: size ?? 40,
                borderRadius: (size ?? 40) / 2,
              },
              style,
            ]}
          >
            {children}
          </View>
        </View>
      </View>
    );
  };
  return (
    <View style={styles.container}>
      <SafeAreaView style={{ alignSelf: "stretch" }} edges={["bottom"]}>
        <View style={{ marginHorizontal: 32, marginTop: 32 }}>
          <View style={styles.topContainer}>
            <NeuMorph>
              <BackIcon2 color={gray} />
            </NeuMorph>

            <View>
              <Text>Profile</Text>
            </View>

            <NeuMorph>
              <BackIcon2 color={gray} />
            </NeuMorph>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

//  {/* <Canvas style={{ width, height: size + y * 2 }}>
//         <Fill color="white" />
//         <SkiaButton x={x} y={y} size={size} />
//       </Canvas> */}
