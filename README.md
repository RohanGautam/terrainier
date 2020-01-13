# Command to bundle:
`browserify index.js -p esmify > bundle.js`

# Vectiler command to generate testing terrain:
`./vectiler.out --tilex 23447/23448 --tiley 15191/15192 --tilez 15 --terrain 1 --buildings 1 --terrainExtrusionScale 1.5 --buildingsExtrusionScale 1.9`

## Learning and stuff
* Learnt after a while that the API key should in fact be got from the server side [Implemented via an API call], and not the client side, with me trying to load it from a `.env` file earlier

> Make sure you have/create an `auth.json` in the `backend/` folder with your Maps API key present
>```json
>{
>    "MAPS_KEY": <your-key>
>}
>```
# Links
* [Scaling model](https://stackoverflow.com/questions/24723471/three-js-scale-model-with-scale-set-or-increase-model-size)
* [three.js demo fiddle](http://jsfiddle.net/g2evz0q5/)
* [OBJ and MTL loader](https://github.com/mrdoob/three.js/blob/master/examples/webgl_loader_obj_mtl.html)
* [Learning resources](https://threejs.org/docs/#manual/en/introduction/Useful-links)
* [Orbit controls](https://threejs.org/examples/#misc_controls_orbit)
* [Orbit controls in docs](https://threejs.org/docs/#examples/en/controls/OrbitControls)
* [Provide custom canvas to renderer](https://stackoverflow.com/a/21646450)
* [Align html to center](https://stackoverflow.com/questions/6464592/how-to-align-entire-html-body-to-the-center)
* [Configuring a point light in three.js](https://stackoverflow.com/questions/46231675/how-to-configure-a-point-light-in-three-js)
* [Flask-restful](https://flask-restful.readthedocs.io/en/0.3.6/quickstart.html)
* [Flask-restful tutorial](https://www.geeksforgeeks.org/python-build-a-rest-api-using-flask/)
* [Calling an API with Javascript's 'fetch'](https://stackoverflow.com/a/51854096)
* [Get map tile input from Maps](https://developers-dot-devsite-v2-prod.appspot.com/maps/documentation/javascript/examples/map-coordinates)
* [LatLong from tile coordinates](https://stackoverflow.com/questions/23457916/how-to-get-latitude-and-longitude-bounds-from-google-maps-x-y-and-zoom-parameter)
* [Adding script tag in JS](https://stackoverflow.com/questions/39680410/including-a-script-src-into-js-file)