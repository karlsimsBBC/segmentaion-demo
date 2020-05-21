import os
import cv2

from utils import iter_file_paths
from utils import extensions

scaling_factor = 0.5

inroot = 'data'
outroot = 'dataset'

for group in ('matting', 'clip'):
    root = os.path.join(inroot, group)
    for i, (_, f) in enumerate(iter_file_paths(root, extensions[group], n=1_000_000)):

        out = f.replace(inroot, outroot)
        if os.path.isfile(out):
            continue

        directory = os.path.dirname(out)
        if not os.path.exists(directory):
            os.makedirs(directory)

        img = cv2.imread(f, cv2.IMREAD_UNCHANGED)
        new_img  = cv2.resize(img, None, fx=scaling_factor,
                                         fy=scaling_factor,
                                         interpolation=cv2.INTER_AREA)
        cv2.imwrite(out, new_img)

        if i % 100 == 0:
            print(i, out)

