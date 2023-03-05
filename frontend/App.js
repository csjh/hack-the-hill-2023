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
        base64: true
      });
      console.log("photo ", photo.height, photo.width)
      console.log("i'm here")
      fetch("http://127.0.0.1:5000/get_all_pixels", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          image: photo.base64,
        }),
      })
        .then((r) => r.json())
        .then((r) => {
          setPixels(r);
          console.log(r);
          setCapturedImage(photo);
          setPaused(true);
        });
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
        <CapturedImage
          photo={capturedImage}
          show={paused}
          capturedImage={capturedImage}
          pixels={pixels}
          setPixels={setPixels}
        />
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

const CapturedImage = ({ photo, show, capturedImage, pixels, setPixels }) => {
  const [circlePosition, setCirclePosition] = useState(null);

  const handlePress = async (event) => {
    const { pageX = 0, pageY = 0 } = event.nativeEvent;
    console.log("pageX ", pageX, "pageY ", pageY);
    console.log(
      "pixels ",
      pixels[Math.round(pageY)],
      pixels.length,
      pixels[0].length
    );
    console.log(
      `rgb(${pixels[Math.round(pageY)][Math.round(pageX)][0]}, ${
        pixels[Math.round(pageY)][Math.round(pageX)][1]
      }, ${pixels[Math.round(pageY)][Math.round(pageX)][2]})`
    );
    setCirclePosition({ x: Math.round(pageX), y: Math.round(pageY) });
  };

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
      <TouchableWithoutFeedback onPress={handlePress}>
        <View style={{ flex: 1 }}>
          {circlePosition && (
            <View
              style={{
                position: "absolute",
                width: 30,
                height: 30,
                borderRadius: 15,
                backgroundColor: `rgb(${
                  pixels[circlePosition.y][circlePosition.x][0]
                }, ${pixels[circlePosition.y][circlePosition.x][1]}, ${
                  pixels[circlePosition.y][circlePosition.x][2]
                })`,
                zIndex: 999,
                left: circlePosition.x - 15,
                top: circlePosition.y - 15,
              }}
            />
          )}
          <ImageBackground
            source={{ uri: photo && photo.uri }}
            style={{
              flex: 1,
              height: "100%",
            }}
          />
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
};
