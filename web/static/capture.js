(function() {
  // The width and height of the captured photo. We will set the
  // width to the value defined here, but the height will be
  // calculated based on the aspect ratio of the input stream.

  var width = 700; // We will scale the photo width to this
  var height = 0; // This will be computed based on the input stream

  // |streaming| indicates whether or not we're currently streaming
  // video from the camera. Obviously, we start at false.

  var streaming = false;

  // The various HTML elements we need to configure or control. These
  // will be set by the startup() function.

  var video = null;
  var canvas = null;
  var sourceCanvas = null;
  var photo = null
  var source = null;
  var startbutton = null;

  const image = new Image(); // Using optional size for image

  // Load an image of intrinsic size 300x227 in CSS pixels
  image.src = './static/streetview.jpeg';
  image.onload = () => {
    let context = sourceCanvas.getContext('2d');
    context.drawImage(this, 0, 0);
    source = context.getImageData(0, 0)
  };

  function startup() {
    video = document.getElementById('video');
    canvas = document.getElementById('canvas');
    sourceCanvas = document.getElementById('source-canvas');
    photo = document.getElementById('photo');
    startbutton = document.getElementById('startbutton');

    navigator.mediaDevices.getUserMedia({ video: true, audio: false })
      .then(function(stream) {
        video.srcObject = stream;
        video.play();
        timerCallback()
      })
      .catch(function(err) {
        console.log("An error occurred: " + err);
      });

    video.addEventListener('canplay', function(ev) {
      if (!streaming) {
        height = video.videoHeight / (video.videoWidth / width);

        if (isNaN(height)) {
          height = width / (7 / 5);
        }

        video.setAttribute('width', width);
        video.setAttribute('height', height);
        canvas.setAttribute('width', width);
        canvas.setAttribute('height', height);
        sourceCanvas.setAttribute('width', width);
        sourceCanvas.setAttribute('height', height);

        if (image) {
          let srcCtx = sourceCanvas.getContext('2d')
          srcCtx.drawImage(image, 0, 0, width, height);
          source = srcCtx.getImageData(0, 0, width, height)
        }

        streaming = true;
      }
    }, false);

    startbutton.addEventListener('click', function(ev) {
      takepicture();
      ev.preventDefault();
    }, false);

    clearphoto();
  }

  // Fill the photo with an indication that none has been
  // captured.

  function clearphoto() {
    var context = canvas.getContext('2d');
    context.fillStyle = "#AAA";
    context.fillRect(0, 0, canvas.width, canvas.height);

    var data = canvas.toDataURL('image/png');
    photo.setAttribute('src', data);
  }

  // Capture a photo by fetching the current contents of the video
  // and drawing it into a canvas, then converting that to a PNG
  // format data URL. By drawing it on an offscreen canvas and then
  // drawing that to the screen, we can change its size and/or apply
  // other changes before drawing it.

  function takepicture() {
    photo.setAttribute('src', canvas.toDataURL('image/png'));
  }

  function timerCallback() {
    if (video.paused || video.ended) {
      return;
    }
    computeFrame();
    setTimeout(function() {
      timerCallback();
    }, 0);
  }


  function computeFrame() {
    let context = canvas.getContext('2d');
    if (width && height) {
      canvas.width = width;
      canvas.height = height;
      context.drawImage(video, 0, 0, width, height);
      let frame = context.getImageData(0, 0, width, height)

      let len = frame.data.length / 4;

      for (let i = 0; i < len; i++) {
        let r = frame.data[i * 4 + 0];
        let g = frame.data[i * 4 + 1];
        let b = frame.data[i * 4 + 2];
        if (g > 100 && r > 100 && b > 100) {
          //   frame.data[i * 4 + 3] = 0;
          frame.data[i * 4 + 0] = source.data[i * 4 + 0];
          frame.data[i * 4 + 1] = source.data[i * 4 + 1];
          frame.data[i * 4 + 2] = source.data[i * 4 + 2];
        }
      }
      context.putImageData(frame, 0, 0);
    }
  }

  // Set up our event listener to run the startup process
  // once loading is complete.
  window.addEventListener('load', startup, false);
})();