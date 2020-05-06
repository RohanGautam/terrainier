import bpy
import sys

argv = sys.argv
argv = argv[argv.index("--") + 1:]  # get all args after "--"
filepath, exportpath = argv[:2]

def clear():
    bpy.ops.object.select_all(action='SELECT')
    bpy.ops.object.delete(use_global=False, confirm=False)

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

clear()

bpy.ops.import_scene.obj(filepath=filepath)
# process it
preprocessObj()

## export
bpy.ops.export_scene.obj(filepath=exportpath)
