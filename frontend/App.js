import { StatusBar } from "expo-status-bar";
import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
  ImageBackground,
} from "react-native";
import { Camera } from "expo-camera";
import Svg, { Path } from "react-native-svg";
import FileSystem from "expo-file-system";

let camera;

const PlayButton = () => {
  return (
    <Svg width="100%" height="100%" viewBox="0 0 24 24">
      <Path fill="white" d="M8,5.14V19.14L19,12.14L8,5.14Z" />
    </Svg>
  );
};

const PauseButton = () => {
  return (
    <Svg width="100%" height="100%" viewBox="0 0 24 24">
      <Path fill="white" d="M14,19H18V5H14M6,19H10V5H6V19Z" />
    </Svg>
  );
};

export default function App() {
  const [capturedImage, setCapturedImage] = React.useState(null);
  const [paused, setPaused] = React.useState(false);

  const requestPermissions = async () => {
    const { status } = await Camera.requestCameraPermissionsAsync();
    console.log(status);
    if (status !== "granted") {
      Alert.alert("Camera access is required to use Colour Sense!");
    }
  };
  const captureImage = async () => {
    if (paused) {
      setPaused(false);
    } else {
      await requestPermissions();
      const photo = await camera.takePictureAsync({ skipProcessing: true });
      const file = await FileSystem.readAsStringAsync(photo.uri);
      console.log(file);
      console.log(photo);
      setCapturedImage(photo);
      setPaused(true);
    }
  };
  return (
    <View style={styles.container}>
      <View
        style={{
          flex: 1,
          width: "100%",
        }}
      >
        <CapturedImage photo={capturedImage} show={paused} />
        <Camera
          type={Camera.Constants.Type.back}
          style={{ flex: 10, display: paused ? "none" : "show" }}
          ref={(r) => {
            camera = r;
          }}
        />
        <View
          style={{
            flex: 1.5,
            backgroundColor: "black",
            alignItems: "center",
          }}
        >
          <TouchableOpacity
            onPress={captureImage}
            style={{
              borderRadius: 100,
              borderColor: "white",
              borderWidth: 4,
              width: "20%",
              flex: 0.85,
              top: "7.5%",
            }}
          >
            {paused ? <PlayButton /> : <PauseButton />}
          </TouchableOpacity>
        </View>
      </View>

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});

const CapturedImage = ({ photo, show }) => {
  return (
    <View
      style={{
        backgroundColor: "transparent",
        display: show ? "flex" : "none",
        flex: 10,
        width: "100%",
        height: "100%",
        borderColor: "#fff",
        borderWidth: 1,
      }}
    >
      <ImageBackground
        source={{ uri: photo && photo.uri }}
        style={{
          flex: 1,
          height: "100%",
        }}
      />
    </View>
  );
};
