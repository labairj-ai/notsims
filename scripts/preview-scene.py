"""Offline geometry QA; not a substitute for browser visual testing."""
import bpy
from mathutils import Vector
bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.ops.import_scene.gltf(filepath='/tmp/notsims-art/notsims-scene.glb')
scene=bpy.context.scene
bpy.ops.object.camera_add(location=(32, -20, 29))
camera=bpy.context.object
# Three.js +Z becomes Blender -Y on glTF import.
camera.rotation_euler=(Vector((8.5,-8.5,0))-camera.location).to_track_quat('-Z','Y').to_euler()
camera.data.type='ORTHO';camera.data.ortho_scale=28;scene.camera=camera
bpy.ops.object.light_add(type='AREA',location=(-8,-13,24));light=bpy.context.object;light.data.energy=3500;light.data.size=12;light.rotation_euler=(Vector((9,-9,0))-light.location).to_track_quat('-Z','Y').to_euler()
scene.world=bpy.data.worlds.new('World');scene.world.use_nodes=True;scene.world.node_tree.nodes['Background'].inputs[0].default_value=(.65,.72,.53,1);scene.world.node_tree.nodes['Background'].inputs[1].default_value=.8
scene.render.engine='CYCLES';scene.cycles.samples=16;scene.cycles.use_denoising=True
scene.render.resolution_x=1000;scene.render.resolution_y=850;scene.render.resolution_percentage=100
scene.render.filepath='/tmp/notsims-art/output/qa-scene.png';bpy.ops.render.render(write_still=True)
