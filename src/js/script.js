const canvas = document.querySelector('#canvas');
const c = canvas.getContext('2d');

canvas.width = innerWidth;
canvas.height = innerHeight;

addEventListener('resize', () => {
  canvas.width = innerWidth;
  canvas.height = innerHeight;
  animate();
});

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

    this.opacity = 1;
    // image for the visuals of the spaceship
    // drawImage() needs an image element with its src set
    const image = new Image();
    image.src = 'assets/img/spaceship.png';

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
    c.globalAlpha = this.opacity;
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
let spaceship = new Spaceship();

// --------------------------------------
// ------ALIEN PROJECTILE------
class Particle {
  constructor(x, y, dx, dy, r, color, willFade) {
    // we need to know from which alien we want to shoot
    this.coordinates = {
      x: x,
      y: y,
    };

    this.velocity = {
      x: dx,
      y: dy,
    };

    this.radius = r;
    this.color = color;
    this.opacity = 1;
    this.willFade = willFade;
  }

  draw() {
    c.save();
    // this is a globa property and would affect everything and we want it to only affect the code between save and restore and fade the particles
    c.globalAlpha = this.opacity;
    c.beginPath();
    c.arc(this.coordinates.x, this.coordinates.y, this.radius, 0, Math.PI * 2);
    c.fillStyle = this.color;
    c.fill();
    c.closePath();
    c.restore();
  }

  update() {
    this.draw();
    this.coordinates.x += this.velocity.x;
    this.coordinates.y += this.velocity.y;
    if (this.willFade) {
      this.opacity -= 0.01;
    }
  }
}
let particles = [];

// --------------------------------------
// ------PROJECTILE------
class Projectile {
  // anything dynamic should be passed as a parameter
  constructor({ x, y }) {
    this.width = 4;
    this.height = 13;

    this.coordinates = {
      x: x - this.width / 2,
      y: y,
    };

    this.velocity = {
      x: 0,
      y: -13,
    };
  }

  draw() {
    c.shadowBlur = 13;
    c.shadowOffsetY = 20;
    c.shadowColor = 'white';
    c.fillStyle = 'white';
    c.fillRect(this.coordinates.x, this.coordinates.y, this.width, this.height);
    // clearing the shadow
    c.shadowColor = 'transparent';
    c.shadowBlur = 0;
  }

  update() {
    this.draw();
    this.coordinates.x += this.velocity.x;
    this.coordinates.y += this.velocity.y;
  }
}
let projectiles = [];

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
// ------ALIEN PROJECTILE------
class AlienProjectile {
  constructor(x, y, dx, dy) {
    // we need to know from which alien we want to shoot
    this.coordinates = {
      x: x,
      y: y,
    };

    this.velocity = {
      x: dx,
      y: dy,
    };

    this.radius = 6;
  }

  draw() {
    c.beginPath();
    c.arc(this.coordinates.x, this.coordinates.y, this.radius, 0, Math.PI * 2);
    c.fillStyle = '#E07F87';
    c.fill();
    c.closePath();
  }

  update() {
    this.draw();
    this.coordinates.x += this.velocity.x;
    this.coordinates.y += this.velocity.y;
  }
}
let alienProjectiles = [];

