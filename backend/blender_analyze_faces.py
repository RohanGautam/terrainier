import bpy
import bmesh
from random import randint
import time
import pprint 
import json
import sys
from mathutils import Vector

# Python call example > subprocess.run([blenderPath, '--background', '--python', blenderScript, '--', fileToProcess, exportPath])
argv = sys.argv
argv = argv[argv.index("--") + 1:]  # get all args after "--"
filepath, exportpath = argv[:2]


def clear():
    bpy.ops.object.select_all(action='SELECT')
    bpy.ops.object.delete(use_global=False, confirm=False)

def generate_cubes(n):
    for _ in range(n):
        bpy.ops.mesh.primitive_cube_add(location = [randint(-20,20) for axes in 'xyz'])

def position_obj():
    bpy.ops.object.origin_set(type='GEOMETRY_ORIGIN', center='MEDIAN')
    bpy.ops.transform.rotate(value=1575.51, orient_axis='X', orient_type='GLOBAL', orient_matrix=((1, 0, 0), (0, 1, 0), (0, 0, 1)), orient_matrix_type='GLOBAL', constraint_axis=(True, False, False), mirror=True, use_proportional_edit=False, proportional_edit_falloff='SMOOTH', proportional_size=1, use_proportional_connected=False, use_proportional_projected=False)

def preprocessObj(imported = True):
    objects = []
    if imported:
        objects = [o for o in bpy.data.objects if '.obj' in o.name]
    if objects != []:
         # take the first one
        obj = objects[0]
        # make it active
        bpy.context.view_layer.objects.active = obj
        # position it at the origin, with correct rotation
        position_obj()
        # go to edit mode and deselect it
        bpy.ops.object.mode_set(mode = 'EDIT')
        bpy.ops.mesh.select_all(action = 'DESELECT')
     



def select_top(color = (1,0,0,0)):
    ''' 
    This function needs deselected object(s) in edit mode to begin.
    It colors all flat surfaces the specified color.
    '''
    for i, obj in enumerate(bpy.context.editable_objects):
        me = obj.data
        bm = bmesh.from_edit_mesh(me)
        
        # notice in Bmesh polygons are called faces
        try: 
            flatArea = 0
            totalArea = 0
            for face in list(bm.faces):
                totalArea += face.calc_area()
                if face.normal == Vector([0,0,1]):
                    face.select_set(True)
                    flatArea += face.calc_area()
                    # Show the updates in the viewport
                    bmesh.update_edit_mesh(me, True) 
                      
            # The faces of intrest are now selected. Color them:  
            m_base = bpy.data.materials.new('base')
            m_face = bpy.data.materials.new('face')
            m_face.diffuse_color = color #(0.0545892, 0.8, 0.107713, 1) #(0,1,0,0)
            # you need a base material first, and only then can the face material color a single/selected faces. It's a blender quirk.
            me.materials.append(m_base)
            me.materials.append(m_face)
            # "activate" the last material, ie, the face material so that our selected faces are colored
            bpy.context.object.active_material_index = len(me.materials) # the last one
            # assign the last face material to the selected surfaces
            bpy.ops.object.material_slot_assign()
            
            print(f'Area for object {obj}\n\tFlat surfaces : {flatArea}\n\t Total : {totalArea}')            
            data = {
                'FlatSurfaceArea': flatArea,
                'TotalArea': totalArea
            }
            json.dump(data, open('data.json','w'))
            bpy.ops.object.mode_set(mode = 'OBJECT')
        except Exception as e:
            print(f'Error for object {obj}')
            print(e)
            
#generate_cubes(50)
colors = [(1,0,0,0), (0,1,0,0), (0,0,1,0)] # r,g,b
clear()
# import the desired object
#filepath = "/home/rohan/Desktop/Cpp_files/vectiler/build/terrain.obj"
# filepath = "/home/rohan/Desktop/Python_files/terrainFaceSelection/source/terrain.obj"
bpy.ops.import_scene.obj(filepath=filepath)
# process it
preprocessObj()
select_top()

## export
#exportpath = "/home/rohan/Desktop/Cpp_files/vectiler/build/terrain-2.obj"
# exportpath = "/home/rohan/Desktop/Python_files/terrainFaceSelection/processed/terrain-2.obj"
bpy.ops.export_scene.obj(filepath=exportpath)
