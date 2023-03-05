import { StatusBar } from "expo-status-bar";
import { useState } from "react";

import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
  ImageBackground,
  TouchableWithoutFeedback,
} from "react-native";
import { Camera } from "expo-camera";
import Svg, { Path } from "react-native-svg";

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
  const [capturedImage, setCapturedImage] = useState(null);
  const [paused, setPaused] = useState(false);

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
      const photo = await this.camera.takePictureAsync({ skipProcessing: true });
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
        <TouchableWithoutFeedback
          onPress={(e) =>
            console.log(
              `x is ${e.nativeEvent.locationX}, y is ${e.nativeEvent.locationY}`
            )
          }
        >
          <CapturedImage photo={capturedImage} show={paused} />
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback
          onPress={(e) =>
            console.log(
              `x is ${e.nativeEvent.locationX}, y is ${e.nativeEvent.locationY}`
            )
          }
        >
          <Camera
            type={Camera.Constants.Type.back}
            style={{ flex: 10, display: paused ? "none" : "show" }}
            ref={(r) => {
              this.camera = r;
            }}
          />
        </TouchableWithoutFeedback>
        <View
          style={{
            flex: 1.5,
            backgroundColor: "black",
            alignItems: "center",
          }}
        >
          <TouchableOpacity
            onPress={(e) => {
              captureImage();
            }}
            style={{
              borderRadius: 100,
              borderColor: "white",
              borderWidth: 4,
              width: "20%",
              flex: 0.7,
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
