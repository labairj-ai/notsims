"""Generate Notsims' CC0 MPFB character. Run with Blender 4.5+ --background.

MPFB_SOURCE points to an MPFB source checkout; MPFB_ASSETS to the unzipped CC0
system pack; CHARACTER_OUT to the output directory. See assets/README.md.
"""
import os
import sys
from pathlib import Path
import bpy
import math
import numpy as np
from mathutils import Quaternion, Vector

source = Path(os.environ.get('MPFB_SOURCE', '/tmp/notsims-art/mpfb2/src'))
assets = Path(os.environ.get('MPFB_ASSETS', '/tmp/notsims-art/assets'))
out = Path(os.environ.get('CHARACTER_OUT', '/tmp/notsims-art/output'))
out.mkdir(parents=True, exist_ok=True)
sys.path.insert(0, str(source))
# Source checkouts are not installed Blender extensions. Supply a scratch data
# directory for the CLI process only; this does not alter the installed MPFB.
original_extension_path = bpy.utils.extension_path_user
def extension_path(package, *args, **kwargs):
    if package == 'mpfb':
        p = out / 'mpfb-user'
        p.mkdir(parents=True, exist_ok=True)
        return str(p)
    return original_extension_path(package, *args, **kwargs)
bpy.utils.extension_path_user = extension_path
import mpfb
mpfb.bl_info = mpfb.fake_bl_info
bpy.ops.preferences.addon_enable(module='mpfb')
from mpfb.services.humanservice import HumanService
from mpfb.services.targetservice import TargetService
from mpfb.entities.objectproperties import HumanObjectProperties

bpy.ops.object.select_all(action='SELECT')
bpy.ops.object.delete(use_global=False)
body = HumanService.create_human()
body.name = 'Notsims_Body'
HumanObjectProperties.set_value('gender', .65, entity_reference=body)
TargetService.reapply_macro_details(body)
rig = HumanService.add_builtin_rig(body, 'game_engine')
rig.name = 'Notsims_Humanoid'

def simple_material(name, color, image_path=None, alpha=False):
    mat=bpy.data.materials.new(name)
    mat.use_nodes=True
    bsdf=mat.node_tree.nodes.get('Principled BSDF')
    bsdf.inputs['Base Color'].default_value=(*color,1)
    bsdf.inputs['Roughness'].default_value=.8
    if image_path:
        image=bpy.data.images.load(str(image_path), check_existing=True)
        if max(image.size)>1024:
            ratio=1024/max(image.size)
            image.scale(int(image.size[0]*ratio),int(image.size[1]*ratio))
        texture=mat.node_tree.nodes.new('ShaderNodeTexImage')
        texture.image=image
        mat.node_tree.links.new(texture.outputs['Color'],bsdf.inputs['Base Color'])
        if alpha:
            mat.node_tree.links.new(texture.outputs['Alpha'],bsdf.inputs['Alpha'])
            mat.surface_render_method='DITHERED'
    return mat

def asset(subdir, name, label, kind='Clothes'):
    path=assets/subdir/name/(name+'.mhclo')
    obj=HumanService.add_mhclo_asset(str(path),body,asset_type=kind,subdiv_levels=0)
    obj.name=label
    return obj

skin_path=assets/'skins/young_caucasian_male/young_lightskinned_male_diffuse.png'
skin_image=bpy.data.images.load(str(skin_path))
skin_image.scale(1024,1024)
pixels=np.array(skin_image.pixels[:],dtype=np.float32).reshape(-1,4)
gray=np.clip(pixels[:,:3].mean(axis=1)*1.6,0,1)
pixels[:,:3]=gray[:,None]
skin_image.pixels.foreach_set(pixels.ravel())
skin_image.filepath_raw=str(out/'skin-neutral.png')
skin_image.file_format='PNG'
skin_image.save()
skin=simple_material('Notsims_Skin',(1,1,1),out/'skin-neutral.png')
body.data.materials.clear();body.data.materials.append(skin)

eyes=asset('eyes','low-poly','Notsims_Eyes','Eyes')
# Use the system eye UVs and CC0 iris texture rather than guessing which faces
# form the iris. Custom Blender shaders are replaced with glTF-compatible PBR.
eye_mat=simple_material('Notsims_Eyes',(1,1,1),assets/'eyes/materials/brown_eye.png')
eyes.data.materials.clear();eyes.data.materials.append(eye_mat)
for poly in eyes.data.polygons:poly.material_index=0

outfit=asset('clothes','male_casualsuit01','Notsims_Outfit')
shirt=simple_material('Notsims_Shirt',(.72,.38,.25))
trousers=simple_material('Notsims_Trousers',(.12,.19,.17))
outfit.data.materials.clear();outfit.data.materials.append(shirt);outfit.data.materials.append(trousers)
for poly in outfit.data.polygons:
    avg=sum(outfit.data.vertices[i].co.z for i in poly.vertices)/len(poly.vertices)
    poly.material_index=0 if avg>.88 else 1