// --------------------------------------
// ------ALIEN------
class Alien {
  constructor(x, y) {
    this.velocity = {
      x: 0,
      y: 0,
    };

    const image = new Image();
    image.src = 'assets/img/alien.png';

    image.addEventListener('load', () => {
      this.image = image;
      const scale = 1.4;

      this.width = image.width / scale;
      this.height = image.height / scale;

      this.coordinates = {
        x: x * this.width,
        y: y * this.height,
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

  update(dx, dy) {
    if (this.image) {
      this.draw();
      this.coordinates.x += dx;
      this.coordinates.y += dy;
    }
  }

  fire(alienProjectiles) {
    alienProjectiles.push(
      new AlienProjectile(
        this.coordinates?.x + this.width / 2,
        this.coordinates?.y + this.height,
        0,
        4
      )
    );
  }
}

// --------------------------------------
// ------GROUP------
class Group {
  constructor() {
    this.coordinates = {
      x: 0,
      y: 0,
    };
    this.velocity = {
      x: 3,
      y: 0,
    };

    // this group is gonna contain an array of aliens
    this.members = [];

    // minimum 3 cols and 2 rows
    // maximum 9 cols and 7 rows
    const cols = Math.floor(Math.random() * (9 - 3) + 3);
    const rows = Math.floor(canvas.height / 5 / (64 / 1.4));

    for (let c = 0; c < cols; c++) {
      for (let r = 0; r < rows; r++) {
        this.members.push(new Alien(c, r));
      }
    }
    this.width = (64 / 1.4) * cols;
    this.height = (64 / 1.4) * rows;
  }

  update() {
    // this alone moves the group but not the aliens inside. they should have the same velocity
    this.coordinates.x += this.velocity.x;
    this.coordinates.y += this.velocity.y;

    // bounce back the group when it hits the sides of the window
    if (
      this.coordinates.x + this.width >= canvas.width ||
      this.coordinates.x <= 0
    ) {
      this.velocity.x = -this.velocity.x;
      this.velocity.y = 80;
    } else {
      this.velocity.y = 0;
    }
  }
}
// multiple groups coming and going
let groups = [new Group()];

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

function createParticles(obj, color) {
  // this amount of particles
  for (let i = 1; i < 20; i++) {
    particles.push(
      new Particle(
        obj.coordinates?.x + obj.width / 2,
        obj.coordinates?.y + obj.height / 2,
        (Math.random() - 0.5) * 2.3,
        (Math.random() - 0.5) * 2.3,
        (Math.random() * obj.width) / 30,
        color,
        true
      )
    );
  }
}

// --------------------------------------
// ------Moving bg
for (let i = 1; i < 80; i++) {
  particles.push(
    new Particle(
      Math.random() * canvas.width,
      Math.random() * canvas.height,
      0,
      0.5,
      Math.random() * 1,
      'white',
      false
    )
  );
}

// --------------------------------------
// ------requestAnimationFrame()
// the process of loading an image takes time and it may not even be loaded when we are trying to draw it so we need to do it in an animation loop to keep painting the frames until it finally IS
let framesNumb = 0;
let score = 0;
let gameover = false;
let gamepause = false;
function animate() {
  if (gameover) return;
  requestAnimationFrame(animate);
  // if (framesNumb % 500 === 0) {
  //   particles.push(
  //     new Particle(
  //       Math.random() * canvas.width,
  //       (Math.random() * canvas.height) / 2,
  //       0,
  //       0.5,
  //       10,
  //       'blue',
  //       false
  //     )
  //   );
  // }
  // the default is black but we need to specify it again in the fillstyle because there could be another fillstyle before this and we dont want the bg to be of that color instead of black
  // we want to call this here and not at the beginning because the canvas needs to be cleared before each repaint
  c.fillStyle = 'black';
  c.fillRect(0, 0, canvas.width, canvas.height);

  // just rendering
  spaceship.update();
  particles.forEach((particle, i) => {
    // repositioning particles to the top where we cant see them but anywhere along the x axis
    if (particle.coordinates.y - particle.radius >= canvas.height) {
      particle.coordinates.x = Math.random() * canvas.width;
      particle.coordinates.y = -particle.radius;
    }
    if (particle.opacity <= 0) {
      // stop the flickering
      setTimeout(() => {
        particles.splice(i, 1);
      }, 0);
    } else {
      particle.update();
    }
  });
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
  alienProjectiles.forEach((alienProjectile, i) => {
    if (
      alienProjectile.coordinates.y + alienProjectile.radius >
      canvas.height
    ) {
      setTimeout(() => {
        alienProjectiles.splice(i, 1);
      }, 0);
    } else {
      alienProjectile.update();
    }

    if (
      alienProjectile.coordinates.y - alienProjectile.radius >=
        spaceship.coordinates?.y &&
      alienProjectile.coordinates.x - alienProjectile.radius >=
        spaceship.coordinates?.x &&
      alienProjectile.coordinates.x + alienProjectile.radius <=
        spaceship.coordinates?.x + spaceship.width
    ) {
      setTimeout(() => {
        alienProjectiles.splice(i, 1);
        spaceship.opacity = 0;
        gamepause = true;
      }, 0);

      createParticles(spaceship, '#326462');
      // remove both projectile and player

      setTimeout(() => {
        gameover = true;
        document.querySelector('.gameover').classList.remove('hide');
      }, 1000);
    }
  });
  groups.forEach((group, gi) => {
    group.update();
    // if there are any aliens in the current group fire random projectiles from an alien after certain amount of frames
    if (framesNumb % 150 === 0 && group.members.length > 0) {
      const randomFraction = Math.floor(Math.random() * group.members.length);
      group.members[randomFraction].fire(alienProjectiles);
    }
    group.members.forEach((member, mi) => {
      member.update(group.velocity.x, group.velocity.y);

      if (
        member.coordinates?.y + member.height >=
        spaceship.coordinates?.y - 10
      ) {
        createParticles(spaceship, '#326462');

        setTimeout(() => {
          gamepause = true;
        }, 0);

        setTimeout(() => {
          gameover = true;
          document.querySelector('.gameover').classList.remove('hide');
        }, 1000);
      }

      // collision detection
      projectiles.forEach((projectile, pi) => {
        if (
          projectile.coordinates.y <= member.coordinates?.y + member.height &&
          projectile.coordinates.y >= member.coordinates?.y &&
          projectile.coordinates.x >= member.coordinates?.x &&
          projectile.coordinates.x <= member.coordinates?.x + member.width
        ) {
          setTimeout(() => {
            // ?? what does it mean 'splicing changes the whole array so we need to make sure the items we wanna remove are actually there in the first place' ??
            if (
              group.members.find(m => m === member) &&
              projectiles.find(p => p === projectile)
            ) {
              // remove both projectile and alien from the array
              projectiles.splice(pi, 1);
              group.members.splice(mi, 1);
              score += 100;
              document.querySelector('.score .number').innerHTML = score;

              createParticles(member, '#e07f87');

              // create a new group of aliens every time the number of alive ones is less than 8
              const allAliens = groups.reduce((a, group) => {
                return a + group.members.length;
              }, 0);
              if (allAliens < 8) {
                groups.push(new Group());
              }
              // whatever we do, the first alien in the array is located in the far left and the last one in the array is in the right
              // if we have anything!
              if (group.members.length > 0) {
                // this is taking care of the width and not where the group actually starts
                group.width =
                  group.members[group.members.length - 1].coordinates.x +
                  group.members[group.members.length - 1].width -
                  group.members[0].coordinates.x;
                group.coordinates.x = group.members[0].coordinates.x;
              } else {
                // garbage collection: deleting the entire group with all its aliens removed
                groups.splice(gi, 1);
              }
            }
          }, 0);
        }
      });
    });
  });

  if (controlKeys.a.pressed && spaceship.coordinates?.x >= 0) {
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
  framesNumb++;
}
animate();

// --------------------------------------
// ------EventListeners
// spaceship's movement W/keyboard
addEventListener('keydown', e => {
  // otherwise spaceship could still shoot after getting hit
  if (gamepause) return;
  e.preventDefault();
  console.log(e.key);
  switch (e.key) {
    case 'a':
    case 'ArrowLeft':
      controlKeys.a.pressed = true;
      break;
    case 'd':
    case 'ArrowRight':
      controlKeys.d.pressed = true;
      break;
    case ' ':
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

document.querySelector('.btn--retry').addEventListener('click', () => {
  document.querySelector('.gameover').classList.add('hide');
  spaceship = new Spaceship();
  score = 0;
  document.querySelector('.score .number').innerHTML = score;
  projectiles = [];
  particles = [];
  alienProjectiles = [];
  groups = [new Group()];
  framesNumb = 0;
  gameover = false;
  gamepause = false;
  for (let i = 1; i < 80; i++) {
    particles.push(
      new Particle(
        Math.random() * canvas.width,
        Math.random() * canvas.height,
        0,
        0.5,
        Math.random() * 1,
        'white',
        false
      )
    );
  }
  animate();
});
