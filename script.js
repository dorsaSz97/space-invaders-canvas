const canvas = document.querySelector('#canvas');
const c = canvas.getContext('2d');

canvas.width = innerWidth;
canvas.height = innerHeight;

// ------PLAYER------
class Spaceship {
  constructor() {
    // we need the spaceship to move so it should have velocity
    this.velocity = {
      x: 0,
      y: 0,
    };

    // image for the visuals of the spaceship
    // drawImage() needs an image element with its src set
    const image = new Image();
    image.src = './img/spaceship.png';

    // loading images take time so get its properties after its loaded
    image.addEventListener('load', () => {
      this.image = image;
      const scale = 3;
      // it could be squished so we can specify the image's w and h
      this.width = image.width / scale;
      this.height = image.height / scale;

      // the position of the spaceship
      this.coordinates = {
        x: canvas.width / 2 - this.width / 2,
        y: canvas.height - (this.height + 30),
      };
    });
  }

  // drawing spaceship element in the canvas (its a method so it can be called either from the outside or from the inside)
  draw() {
    // c.fillRect(this.coordinates.x, this.coordinates.y, this.width, this.height); // TEST
    c.drawImage(
      this.image,
      this.coordinates.x,
      this.coordinates.y,
      this.width,
      this.height
    );
  }

  // changing the coordinates based on the velocity. we want a new method so we can call it when we click or move the mouse, separate from the draw(), which is firing off continuously
  update() {
    // after the image loaded
    if (this.image) {
      this.draw();

      // spaceship's movement W/mouse
      addEventListener('mousemove', ({ x }) => {
        spaceship.coordinates.x = x - spaceship.width / 2;
      });
      this.coordinates.x += this.velocity.x;
    }
  }
}
const spaceship = new Spaceship();
// creating this to check if we wanted to add to the position or not
const controlKeys = {
  a: {
    pressed: false,
  },
  d: {
    pressed: false,
  },
  space: {
    pressed: false,
  },
};

// the process of loading an image takes time and it may not even be loaded when we are trying to draw it so we need to do it in an animation loop to keep painting the frames until it finally IS
function animate() {
  requestAnimationFrame(animate);

  // the default is black but we need to specify it again in the fillstyle because there could be another fillstyle before this and we dont want the bg to be of that color instead of black
  // we want to call this here and not at the beginning because the canvas needs to be cleared before each repaint
  c.fillStyle = 'black';
  c.fillRect(0, 0, canvas.width, canvas.height);
  spaceship.update();

  if (controlKeys.a.pressed) {
    spaceship.velocity.x = -5;
  } else if (controlKeys.d.pressed) {
    spaceship.velocity.x = 5;
  } else {
    spaceship.velocity.x = 0;
  }
}
animate();

// spaceship's movement W/keyboard
addEventListener('keydown', e => {
  e.preventDefault();
  switch (e.key) {
    case 'a':
      controlKeys.a.pressed = true;
      break;
    case 'd':
      controlKeys.d.pressed = true;
      break;
    case ' ':
      controlKeys.space.pressed = true;
      break;
    default:
      break;
  }
});

addEventListener('keyup', e => {
  switch (e.key) {
    case 'a':
      controlKeys.a.pressed = false;
      break;
    case 'd':
      controlKeys.d.pressed = false;
      break;
    case ' ':
      controlKeys.space.pressed = false;
      break;
    default:
      break;
  }
});

// let shootmessage;
// function shoot() {
//   shootmessage = setInterval(() => {
//     console.log('shoot');
//   }, 60 / 1000);
// }
// let isdown = false;
// addEventListener('mousedown', e => {
//   console.log(e);
//   isdown = true;
//   if (isdown) {
//     shoot();
//   }
// });
// addEventListener('mouseup', e => {
//   console.log(e);
//   isdown = false;
//   if (shootmessage) clearInterval(shootmessage);
// });
