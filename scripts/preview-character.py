"""Offline visual QA of the exported GLB, independent of the browser renderer."""
import bpy, math, os
from mathutils import Vector
root='/tmp/notsims-art/output'
bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.ops.import_scene.gltf(filepath=root+'/notsims-human.glb')
for obj in bpy.context.scene.objects:
    if obj.name.startswith('Notsims_Hair_') and not obj.name.startswith('Notsims_Hair_short'):
        obj.hide_render=True
rig=next(o for o in bpy.context.scene.objects if o.type=='ARMATURE')
print('QA_ACTIONS',[a.name for a in bpy.data.actions],flush=True)
for track in rig.animation_data.nla_tracks:track.mute=True
for mat in bpy.data.materials:
    if not mat.use_nodes:continue
    bsdf=next((n for n in mat.node_tree.nodes if n.type=='BSDF_PRINCIPLED'),None)
    if not bsdf:continue
    if mat.name=='Notsims_Shirt':bsdf.inputs['Base Color'].default_value=(.65,.27,.15,1)
    if mat.name=='Notsims_Skin':
        link=next((l for l in mat.node_tree.links if l.to_node==bsdf and l.to_socket.name=='Base Color'),None)
        if link:
            multiply=mat.node_tree.nodes.new('ShaderNodeMixRGB');multiply.blend_type='MULTIPLY';multiply.inputs[0].default_value=1
            multiply.inputs[2].default_value=(.65,.39,.23,1)
            mat.node_tree.links.new(link.from_socket,multiply.inputs[1]);mat.node_tree.links.new(multiply.outputs[0],bsdf.inputs['Base Color'])
    if mat.name.startswith('Notsims_Hair_'):
        link=next((l for l in mat.node_tree.links if l.to_node==bsdf and l.to_socket.name=='Base Color'),None)
        if link:
            multiply=mat.node_tree.nodes.new('ShaderNodeMixRGB');multiply.blend_type='MULTIPLY';multiply.inputs[0].default_value=1
            multiply.inputs[2].default_value=(.2,.11,.06,1)
            mat.node_tree.links.new(link.from_socket,multiply.inputs[1]);mat.node_tree.links.new(multiply.outputs[0],bsdf.inputs['Base Color'])
bpy.ops.mesh.primitive_plane_add(size=200)
floor=bpy.context.object
floor_mat=bpy.data.materials.new('Backdrop');floor_mat.diffuse_color=(.63,.70,.49,1);floor.data.materials.append(floor_mat)
bpy.ops.object.camera_add(location=(2.5,-4,2.0))
camera=bpy.context.object;camera.rotation_euler=(Vector((0,0,.9))-camera.location).to_track_quat('-Z','Y').to_euler();camera.data.type='ORTHO';camera.data.ortho_scale=2.25;bpy.context.scene.camera=camera
for location,power,size in [((1,-3,5),500,4),((-3,0,3),350,3)]:
    bpy.ops.object.light_add(type='AREA',location=location);light=bpy.context.object;light.data.energy=power;light.data.shape='DISK';light.data.size=size;light.rotation_euler=(Vector((0,0,1))-light.location).to_track_quat('-Z','Y').to_euler()
scene=bpy.context.scene;scene.render.engine='CYCLES';scene.cycles.samples=16;scene.cycles.use_denoising=True
scene.world=bpy.data.worlds.new('World');scene.world.use_nodes=True;scene.world.node_tree.nodes['Background'].inputs[0].default_value=(.55,.6,.45,1);scene.world.node_tree.nodes['Background'].inputs[1].default_value=.5
scene.render.resolution_x=480;scene.render.resolution_y=560;scene.render.resolution_percentage=100
for name in ['Idle','Walk','Sit']:
    action=next(a for a in bpy.data.actions if a.name==name or a.name.endswith('_'+name))
    rig.animation_data.action=action
    if hasattr(action,'slots') and len(action.slots):rig.animation_data.action_slot=action.slots[0]
    scene.frame_set(7 if name=='Walk' else 1)
    scene.render.filepath=root+'/qa-'+name.lower()+'.png';bpy.ops.render.render(write_still=True)
