import subprocess
import shutil
import os
import time
import json

paths = json.load(open('paths.json'))
vectiler = paths['vectiler'] #'/home/rohan/Desktop/Cpp_files/vectiler/build/vectiler.out'
tilex_default = '23447/23448'
tiley_default = '15191/15192'
tilez_default = '15' #zoom level
misc_settings = '--terrain 1 --buildings 1 --terrainExtrusionScale 1.5 --buildingsExtrusionScale 1.9'.split()

blender = paths['blender'] #"/home/rohan/Downloads/blender/blender"
blender_analyze_faces = "blender_analyze_faces.py"
blender_correct_orientation = "blender_correct_orientation.py"
# path info for the generated models which we will pass onto blender
source = "../assets/terrain.obj"
source_corrected = "../assets/terrain-1.obj"
exportPath = "../assets/terrain-2.obj"

def removeFolderContents(folderPath):
    for root, dirs, files in os.walk(folderPath):
        for f in files:
            os.unlink(os.path.join(root, f))
        for d in dirs:
            shutil.rmtree(os.path.join(root, d))

def moveGeneratedFile(tilex, tiley, tilez):
    if os.path.isdir('../assets')==False:
        os.mkdir('../assets')
    else:
        # if it exists, clear folder contents
        removeFolderContents('../assets')
    fileToMove = '.'.join([tilex.split('/')[0], tiley.split('/')[0], tilez])+'.obj'
    print(f"Moving and renaming {fileToMove}")
    shutil.move(fileToMove, '../assets/terrain.obj')

def initiateProcedure(tilex=tilex_default, tiley = tiley_default, tilez = tilez_default):
    # 1. Generate and download tile specified by given tile coordinates
    subprocess.run([vectiler, '--tilex',tilex,'--tiley',tiley,'--tilez',tilez, *misc_settings])
    # 2. Move it to the `./assets` folder
    moveGeneratedFile(tilex, tiley, tilez)
    # 3. correct orientation, so web app can display it first
    subprocess.run([blender, '--background', '--python', blender_correct_orientation, '--', source, source_corrected])
    time.sleep(5) # add a small delay
    # 4. Process it with blender
    subprocess.run([blender, '--background', '--python', blender_analyze_faces, '--', source, exportPath])
