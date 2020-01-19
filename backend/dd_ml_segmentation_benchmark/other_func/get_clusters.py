from sklearn.cluster import KMeans
import matplotlib.pyplot as plt
import numpy as np
import cv2
from collections import Counter
from skimage.color import rgb2lab, deltaE_cie76
import os
from color_util import get_colour_name

from collections import OrderedDict


# image = cv2.imread('../satellite.jpeg')
# # print("The type of this input is {}".format(type(image)))
# # print("Shape: {}".format(image.shape))
# plt.imshow(image)
#
# image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
# plt.imshow(image)


def RGB2HEX(color):
    return "#{:02x}{:02x}{:02x}".format(int(color[0]), int(color[1]), int(color[2]))


def get_image(image_path):
    image = cv2.imread(image_path)
    image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
    return image


def get_colors(image, number_of_colors, show_chart):
    modified_image = cv2.resize(image, (600, 400), interpolation=cv2.INTER_AREA)
    modified_image = modified_image.reshape(modified_image.shape[0] * modified_image.shape[1], 3)

    clf = KMeans(n_clusters=number_of_colors)
    labels = clf.fit_predict(modified_image)

    counts = Counter(labels)
    print(counts)

    counts = OrderedDict(sorted(counts.items()))
    print(counts)

    center_colors = clf.cluster_centers_

    ordered_colors = [center_colors[i] for i in counts.keys()]
    color_name = [get_colour_name(i)[1] if get_colour_name(i)[0] is None else get_colour_name(i)[0] for i in ordered_colors]
    hex_colors = [RGB2HEX(ordered_colors[i]) for i in counts.keys()]
    rgb_colors = [ordered_colors[i] for i in counts.keys()]

    if (show_chart):
        plt.figure(figsize=(8, 6))
        plt.pie(counts.values(), labels=color_name, colors=hex_colors, autopct='%.0f%%',
                textprops={'size': 'smaller'})
        plt.savefig('1.png')
    print(counts.values())
    print(hex_colors)
    return rgb_colors

# get_colors(get_image(image_path), 3, True)

