import subprocess
from flask import Flask, jsonify, request
from flask_restful import Resource, Api
import terrainFaceSelect
import json

# creating the flask app
app = Flask(__name__)
# creating an API object
api = Api(app)

# making a class for a particular resource
# the get, post methods correspond to get and post requests
# they are automatically mapped by flask_restful.
# other methods include put, delete, etc.
history = []

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
            


# now, to call, query <localhost link>/run
api.add_resource(GenerateDefault, '/run')
api.add_resource(GenerateCustom, '/run/<string:tilex>/<string:tiley>/<string:zoom>/<string:lat>/<string:long>')
api.add_resource(GetApiKey, '/getApiKey')
api.add_resource(GetAnalysisResult, '/getAnalysisResult')
api.add_resource(GetLastPosition, '/getLastPosition')



# driver function
if __name__ == '__main__':

    app.run(debug=True)
