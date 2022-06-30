const canvas = document.querySelector('#canvas');
const c = canvas.getContext('2d');

canvas.width = innerWidth;
canvas.height = innerHeight;
// ?? why should this be in the animate function and not here ??
// the default is black but we need to specify it again in the fillstyle because there could be another fillstyle before this and we dont want the bg to be of that color instead of black
c.fillStyle = 'black';
c.fillRect(0, 0, canvas.width, canvas.height);

// ------PLAYER------
class Spaceship {
  constructor() {
    // the position of the spaceship
    this.coordinates = {
      x: 200,
      y: 200,
    };

    // we want the spaceship to move so we need velocity
    this.velocity = {
      x: 0,
      y: 0,
    };

    // we want to insert an image for the visuals of the spaceship and for that we need an image element with its src set
    const image = new Image();
    image.src = './img/spaceship.png';

    image.addEventListener('load', () => {
      this.image = image;
      const scale = 3;
      // it could be squished so we can specify the image's w and h
      this.width = image.width / scale;
      this.height = image.height / scale;
    });
  }

  // drawing spaceship element in the canvas (we want it to be a method so we can call it either from the outside or from the inside)
  draw() {
    // when its actually loaded
    if (this.image) {
      // c.fillRect(this.coordinates.x, this.coordinates.y, this.width, this.height);
      c.drawImage(
        this.image,
        this.coordinates.x,
        this.coordinates.y,
        this.width,
        this.height
      );
    }
  }
}

const spaceship = new Spaceship();

// the process of loading an image takes time and it may not even be loaded when we are trying to draw it so we need to do it in an animation loop so we keep painting the frames until it finally IS
function animate() {
  requestAnimationFrame(animate);
  spaceship.draw();
}
animate();
