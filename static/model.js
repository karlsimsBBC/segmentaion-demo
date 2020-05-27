class Lambda extends tf.layers.Layer {
  constructor() {
    super({})
  }

  static get className() {
    return 'Lambda';
  }

}

tf.serialization.SerializationMap.register(Lambda);
const maxColorValue = tf.scalar(255);
const one = tf.scalar(1);

const imgCanvas = document.createElement('canvas');
const photoAlbum = document.getElementById('photo-album');

const message = document.getElementById('message');


function takePicture() {
  let photo = document.createElement('img');
  photo.className = 'photo';
  let image = canvas.toDataURL('image/png');
  photo.setAttribute('src', image);
  photo.width = 300;
  photoAlbum.appendChild(photo);
}

// document.getElementById('photo-btn').addEventListener('click', takePicture)



var source;


class UNet {

  constructor() {
    this.inputShape = [128, 128]
    this.maskShape = [128, 128, 1]
  }

  async load(modelPath) {
    this.net = tf.keep(await tf.loadLayersModel(modelPath));
    return this;
  }

  async segment(image) {
    let origShape = [image.shape[0], image.shape[1]];

    // console.log(origShape)
    let inputTensor = image
      .resizeBilinear(this.inputShape) // change the image size here
      .div(maxColorValue)
      .expandDims(); // now have (1, 128, 128, 3) image

    let predictions = await this.net.predict(inputTensor).data();

    let alpha = tf.tensor1d(predictions, 'float32')
      .reshape(this.maskShape)
      .resizeBilinear(origShape);

    let H = image.shape[0],
      W = image.shape[1];

    let padUnitX = 0
    let padUnitY = 0

    let bg = tf.browser.fromPixels(source)
      .resizeBilinear([H + padUnitY, W + padUnitX * 2]);

    // adding padding
    let padxi = tf.zeros([H, padUnitX, 3])
    let padxm = tf.zeros([H, padUnitX, 1])

    let imageP = tf.concat([padxi, image, padxi], 1)
    let alphaP = tf.concat([padxm, alpha, padxm], 1)

    let padyi = tf.zeros([padUnitY, W + padUnitX * 2, 3])
    let padym = tf.zeros([padUnitY, W + padUnitX * 2, 1])

    let imageP2 = tf.concat([padyi, imageP], 0)
    let alphaP2 = tf.concat([padym, alphaP], 0)
      // end of adding padding

    // add background and forground images
    return tf.add(tf.mul(alphaP2, imageP2), tf.mul(one.sub(alphaP2), bg)).toInt()
  }
}

var background;

async function app() {
  const videoElement = document.createElement('video');
  videoElement.width = 800;
  videoElement.height = 480;

  const net = new UNet();
  await net.load('./static/tfjs/model/model.json');

  const cam = await tf.data.webcam(videoElement);
  const canvas = document.getElementById("canvas");

  let ctx = imgCanvas.getContext('2d');
  let im = document.getElementById('bg-img');
  ctx.drawImage(im, 0, 0, canvas.width, canvas.height);
  source = ctx.getImageData(0, 0, canvas.width, canvas.height)

  let recording = true;

  message.textContent = '';


  while (recording) {
    // using engine scope functions to control memory
    // because wrapping tidy around aysnc functions dosen't work
    // and if we don't tidy up massive piles of tensors build up
    // behind the scence.
    tf.engine().startScope(); // memory scope start

    let img = await cam.capture();
    let segmentedImage = await net.segment(img);
    await tf.browser.toPixels(segmentedImage, canvas);

    tf.engine().endScope(); // memory scope end
  }

  cam.stop();
}

app();