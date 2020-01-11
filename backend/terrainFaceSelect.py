import subprocess
import shutil
import os
import time

vectiler = '/home/rohan/Desktop/Cpp_files/vectiler/build/vectiler.out'
tilex = '23447/23448'
tiley = '15191/15192'
tilez = '15' #zoom level
misc_settings = '--terrain 1 --buildings 1 --terrainExtrusionScale 1.5 --buildingsExtrusionScale 1.9'.split()

blender = "/home/rohan/Downloads/blender/blender"
blender_analyze_faces = "blender_analyze_faces.py"
blender_correct_orientation = "blender_correct_orientation.py"
# path info for the generated models which we will pass onto blender
source = "../assets/terrain.obj"
source_corrected = "../assets/terrain-1.obj"
exportPath = "../assets/terrain-2.obj"

def moveGeneratedFile():
    if os.path.isdir('../assets')==False:
        os.mkdir('../assets')
    fileToMove = '.'.join([tilex.split('/')[0], tiley.split('/')[0], tilez])+'.obj'
    print(f"Moving and renaming {fileToMove}")
    shutil.move(fileToMove, '../assets/terrain.obj')

# 1. Generate and download tile specified by given tile coordinates
subprocess.run([vectiler, '--tilex',tilex,'--tiley',tiley,'--tilez',tilez, *misc_settings])
# 2. Move it to the `./assets` folder
moveGeneratedFile()
# 3. correct orientation, so web app can display it first
subprocess.run([blender, '--background', '--python', blender_correct_orientation, '--', source, source_corrected])
time.sleep(2) # add a small delay
# 4. Process it with blender
subprocess.run([blender, '--background', '--python', blender_analyze_faces, '--', source, exportPath])
