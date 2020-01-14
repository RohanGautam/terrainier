# Command to bundle:
`browserify index.js -p esmify > bundle.js`

# Vectiler command to generate testing terrain:
`./vectiler.out --tilex 23447/23448 --tiley 15191/15192 --tilez 15 --terrain 1 --buildings 1 --terrainExtrusionScale 1.5 --buildingsExtrusionScale 1.9`
# Random place in sg
Latitude 1.3342035847226605, Longitude 103.84775028228756

## Learning and stuff
* Learnt after a while that the API key should in fact be got from the server side [Implemented via an API call], and not the client side, with me trying to load it from a `.env` file earlier

> Make sure you have/create an `auth.json` in the `backend/` folder with your Maps API key present
>```json
>{
>    "MAPS_KEY": <your-key>
>}
>```
# Links
### blender
* [Rotation](https://www.blender.org/forum/viewtopic.php?t=19783)
* [Material operation for faces](https://blender.stackexchange.com/questions/65494/set-the-color-of-faces-in-python-efficiently)
* [Adding color to a single face](https://blender.stackexchange.com/questions/23656/adding-color-to-models)
* [Run blender in the background](https://blender.stackexchange.com/questions/1365/how-can-i-run-blender-from-command-line-or-a-python-script-without-opening-a-gui)
* [Select an object via script](https://blender.stackexchange.com/a/154772)
* [Deselect object in edit mode, in script](https://blender.stackexchange.com/a/55996)
* [Import `.obj` via script](https://blender.stackexchange.com/questions/72928/blender-2-78-obj-import-via-script)
* [Export via script](https://blender.stackexchange.com/questions/84934/what-is-the-python-script-to-export-the-selected-meshes-in-obj)
* [Parse command line arguments for a blender script](https://blender.stackexchange.com/questions/6817/how-to-pass-command-line-arguments-to-a-blender-python-script)
### three.js, web and api
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
* [Events for map, markers in Gmaps API](https://developers.google.com/maps/documentation/javascript/events)
* [Using markers](https://developers.google.com/maps/documentation/javascript/markers)
* [Add event listener for a marker](https://stackoverflow.com/a/15775130)
* [LatLong from marker](https://stackoverflow.com/a/11030800)