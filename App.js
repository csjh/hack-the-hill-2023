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
import { Constants, Svg } from "expo";
let camera;

export default function App() {
  const [startCamera, setStartCamera] = React.useState(false);
  const [previewVisible, setPreviewVisible] = React.useState(false);
  const [capturedImage, setCapturedImage] = React.useState(null);

  const requestPermissions = async () => {
    const { status } = await Camera.requestCameraPermissionsAsync();
    console.log(status);
    if (status === "granted") {
      setStartCamera(true);
    } else {
      Alert.alert("Camera access is required to use Colour Sense!");
    }
  };
  const captureImage = async () => {
    const photo = await camera.takePictureAsync();
    console.log(photo);
    setPreviewVisible(true);
    setCapturedImage(photo);
  };
  return (
    <View style={styles.container}>
      {startCamera ? (
        <View
          style={{
            flex: 1,
            width: "100%",
          }}
        >
          {previewVisible && capturedImage ? (
            <CapturedImage photo={capturedImage} />
          ) : (
            <>
              <Camera
                type={Camera.Constants.Type.back}
                style={{ flex: 10 }}
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
                  <Svg height={100} width={100}>
                    <Svg.Circle
                      cx={50}
                      cy={50}
                      r={45}
                      strokeWidth={2.5}
                      stroke="#e74c3c"
                      fill="#f1c40f"
                    />
                    <Svg.Rect
                      x={15}
                      y={15}
                      width={70}
                      height={70}
                      strokeWidth={2}
                      stroke="#9b59b6"
                      fill={toggle ? "#3498db" : "#9b59b6"}
                    />
                  </Svg>
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
      ) : (
        <View
          style={{
            flex: 1,
            backgroundColor: "#fff",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <TouchableOpacity
            onPress={requestPermissions}
            style={{
              width: 130,
              borderRadius: 4,
              backgroundColor: "#14274e",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              height: 40,
            }}
          >
            <Text
              style={{
                color: "#fff",
                fontWeight: "bold",
                textAlign: "center",
              }}
            >
              Take picture
            </Text>
          </TouchableOpacity>
        </View>
      )}

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

const CapturedImage = ({ photo }) => {
  console.log("sdsfds", photo);
  return (
    <View
      style={{
        backgroundColor: "transparent",
        flex: 1,
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
          height: "75%",
        }}
      />
    </View>
  );
};
