from typing import Optional, Dict, Any, Tuple

import webcolors
import pickle
import sys
from color_util import get_colour_name
sys.path.append('../')
from libs.inference_keras import run_inference_on_one
# from libs import training_keras
# from libs import datasets
from libs import models_keras
# from libs import inference_keras
# from libs import scoring
import os

import tensorflow as tf
gpus = tf.config.experimental.list_physical_devices('GPU')
if gpus:
    try:
        # Restrict TensorFlow to only use the fourth GPU
        tf.config.experimental.set_visible_devices(gpus[0], 'GPU')

        # Currently, memory growth needs to be the same across GPUs
        for gpu in gpus:
            tf.config.experimental.set_memory_growth(gpu, True)
        logical_gpus = tf.config.experimental.list_logical_devices('GPU')
        print(len(gpus), "Physical GPUs,", len(logical_gpus), "Logical GPUs")
    except RuntimeError as e:
        # Memory growth must be set before GPUs have been initialized
        print(e)

# import wandb
from PIL import Image
import numpy as np
from collections import Counter

config = {
    'name':'baseline-keras',

}

# wandb.init(config=config)

model = models_keras.build_unet(encoder='resnet18')

# use the train model to run inference on all test scenes
"""
Original_image_path, 
"""

image_url = 'https://www.demilked.com/magazine/wp-content/uploads/2015/12/best-drone-pictures-2015-dronestagram-1.jpg'


color_rgb_dict = {
    'Building': (230, 25, 75),
    'Clutter': (145, 30, 180),
    'Vegetation': (60, 180, 75),
    'Water': (245, 130, 48),
    'Ground': (255, 255, 255),
    'Car': (0, 130, 200),
    'Ignore':(255, 000, 255)
}


color_rgb_dict_inverse = {v: k for k, v in color_rgb_dict.items()}

color_name_dict = {}


for key in color_rgb_dict.keys():
    value = color_rgb_dict[key]
    color_possible_names = get_colour_name(value)
    # print(color_possible_names)
    color_name_dict[key] = color_possible_names[1] if color_possible_names[0] is None else color_possible_names[0]

print(color_name_dict)


class ImageScatter(object):
    def __init__(self, model_path):
        self.model_path = model_path
        self.model = models_keras.build_unet(encoder='vgg19')
    """
    inference
    """
    # model.save()
    #
    # model = models.load_model(model_path, custom_objects={"tf": tf})

    # use the trained model to run inference on an image

    def download(self, image_url, image_path):
        from PIL import Image
        import requests
        img = Image.open(requests.get(image_url, stream=True).raw)
        img.save(image_path)

    def convert(self, image_path, save_path):
        run_inference_on_one(image_path, model=self.model, model_path=self.model_path, basedir=save_path)

    def get_colors_dict(self, image_path):

        photo = Image.open(image_path)  # your image
        photo = photo.convert('RGB')

        pix_val = list(photo.getdata())

        a = Counter(pix_val).most_common()
        print(a)


        colors_dict: Dict[Optional[Any], Tuple[Any, int]] = {}
        for i in a:
            pos_col_name = get_colour_name(i[0])
            colour_name = pos_col_name[1] if pos_col_name[0] is None else pos_col_name[0]
            colors_dict[colour_name] = i[1]

        b = sum(colors_dict.values())
        colors_dict_pct_values = [k / b for k in colors_dict.values()]
        colors_ordered_list = colors_dict.keys()

        colors_name_inv = {v: k for k, v in color_name_dict.items()}
        colors_name_ordered_list = [colors_name_inv[i] for i in colors_dict.keys()]
        colors_dict_pct = dict(zip(colors_name_ordered_list, colors_dict_pct_values))
        print(colors_dict_pct)

        return colors_dict_pct

model_path = None
image_path = '/home/rohan/Desktop/Web_files/mapsExploration/3D_render/backend/dd_ml_segmentation_benchmark/satellite.jpeg'
save_path = "./"
imgSct = ImageScatter(model_path)
imgSct.download(image_url, image_path)
imgSct.convert(image_path, save_path)
colors_dict_pct = imgSct.get_colors_dict(os.path.join(save_path, image_path.split('/')[-1].split('.')[0] + '.png'))
print(colors_dict_pct)






