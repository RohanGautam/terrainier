# from libs import training_keras
from libs import datasets
# from libs import models_keras
from libs import inference_keras
from PIL import Image
import numpy as np
import math
from keras import models
import tensorflow as tf
import os
import wandb

from libs import training_keras
from libs import datasets
from libs import models_keras
from libs import inference_keras
from libs import scoring


image_path = "/4TB/simeng/hacknroll-seg/dataset-sample/images/ec09336a6f_06BA0AF311OPENPIPELINE-ortho.tif"
model_path = "/4TB/simeng/hacknroll-seg/wandb/run-20200118_034010-5ed8ms7k/model-best.h5"
base_dir = '/4TB/simeng/hacknroll-seg/wandb/inference'
if __name__ == '__main__':
    dataset = 'dataset-sample'  #  0.5 GB download
    #dataset = 'dataset-medium' # 9.0 GB download

    config = {
        'name' : 'baseline-keras',
        'dataset' : dataset,
    }

    wandb.init(config=config)

    datasets.download_dataset(dataset)
    #
    # """
    # Training
    # """
    model = models_keras.build_unet(encoder='vgg19')
    # training_keras.train_model(dataset, model)

    """
    inference
    """
    # model.save()
    #
    # model = models.load_model(model_path, custom_objects={"tf": tf})

    # use the trained model to run inference on an image
    inference_keras.run_inference_on_one(image_path=image_path, model=model, model_path=None, basedir=base_dir)

    # inference_keras.run_inference(dataset, model=model, model_path=model_path, basedir='/4TB/simeng/hacknroll-seg/wandb/inference')

    # scores all the test images compared to the ground truth labels then
    # send the scores (f1, precision, recall) and prediction images to wandb
    # score, _ = scoring.score_predictions(dataset, basedir=wandb.run.dir)
    # print(score)
    # wandb.log(score)
