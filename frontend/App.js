import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import{extractColors} from "extract-colors"
import { captureScreen } from "react-native-view-shot";



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
import Popup from "./Views/Popup";

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
  const [pixels, setPixels] = useState(false);


  

  const requestPermissions = async () => {
    const { status } = await Camera.requestCameraPermissionsAsync();
    console.log("status ", status);
    if (status !== "granted") {
      Alert.alert("Camera access is required to use Colour Sense!");
    }
  };
  const captureImage = async () => {
    if (paused) {
      setPaused(false);
    } else {
      await requestPermissions();
      const photo = await this.camera.takePictureAsync({
        skipProcessing: true, base64: true, quality: 0
      });
      console.log(photo.base64.length);
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
        <CapturedImage photo={capturedImage} show={paused} capturedImage={capturedImage} setPixels={setPixels} />
        <Camera
          type={Camera.Constants.Type.back}
          style={{ flex: 10, display: paused ? "none" : "show" }}
          ref={(r) => {
            this.camera = r;
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
            onPress={(e) => {
              captureImage();
            }}
            style={{
              borderRadius: 100,
              borderColor: "white",
              borderWidth: 4,
              width: "13%",
              flex: 0.6,
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

const CapturedImage = ({ photo, show, capturedImage, setPixels }) => {
  return (
    <TouchableWithoutFeedback
      onPress={async (e) => {
        console.log("in the request!!!");
        const { locationX, locationY } = e.nativeEvent;
        const pixelColors = await fetch("http://172.20.10.9:5000/get_pixel", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            pixel: [locationX, locationY],
            image: capturedImage.base64,
          }),
        }).then((r) => r.text());
        console.log(pixelColors);
        setPixels(pixelColors);
      }}
    >
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
    </TouchableWithoutFeedback>
  );
};
