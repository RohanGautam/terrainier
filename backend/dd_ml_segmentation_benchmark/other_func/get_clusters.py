from sklearn.cluster import KMeans
import matplotlib.pyplot as plt
import numpy as np
import cv2
from collections import Counter
from skimage.color import rgb2lab, deltaE_cie76
import os
from dd_ml_segmentation_benchmark.other_func.color_util import get_colour_name

from collections import OrderedDict

from PIL import Image
import numpy as np
from collections import Counter
# image = cv2.imread('../satellite.jpeg')
# # print("The type of this input is {}".format(type(image)))
# # print("Shape: {}".format(image.shape))
# plt.imshow(image)
#
# image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
# plt.imshow(image)
original_path = "backend/dd_ml_segmentation_benchmark/original"


def RGB2HEX(color):
    return "#{:02x}{:02x}{:02x}".format(int(color[0]), int(color[1]), int(color[2]))


def get_image(image_path):
    image = cv2.imread(image_path)
    image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
    return image


def get_colors(image, number_of_colors, show_chart):
    modified_image = cv2.resize(
        image, (600, 400), interpolation=cv2.INTER_AREA)
    modified_image = modified_image.reshape(
        modified_image.shape[0] * modified_image.shape[1], 3)

    clf = KMeans(n_clusters=number_of_colors)
    labels = clf.fit_predict(modified_image)

    counts = Counter(labels)
    print(counts)

    counts = OrderedDict(sorted(counts.items()))
    print(counts)

    center_colors = clf.cluster_centers_

    ordered_colors = [center_colors[i] for i in counts.keys()]
    color_name = [get_colour_name(i)[1] if get_colour_name(
        i)[0] is None else get_colour_name(i)[0] for i in ordered_colors]
    hex_colors = [RGB2HEX(ordered_colors[i]) for i in counts.keys()]
    rgb_colors = [ordered_colors[i] for i in counts.keys()]

    if (show_chart):
        plt.figure(figsize=(8, 6))
        plt.pie(counts.values(), labels=color_name, colors=hex_colors, autopct='%.0f%%',
                textprops={'size': 'smaller'})
        plt.savefig('1.png')
    # print(counts.values())
    # print(hex_colors)
    dict_ = dict(zip(color_name, counts.values()))
    return dict_


class ImageScatter(object):
    def __init__(self, model_path):
        self.model_path = model_path
        # self.model = models_keras.build_unet(encoder='vgg19')
    """
    inference
    """
    # model.save()
    #
    # model = models.load_model(model_path, custom_objects={"tf": tf})

    # use the trained model to run inference on an image

    def download(self, image_url, image_path):
        from PIL import Image
        import request
        image_path = os.path.join(original_path, image_url)
        img = Image.open(requests.get(image_url, stream=True).raw)
        img.save(image_path)

    def convert(self, image_path, save_path):
        run_inference_on_one(image_path, model=self.model,
                             model_path=self.model_path, basedir=save_path)

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
        colors_name_ordered_list = [colors_name_inv[i]
                                    for i in colors_dict.keys()]
        colors_dict_pct = dict(
            zip(colors_name_ordered_list, colors_dict_pct_values))
        print(colors_dict_pct)

        return colors_dict_pct
# image_path = '/home/rohan/Desktop/Web_files/mapsExploration/3D_render/backend/dd_ml_segmentation_benchmark/satellite.jpeg'
# print(get_colors(get_image(image_path), 3, True))
