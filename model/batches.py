import os

import numpy as np
import pandas as pd
import cv2

# NOTE
# usign the skimage.transform resize seems result in more pixelation
# it might be, mode='constant', preserve_range=True). The cv2 resize
# cv2.resize(mask, (height, width), interpolation=cv2.INTER_AREA)
# gives better results but it when input into our network it gives
# increasingly negative loss function results, (haven't actually)
# debugged the inputs properly but should do if results in smoother
# cut out images.
from skimage.transform import resize


def batch_generator(path, batch_size=10, img_height=128, img_width=128, img_channels=3):
    while True:
        for df in pd.read_csv(path, chunksize=batch_size):
            image_ids = list(df['image_id'])
            # actual_batch_size could be smaller on last round
            actual_batch_size = len(df)
            x_dims = (actual_batch_size, img_height, img_width, img_channels)
            y_dims = (actual_batch_size, img_height, img_width, 1)

            batch_X = load_images(image_ids, x_dims)
            batch_Y = load_image_masks(image_ids, y_dims)

            yield (batch_X, batch_Y)


def test_generator(path, batch_size=10, img_height=128, img_width=128, img_channels=3):
    while True:
        for df in pd.read_csv(path, chunksize=batch_size):
            image_ids = list(df['image_id'])
            # actual_batch_size could be smaller on last round
            actual_batch_size = len(df)
            dims = (actual_batch_size, img_height, img_width, img_channels)
            batch = load_images(image_ids, dims)
            yield batch


def load_image_masks(image_ids, dims, kind='matting'):
    batch_Y = np.zeros(dims, dtype=np.bool)
    (_, height, width, _) = dims
    for i, image_id in enumerate(image_ids):
        path = expand_path(image_id, kind)
        mask = cv2.imread(path, cv2.IMREAD_UNCHANGED)
        # select the alpha channel
        mask = mask[:, :, 3]
        # mask = np.expand_dims(mask, axis=-1)
        # resized = cv2.resize(mask, (height, width), interpolation=cv2.INTER_AREA)
        mask = resize(mask, (height, width), mode='constant', preserve_range=True)
        batch_Y[i] = np.expand_dims(mask, axis=2)
    return batch_Y


def load_images(image_ids, dims, kind='clip'):
    batch_X = np.zeros(dims, dtype=np.uint8)
    (_, height, width, _) = dims
    for i, image_id in enumerate(image_ids):
        path = expand_path(image_id, kind)
        image = cv2.imread(path, cv2.IMREAD_UNCHANGED)
        # resized = cv2.resize(image, (height, width), interpolation=cv2.INTER_AREA)
        image = resize(image, (height, width), mode='constant', preserve_range=True)
        batch_X[i] = image
    return batch_X


def expand_path(img_id, kind):
    folder_id, file_id = img_id.split('-')
    filename = f'{img_id}.{extensions[kind]}'
    subdir_id = f'{kind}_000{file_id[:5]}'
    return os.path.join('dataset', kind, folder_id, subdir_id, filename)


extensions = {'clip': 'jpg', 'matting': 'png'}