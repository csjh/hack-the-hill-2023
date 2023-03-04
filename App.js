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
              <>
                <View style={{ flex: 0.65, backgroundColor: "red" }}>
                  <Text style={{
                    color: "#fff",
                    fontWeight: "bold",
                    textAlign: "center",
                    fontSize: 20,
                    top: "20%",
                  }}>You are looking at:</Text>
                  <Text style={{ 
                    color: "#fff",
                    fontWeight: "bold",
                    textAlign: "center",
                    fontSize: 40,
                    top: "25%",
                   }}>Color</Text>
                </View>
              </>
              <Camera
                type={Camera.Constants.Type.back}
                style={{ flex: 2 }}
                ref={(r) => {
                  camera = r;
                }}
              />
              <View
                style={{ flex: 0.85, backgroundColor: "green" }}
              >
                <View
                  style={{
                    alignSelf: "center",
                    flex: 1,
                    alignItems: "center",
                    textAlign: "center",
                  }}
                >
                  <TouchableOpacity
                    onPress={captureImage}
                    style={{
                      top: "45%",
                      borderRadius: 50,
                      backgroundColor: "green",
                    }}
                  >
                    <Text
                      style={{
                        color: "#fff",
                        fontWeight: "bold",
                        textAlign: "center",
                        fontSize: 40,
                      }}
                    >
                      Capture
                    </Text>
                  </TouchableOpacity>
                </View>
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