shoes=asset('clothes','shoes01','Notsims_Shoes')
shoes.data.materials.clear();shoes.data.materials.append(simple_material('Notsims_Shoes',(.85,.82,.73)))

for style,name in [('short','short01'),('long','long01'),('curly','afro01')]:
    hair=asset('hair',name,'Notsims_Hair_'+style,'Hair')
    mhmat=assets/'hair'/name/(name+'.mhmat')
    diffuse=None
    for line in mhmat.read_text().splitlines():
        if line.startswith('diffuseTexture '):
            diffuse=mhmat.parent/line.split(maxsplit=1)[1].strip()
    hair.data.materials.clear()
    hair.data.materials.append(simple_material('Notsims_Hair_'+style,(.18,.11,.07),diffuse,alpha=True))

for obj in [o for o in bpy.context.scene.objects if o.type=='MESH']:
    bpy.ops.object.select_all(action='DESELECT');obj.select_set(True);bpy.context.view_layer.objects.active=obj
    if obj.data.shape_keys:
        bpy.ops.object.shape_key_remove(all=True,apply_mix=True)
    for mod in list(obj.modifiers):
        if mod.type=='ARMATURE':continue
        if mod.type=='SUBSURF':obj.modifiers.remove(mod)
        else:bpy.ops.object.modifier_apply(modifier=mod.name)
    for poly in obj.data.polygons:poly.use_smooth=True

identity=Quaternion()
def turn(axis,angle):return Quaternion(Vector(axis),angle)
def pose(mode,phase=0):
    desired={}
    for side,sign in [('l',1),('r',-1)]:
        arm=rig.pose.bones['upperarm_'+side]
        fore=rig.pose.bones['lowerarm_'+side]
        arm_vector=Vector((sign*.045,0,-1))
        fore_vector=Vector((sign*.02,-.08,-1))
        if mode=='Walk':
            swing=math.sin(phase)*.48*sign
            arm_vector=turn((1,0,0),-swing*.65)@arm_vector
            fore_vector=turn((1,0,0),-swing*.5)@fore_vector
        if mode=='Eat' and side=='r':
            arm_vector=Vector((-.3,-.55,-.75))
            fore_vector=Vector((.1,-.4,.9))
        for b,vec in [(arm,arm_vector),(fore,fore_vector)]:
            rest=b.bone.tail_local-b.bone.head_local
            desired[b.name]=rest.normalized().rotation_difference(vec.normalized())
        for name in ['thigh_'+side,'calf_'+side]:
            b=rig.pose.bones[name]
            rest=b.bone.tail_local-b.bone.head_local
            if mode=='Sit':target=Vector((sign*.025,-1,0)) if name.startswith('thigh') else Vector((0,0,-1))
            elif mode=='Walk':
                swing=math.sin(phase)*.48*sign
                bend=max(0,-math.cos(phase+(0 if side=='l' else math.pi)))*.7
                target=turn((1,0,0),swing+(bend if name.startswith('calf') else 0))@rest
            else:target=rest
            desired[name]=rest.normalized().rotation_difference(target.normalized())
    if mode in ['Idle','Eat']:
        desired['spine_03']=turn((1,0,0),math.sin(phase)*.012)
    # Turn desired armature-space orientations into local pose quaternions.
    applied={}
    for b in rig.pose.bones:
        parent_delta=applied.get(b.parent.name,identity) if b.parent else identity
        delta=desired.get(b.name,parent_delta)
        rest=b.bone.matrix_local.to_quaternion()
        b.rotation_mode='QUATERNION'
        b.rotation_quaternion=rest.inverted()@parent_delta.inverted()@delta@rest
        b.location=(0,0,0)
        applied[b.name]=delta

rig.animation_data_create()
clips=[('Idle',3,48),('Walk',1,24),('Sit',3,48),('Eat',2,36),('Sleep',3,48)]
for name,duration,count in clips:
    action=bpy.data.actions.new(name)
    rig.animation_data.action=action
    for i in range(count+1):
        frame=1+duration*24*i/count
        pose(name,2*math.pi*i/count)
        for bone in rig.pose.bones:
            bone.keyframe_insert('rotation_quaternion',frame=frame,group=bone.name)
    track=rig.animation_data.nla_tracks.new();track.name=name
    track.strips.new(name,1,action)
    track.mute=True
rig.animation_data.action=None
pose('Idle')
bpy.context.scene.render.fps=24
bpy.context.scene.frame_set(1)
bpy.ops.wm.save_as_mainfile(filepath=str(out / 'character-source.blend'))
bpy.ops.export_scene.gltf(filepath=str(out/'notsims-human.glb'),export_format='GLB',
    export_animations=True,export_animation_mode='ACTIONS',export_force_sampling=True,
    export_skins=True,export_morph=False,export_yup=True,export_apply=False)
print('EXPORTED',out/'notsims-human.glb',flush=True)
