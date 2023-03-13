let WIDTH = 0;
let HEIGHT = 0;

interface Drawable {
  draw: (ctx: CanvasRenderingContext2D, scrap?: number) => void;
}

class Car implements Drawable {
  SIZE = { long: 25, width: 12 };
  MAX_SPEED = 200;
  MAX_REV_SPEED = -20;
  speed = 0;
  ACCELERATE = 40;
  BREAK = 80;
  angle = 0;
  constrols = { throtle: false, left: false, right: false, breaks: false };

  constructor(private x: number, private y: number) {
    document.addEventListener('keydown', (event) => this.updateControls(event.key, true), false);
    document.addEventListener('keyup', (event) => this.updateControls(event.key, false), false);
  }

  updateControls(key: string, value: boolean) {
    switch (key) {
      case 'w':
        this.constrols.throtle = value;
        break;
      case 's':
        this.constrols.breaks = value;
        break;
      case 'a':
        this.constrols.left = value;
        break;
      case 'd':
        this.constrols.right = value;
        break;
    }
  }

  draw(ctx: CanvasRenderingContext2D, scrap = 0.1) {
    const distance = this.speed * scrap;

    const { throtle, breaks, left, right } = this.constrols;

    if (throtle) {
      if (this.speed < 0) {
        this.speed += this.BREAK * scrap;
      }

      if (this.speed < this.MAX_SPEED) {
        this.speed += this.ACCELERATE * scrap;
      }
    }

    if (breaks) {
      if (this.speed > 0) {
        this.speed -= this.BREAK * scrap;
      }

      if (this.speed > this.MAX_REV_SPEED) {
        this.speed -= this.ACCELERATE * scrap;
      }
    }

    if (!throtle && !breaks) {
      if (this.speed > 0) {
        this.speed -= 10 * scrap;
      } else if (this.speed < 0) {
        this.speed += 10 * scrap;
      }

      if (this.speed % 1 < 0) {
        this.speed = 0;
      }
    }

    if (this.speed) {
      if (this.speed > 0) {
        this.angle += right ? 1 * scrap : 0;
        this.angle -= left ? 1 * scrap : 0;
      } else {
        this.angle -= right ? 1 * scrap : 0;
        this.angle += left ? 1 * scrap : 0;
      }
      this.x += distance * Math.cos(this.angle);
      this.y += distance * Math.sin(this.angle);
    }

    ctx.save();
    ctx.fillStyle = 'red';
    ctx.translate(this.x + 75, this.y + 50);
    ctx.rotate(this.angle);
    ctx.translate(-this.x - this.SIZE.long / 2, -this.y - this.SIZE.width / 2);
    ctx.fillRect(this.x, this.y, this.SIZE.long, this.SIZE.width);
    ctx.restore();
    ctx.fillText(
      `cat throtle: ${throtle}\n breaks: ${breaks}\n left: ${left}\n right: ${right}\n angle: ${this.angle}`,
      250,
      10
    );
    ctx.fillText(`x: ${this.x} y: ${this.y}`, 250, 25);
    ctx.fillText(`x: ${Math.cos(this.angle)}\n y: ${Math.sin(this.angle)}\n  `, 250, 40);
    ctx.fillText(`speed: ${this.speed}, scrap: ${scrap}, distance: ${distance});`, 250, 55);
  }
}

class Game {
  private objects: Drawable[] = [];

  constructor(private ctx: CanvasRenderingContext2D, private lastUpdate: Date) {}

  init() {
    const car = new Car(15, 20);

    this.objects = [car];
  }

  draw(date: Date) {
    this.ctx.clearRect(0, 0, WIDTH, HEIGHT);

    const time = date.getTime() - this.lastUpdate.getTime();
    this.lastUpdate = date;

    this.ctx.fillStyle = 'black';
    this.ctx.fillText(`time ${time}`, 10, 10);
    this.ctx.fillText(`fps ${1000 / time}`, 10, 20);

    for (const ob of this.objects) {
      ob.draw(this.ctx, time / 1000);
    }
  }
}

function start(canvas: HTMLCanvasElement) {
  WIDTH = canvas.width;
  HEIGHT = canvas.height;
  const game = new Game(canvas.getContext('2d') as CanvasRenderingContext2D, new Date());
  game.init();

  const gameLoop = setInterval(() => game.draw(new Date()));

  document.addEventListener('keypress', (e) => {
    if (e.key === 'p') {
      clearInterval(gameLoop);
    }
  });
}

export { start };
