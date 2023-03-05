import flask
import base64
import requests
from io import BytesIO
from PIL import Image
# from imageai.Detection import ObjectDetection

# detector = ObjectDetection()
# detector.setModelTypeAsYOLOv3()
# detector.setModelPath("../yolov3.pt")
# detector.loadModel()

app = flask.Flask(__name__)

cache = None


@app.route("/get_all_pixels", methods=["POST"])
def get_pixel():
    print("made it to the request")
    image = flask.request.json['image']
    image = Image.open(BytesIO(base64.b64decode(image)))
    print(image.width, image.height)
    pixels = [[list(image.getpixel((x, y))) 
               for x in range(image.width)]
               for y in range(image.height)]
    return str(pixels)


# @app.route('/get_objects', methods=['POST'])
# def index():
#     image = flask.request.json['image']
#     image = base64.b64decode(image)
#     image = BytesIO(image)
#     detections = detector.detectObjectsFromImage(
#         input_image=Image.open(image), output_image_path="imagenew.jpg", minimum_percentage_probability=30)

#     result = ""
#     for eachObject in detections:
#         result += eachObject["name"] + " : " + \
#             str(eachObject["percentage_probability"]) + \
#             " : " + str(eachObject["box_points"])
#         result += "\n--------------------------------\n"
#     return result
