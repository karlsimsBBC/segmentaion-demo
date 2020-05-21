import os

import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import cv2

from ipywidgets import interact

def show_images(image_groups, titles=[]):

    cols_n = len(image_groups)
    rows_n = len(image_groups[0])


    @interact
    def _show_images(x=(0,  rows_n-1)):

        fig, axs = plt.subplots(nrows=1, ncols=cols_n, figsize=(10,4))
        for i, img in enumerate(image_groups):
            ax = axs[i]
            try:
                ax.imshow(cv2.cvtColor(img[x,:,:,:], cv2.COLOR_BGRA2RGBA))
            except:
                ax.imshow(img[x,:,:,0], cmap='gray')
            if titles:
                ax.set_title(titles[i])
            ax.axis('off')

        plt.tight_layout()
        plt.show()


def validated_image(path):
    try:
        img = cv2.imread(path, cv2.IMREAD_UNCHANGED)
        thresh_min, thresh_max = 1, 254
        assert isinstance(img, np.ndarray), 'img must be an numpy array'
        assert img.shape in  {(800, 600, 3), (800, 600, 4)}, 'incorect shape %s' % str(img.shape)
        # check images aren't all black or white
        assert thresh_max > img.mean() > thresh_min, 'invalid pixel average. %f' % img.mean()
    except AssertionError as e:
        print('invalid:', path, e)
        return False
    return True


def iter_file_paths(rootdir, ext, n=10000):
    i = 0
    for (root, subdirs, files) in os.walk(rootdir):
        for filename in files:
            if i > n:
                return
            if not filename.endswith(ext):
                continue
            img_id, ext = filename.split('.')
            yield img_id, os.path.join(root, filename)
            i += 1


# ---------------------------------------------------------------------
# tests


def tests():
    test_lookup_img()
    print('all tests pass')


def test_lookup_img():
    args = ('1803151818-00009992', 'clip')
    expected = 'clip/1803151818/clip_00000009/1803151818-00009992.jpg'
    actual = lookup_img(*args)
    assert actual == expected, 'clip path test failed. want=%s got=%s' % (expected, actual)

    args = ('1803151818-00009992', 'matting')
    expected = 'matting/1803151818/matting_00000009/1803151818-00009992.png'
    actual = lookup_img(*args)
    assert actual == expected, 'matting path test failed. want=%s got=%s' % (expected, actual)


if __name__ == '__main__':
    tests()