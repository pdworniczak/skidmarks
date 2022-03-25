let WIDTH = 0;
let HEIGHT = 0;

interface Drawable {
  draw: (ctx: CanvasRenderingContext2D) => void;
}

class Car implements Drawable {
  SIZE = { long: 20, width: 10 };
  speed = 1;
  angle = 0;
  constrols = { throtle: false, left: false, right: false, breaks: false };

  constructor(private x: number, private y: number) {}

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

  draw(ctx: CanvasRenderingContext2D) {
    const { throtle, breaks, left, right } = this.constrols;
    this.angle += right ? 0.015 : 0;
    this.angle -= left ? 0.015 : 0;
    if (throtle) {
      this.x += this.speed * Math.cos(this.angle);
      this.y += this.speed * Math.sin(this.angle);
    }

    if (breaks) {
      this.x -= this.speed * Math.cos(this.angle);
      this.y -= this.speed * Math.sin(this.angle);
    }
    // this.x -= throtle ?  : 0;
    // this.y += breaks ? 1 : 0;
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
    ctx.fillText(`x: ${Math.cos(this.angle)}\n y: ${Math.sin(this.angle)}\n  `, 250, 25);
  }
}

class Game {
  private objects: Drawable[] = [];

  constructor(private ctx: CanvasRenderingContext2D, private lastUpdate: Date) {}

  init() {
    const tank = new Car(15, 20);

    this.objects = [tank];

    document.addEventListener('keydown', (event) => tank.updateControls(event.key, true), false);
    document.addEventListener('keyup', (event) => tank.updateControls(event.key, false), false);
  }

  draw(date: Date) {
    this.ctx.clearRect(0, 0, WIDTH, HEIGHT);

    const time = date.getMilliseconds() - this.lastUpdate.getMilliseconds();
    this.lastUpdate = date;

    this.ctx.fillStyle = 'black';
    this.ctx.fillText(`fps ${1000 / time}`, 10, 10);

    for (const ob of this.objects) {
      ob.draw(this.ctx);
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
