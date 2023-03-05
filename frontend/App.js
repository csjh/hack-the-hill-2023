import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";

import { Dimensions } from "react-native";
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
import { manipulateAsync } from "expo-image-manipulator";
import { getColorName } from "./getColours";
import * as Speak from 'expo-speech';

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
        base64: true,
        quality: 0,
      });
      const manipulatedPhoto = await manipulateAsync(
        photo.uri,
        [{ resize: { width: Dimensions.get("screen").width } }],
        { compress: 0, format: "png", base64: true }
      );
      console.log(
        "Photo Size",
        manipulatedPhoto.height,
        manipulatedPhoto.width
      );
      setPaused(true);
      setCapturedImage(manipulatedPhoto);
      fetch("https://hack-the-north.onrender.com/get_all_pixels", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          image: manipulatedPhoto.base64,
        }),
      })
        .then((r) => r.json())
        .then((r) => {
          setPixels(r);
          console.log("Received data");
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
              width: "18%",
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

const CapturedImage = ({ photo, show, capturedImage, pixels, setPixels }) => {
  const [circlePosition, setCirclePosition] = useState(null);

  const handlePress = async (event) => {
    const { pageX = 0, pageY = 0 } = event.nativeEvent;
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
      }}
    >
      <TouchableWithoutFeedback onPress={handlePress}>
        <View style={{ flex: 1 }}>
          {circlePosition && (
            <ColorLabel pixels={pixels} circlePosition={circlePosition} />
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

const ColorLabel = ({ circlePosition, pixels }) => {
  useEffect(() => {
    Speak.speak(`You've selected ${getColorName(pixels[circlePosition.y][circlePosition.x])}`);
  }, [circlePosition]);

  return (
    <>
      <View
        style={{
          position: "absolute",
          width: 100,
          height: 40,
          borderRadius: 15,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "white",
          zIndex: 999,
          left: circlePosition.x - 50,
          top: circlePosition.y - 80,
        }}
      >
        <Text style={{ textAlign: "center" }}>
          {getColorName(pixels[circlePosition.y][circlePosition.x])}
        </Text>
      </View>
      <View
        style={{
          position: "absolute",
          width: 20,
          height: 20,
          borderRadius: 15,
          borderWidth: 1,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: `#${pixels[circlePosition.y][circlePosition.x][0]
            .toString(16)
            .padStart(2)}${pixels[circlePosition.y][circlePosition.x][1]
            .toString(16)
            .padStart(2)}${pixels[circlePosition.y][circlePosition.x][2]
            .toString(16)
            .padStart(2)}`,
          zIndex: 999,
          left: circlePosition.x - 15,
          top: circlePosition.y - 15,
        }}
      ></View>
    </>
  );
};
