import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";
import Reactotron from "reactotron-react-native";

if (__DEV__) {
  const hostFromExpo = Constants.expoConfig?.hostUri?.split(":")[0];

  Reactotron.configure({
    name: "healthApp",
    ...(hostFromExpo ? { host: hostFromExpo } : {}),
  })
    .setAsyncStorageHandler(AsyncStorage)
    .useReactNative({
      networking: {
        ignoreUrls: /symbolicate/,
      },
    })
    .connect();
}

export default Reactotron;
