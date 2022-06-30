const canvas = document.querySelector('#canvas');
const c = canvas.getContext('2d');

canvas.width = innerWidth;
canvas.height = innerHeight;

// --------------------------------------
// ------PLAYER------
class Spaceship {
  constructor() {
    // we need the spaceship to move so it should have velocity
    this.velocity = {
      x: 0,
      y: 0,
    };

    this.tilt = 0;

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

    // taking a snapshot of the current state of the canvas
    c.save();
    // first we have to move the top left of our canvas to the middle of our spaceship
    c.translate(
      spaceship.coordinates.x + spaceship.width / 2,
      spaceship.coordinates.y + spaceship.height / 2
    );
    c.rotate(this.tilt);
    // putting the canvas back where it was from where it is atm
    c.translate(
      -spaceship.coordinates.x - spaceship.width / 2,
      -spaceship.coordinates.y - spaceship.height / 2
    );

    c.drawImage(
      this.image,
      this.coordinates.x,
      this.coordinates.y,
      this.width,
      this.height
    );

    // restoring that saved snapshot
    c.restore();
  }

  // changing the coordinates based on the velocity. we want a new method so we can call it when we click or move the mouse, separate from the draw(), which is firing off continuously
  update() {
    // after the image loaded
    if (this.image) {
      this.draw();
      this.coordinates.x += this.velocity.x;
    }
  }
}
const spaceship = new Spaceship();

// --------------------------------------
// ------PROJECTILE------
class Projectile {
  // anything dynamic should be passed as a parameter
  constructor({ x, y }) {
    this.width = 2;
    this.height = 13;

    this.coordinates = {
      x: x,
      y: y,
    };

    this.velocity = {
      x: 0,
      y: -13,
    };

    this.radius = 3;
  }

  draw() {
    c.fillStyle = 'white';
    c.fillRect(this.coordinates.x, this.coordinates.y, this.width, this.height);
  }

  update() {
    this.draw();
    this.coordinates.x += this.velocity.x;
    this.coordinates.y += this.velocity.y;
  }
}
const projectiles = [];

function createProjectiles() {
  if (controlKeys.space.pressed) {
    projectiles.push(
      new Projectile({
        x: spaceship.coordinates.x + spaceship.width / 2,
        y: spaceship.coordinates.y,
      })
    );
  }
}

// --------------------------------------
// ------ALIEN------
class Alien {
  constructor() {
    this.velocity = {
      x: 0,
      y: 0,
    };

    const image = new Image();
    image.src = './img/alien.png';

    image.addEventListener('load', () => {
      this.image = image;
      const scale = 1.2;

      this.width = image.width / scale;
      this.height = image.height / scale;

      this.coordinates = {
        x: canvas.width / 2 - this.width / 2,
        y: canvas.height / 2 - this.height / 2,
      };
    });
  }

  draw() {
    c.drawImage(
      this.image,
      this.coordinates.x,
      this.coordinates.y,
      this.width,
      this.height
    );
  }

  update() {
    if (this.image) {
      this.draw();
      this.coordinates.x += this.velocity.x;
      this.coordinates.y += this.velocity.y;
    }
  }
}
const alien = new Alien();

// --------------------------------------
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

// --------------------------------------
// ------requestAnimationFrame()
// the process of loading an image takes time and it may not even be loaded when we are trying to draw it so we need to do it in an animation loop to keep painting the frames until it finally IS
function animate() {
  requestAnimationFrame(animate);

  // the default is black but we need to specify it again in the fillstyle because there could be another fillstyle before this and we dont want the bg to be of that color instead of black
  // we want to call this here and not at the beginning because the canvas needs to be cleared before each repaint
  c.fillStyle = 'black';
  c.fillRect(0, 0, canvas.width, canvas.height);

  spaceship.update();
  projectiles.forEach((projectile, i) => {
    // garbage collection for the performance
    if (projectile.coordinates.y + projectile.width < 0) {
      // to avoid flashing, we dont want this to happen immediately but after one frame has passed
      setTimeout(() => {
        projectiles.splice(i, 1);
      }, 0);
    } else {
      projectile.update();
    }
  });
  alien.update();

  if (controlKeys.a.pressed && spaceship.coordinates.x >= 0) {
    spaceship.velocity.x = -5;
    spaceship.tilt = -0.2;
  } else if (
    controlKeys.d.pressed &&
    spaceship.coordinates.x <= canvas.width - spaceship.width
  ) {
    spaceship.velocity.x = 5;
    spaceship.tilt = 0.2;
  } else {
    spaceship.velocity.x = 0;
    spaceship.tilt = 0;
  }
}
animate();

// --------------------------------------
// ------EventListeners
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
      console.log(e);
      controlKeys.space.pressed = true;
      break;
    default:
      break;
  }
  createProjectiles();
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
