import flask
import base64
from io import BytesIO
from PIL import Image
from imageai.Detection import ObjectDetection

detector = ObjectDetection()
detector.setModelTypeAsYOLOv3()
detector.setModelPath("../yolov3.pt")
detector.loadModel()

app = flask.Flask(__name__)


@app.route('/', methods=['POST'])
def index():
    image = flask.request.json['image']
    image = base64.b64decode(image)
    image = BytesIO(image)
    detections = detector.detectObjectsFromImage(
        input_image=Image.open(image), output_image_path="imagenew.jpg", minimum_percentage_probability=30)

    result = ""
    for eachObject in detections:
        result += eachObject["name"] + " : " + \
            str(eachObject["percentage_probability"]) + \
            " : " + str(eachObject["box_points"])
        result += "\n--------------------------------\n"
    return result
