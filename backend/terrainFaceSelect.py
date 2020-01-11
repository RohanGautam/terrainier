import subprocess
import shutil
import os


vectiler = '/home/rohan/Desktop/Cpp_files/vectiler/build/vectiler.out'
tilex = '23447/23448'
tiley = '15191/15192'
tilez = '15' #zoom level
misc_settings = '--terrain 1 --buildings 1 --terrainExtrusionScale 1.5 --buildingsExtrusionScale 1.9'.split()

blender = "/home/rohan/Downloads/blender/blender"
blenderScript = "/home/rohan/Desktop/Python_files/terrainFaceSelection/blender_script.py"
# path info for the generated models which we will pas onto blender
source = "../assets/terrain.obj"
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
# 3. Process it with blender
subprocess.run([blender, '--background', '--python', blenderScript, '--', source, exportPath])
