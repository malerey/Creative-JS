const canvasSketch = require('canvas-sketch');
const { lerp } = require('canvas-sketch-util/math');
const random = require('canvas-sketch-util/random');
const palettes = require('nice-color-palettes');
const WebFont = require('webfontloader');

WebFont.load({
  google: {
    families: ['Liu Jian Mao Cao']
  }
});

const settings = {
  dimensions: [2048, 2048]
};

const sketch = () => {

  //elijo paleta al azar
  // elijo nro de colores al azar
  const colorCount = random.rangeFloor(2, 6)
  const palette = random.shuffle(random.pick(palettes)).slice(0, colorCount);

  // creo la grilla 
  const createGrid = () => {
    const points = [];
    const count = 80;
    for (let x = 0; x < count; x++) {
      for (let y = 0; y < count; y++) {
        const u = x / (count - 1);
        const v = y / (count - 1);

        // agregamos noise
        // un valor asociado a las coordenadas
        const radius = Math.abs(random.noise2D(u, v)) * 0.15

        //randomizar tamaño de circulos
        points.push({
          color: random.pick(palette),
          radius,
          rotation: random.noise2D(u, v),
          position: [u, v]
        })
      }
    }
    return points;
  }

  // agregamos randomness
  const points = createGrid().filter(() => random.value() > 0.5);

  // margen
  const margin = 200;

  return ({ context, width, height }) => {
    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);

    // agarro la grilla
    points.forEach(data => {
      const { position, radius, color, rotation } = data;
      const [u, v] = position;

      // lerp para que haya margen 
      const x = lerp(margin, width - margin, u);
      const y = lerp(margin, height - margin, v);

      // dibujo circulos
      // context.beginPath();
      // context.arc(x, y, radius * width, 0, Math.PI * 2, false)
      // context.fillStyle = color;
      // context.fill()

      context.save();
      context.fillStyle = color;
      context.font = `${radius * width}px "Liu Jian Mao Cao"`;
      context.translate(x, y);
      context.rotate(rotation);
      context.fillText("'", 0, 0);
      context.restore();
    })

  };
};

canvasSketch(sketch, settings);
