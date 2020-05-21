
old version - http://karl-cooper.co.uk/karlsims/hyperworldtour/

# frontend
* first iteration use greenscreen
* setup a webcam set
    - https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Manipulating_video_using_canvas
    - you use camera and canvas api to do so.

* work out means of getting google maps images
    - places api - https://developers.google.com/maps/documentation/streetview/intro
    - maybe free?
    - maybe download a batch of places so we encur a fixed cost
        - https://developers.google.com/maps/documentation/streetview/intro
        - https://developers.google.com/maps/documentation/streetview/metadata
        - https://developers.google.com/places/web-service/photos
        - https://developers.google.com/maps/documentation/streetview/get-api-key
    - need reverse geo somehow
        - metadata api

maybe lookup geolocations of famous landmarks

## Locations
* record where users take photos for personalisation
* save just the lat long locations



# HYPER WORLD TOUR V2

## Action Plan

1. [/] download AI segmentation from kaggle
2. [x] inspect dataset
    - filter out invalid images
    - index files
    - visualise the dataset

* https://blog.tensorflow.org/2019/11/updated-bodypix-2.html

## Premade
* https://pytorch.org/hub/pytorch_vision_deeplabv3_resnet101/
* https://medium.com/ibm-garage/semantic-segmentation-and-alpha-blending-for-whitening-customizing-the-background-of-an-image-a8c65ea0e384
* https://www.learnopencv.com/applications-of-foreground-background-separation-with-semantic-segmentation/

## Examples
* https://www.kaggle.com/vbookshelf/selfie-segmenter-keras-and-u-net — not great results but might give some hints
* [insight_project/Segmentation_Model.ipynb at master · jmlb/insight_project · GitHub](https://github.com/jmlb/insight_project/blob/master/Segmentation_Model.ipynb)
* https://github.com/tensorflow/tfjs-models/tree/master/body-pix


# Backend

<!-- https://www.tensorflow.org/tutorials/images/segmentation -->

* create a model copying this example —> [insight_project/Segmentation_Model.ipynb at master · jmlb/insight_project · GitHub](https://github.com/jmlb/insight_project/blob/master/Segmentation_Model.ipynb)
* integrate ml model into my own app with live webcam, like the same project
* integrate google api stuff with app for map locations.
* let users import co-ordinates not just random ones.
* users can take photos with the webcam
* https://github.com/foamliu/Deep-Image-Matting

## other
* Reproducing Deep Image Matting
* https://github.com/jmlb/insight_project/blob/master/Segmentation_Model.ipynb
* https://towardsdatascience.com/image-segmentation-using-pythons-scikit-image-module-533a61ecc980
* https://www.analyticsvidhya.com/blog/2019/04/introduction-image-segmentation-techniques-python/
* https://www.researchgate.net/publication/300253572_The_Human_Image_Segmentation_Algorithm_Based_on_Face_Detection_and_Biased_Normalized_Cuts

## Dataset
* https://www.kaggle.com/laurentmih/aisegmentcom-matting-human-datasets#1803151818-00000004.png

## implementation links
* https://medium.com/@literallywords/reproducing-deep-image-matting-4c01f956ba0f
* [Background Removal in Real-Time Video Chats using TensorflowJS](https://jmlb.github.io/tensorflowjs/2018/06/24/insight_project/)
* https://towardsdatascience.com/background-matting-the-world-is-your-green-screen-83a3c4f0f635
* [Background Removal in Real-Time Video Chats using TensorflowJS, Part 1](https://medium.com/@jmlbeaujour/real-time-matting-of-webcam-video-on-the-browser-part-1-2c71a330ed08)
* [Foreground detection - Wikipedia](https://en.wikipedia.org/wiki/Foreground_detection)
* [GitHub - jmlb/insight_project: Keep It private! A background segmentation app build with Tensorflow JS](https://github.com/jmlb/insight_project)
* [GitHub - akirasosa/mobile-semantic-segmentation: Real-Time Semantic Segmentation in Mobile device](https://github.com/akirasosa/mobile-semantic-segmentation)
* [insight_project/zoom_premium at master · jmlb/insight_project · GitHub](https://github.com/jmlb/insight_project/tree/master/zoom_premium)
* [insight_project/Segmentation_Model.ipynb at master · jmlb/insight_project · GitHub](https://github.com/jmlb/insight_project/blob/master/Segmentation_Model.ipynb)