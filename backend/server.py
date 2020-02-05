import subprocess
from flask import Flask, jsonify, request
from flask_restful import Resource, Api
import terrainFaceSelect
import json
import os
# from dd_ml_segmentation_benchmark.other_func.get_scatters import ImageScatter
# from dd_ml_segmentation_benchmark.other_func.get_clusters import get_colors, get_image, ImageScatter
# creating the flask app
app = Flask(__name__)
# creating an API object
api = Api(app)

# making a class for a particular resource
# the get, post methods correspond to get and post requests
# they are automatically mapped by flask_restful.
# other methods include put, delete, etc.
history = []
# model_path = "/4TB/simeng/hacknroll-seg/wandb/run-20200118_034010-5ed8ms7k/model-best.h5"
# imgSct = ImageScatter(model_path)

class GenerateDefault(Resource):
    # this function is called whenever there
    # is a GET request for this resource
    def get(self):
        # subprocess.run(['python', 'terrainFaceSelect.py'])
        terrainFaceSelect.initiateProcedure()
        print('beans')
        return "True", 200, {'Access-Control-Allow-Origin': '*'}

class GenerateCustom(Resource):
    def get(self, tilex, tiley, zoom, lat, long):
        print(f'Got {tilex}, {tiley}, {zoom}. Initiating generation...')
        terrainFaceSelect.initiateProcedure(tilex, tiley, zoom)
        history.append({
            "tilex":tilex,
            "tiley":tiley,
            "zoom":zoom,
            "lat":lat,
            "long":long
        })
        return "True", 200, {'Access-Control-Allow-Origin': '*'}

class GetApiKey(Resource):
    def get(self):
        return json.load(open('auth.json'))['MAPS_KEY'], 200, {'Access-Control-Allow-Origin': '*'}

class GetWeatherApiKey(Resource):
    def get(self):
        return json.load(open('auth.json'))['DARKSKY_KEY'], 200, {'Access-Control-Allow-Origin': '*'}

class GetAnalysisResult(Resource):
    def get(self):
        if len(history) != 0:
            return json.load(open('data.json')), 200, {'Access-Control-Allow-Origin': '*'}
        else:
            return "False", 200, {'Access-Control-Allow-Origin': '*'}
            

class GetLastPosition(Resource):
    def get(self):
        if len(history)>0:
            return history[-1], 200, {'Access-Control-Allow-Origin': '*'}
        else:
            return "False", 200, {'Access-Control-Allow-Origin': '*'}


class GetImage(Resource):
    def get(self, lat, long, zoom):
        """
        Image clustering
        """
        url = 'https://maps.googleapis.com/maps/api/staticmap';

        #   //Set the Google Map Center.
        url += '?center=' + lat + ',' + long;
        #   //Set the Google Map Size.
        url += '&size=600x900';
        #   //Set the Google Map Zoom.
        url += '&zoom=' + zoom;
        #   //Set the Google Map Type.
        url += '&maptype=satellite';

        #   //Set the Google Map Type.
        url += f"&key={json.load(open('auth.json'))['MAPS_KEY']}";
        print('url : ', url)
        image_path = "dd_ml_segmentation_benchmark/original/" + "image" + '.jpg'
        print('IMGPATH : ', image_path)
        # save_path =  "/home/rohan/Desktop/Web_files/mapsExploration/3D_render/backend/dd_ml_segmentation_benchmark/predictions"
        imgSct.download(url, image_path)
        clustering_pct = get_colors(get_image(image_path), 3, True)
        # imgSct.convert(image_path, save_path)
        # colors_dict_pct = imgSct.get_colors_dict(
            # os.path.join(save_path, image_path.split('/')[-1].split('.')[0] + '.png'))
        # print(colors_dict_pct)
        return clustering_pct, 200, {'Access-Control-Allow-Origin': '*'}


# now, to call, query <localhost link>/run
api.add_resource(GenerateDefault, '/run')
api.add_resource(GenerateCustom, '/run/<string:tilex>/<string:tiley>/<string:zoom>/<string:lat>/<string:long>')
api.add_resource(GetApiKey, '/getApiKey')
api.add_resource(GetWeatherApiKey, '/getWeatherApiKey')
api.add_resource(GetAnalysisResult, '/getAnalysisResult')
api.add_resource(GetLastPosition, '/getLastPosition')
api.add_resource(GetImage, '/getImage/<string:lat>/<string:long>/<string:zoom>')


# driver function
if __name__ == '__main__':

    app.run(debug=True)
