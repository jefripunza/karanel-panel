const fs = require('fs');
const path = require('path');

function reducer(array) {
  return array
    .map(v => { const [dataX, min3, min2, min1, nol, plus1, plus2, plus3] = String(v).split(";").map((v, i) => i !== 1 ? parseFloat(v) : i == 0 ? parseInt(v) : v); return { dataX, min3, min2, min1, nol, plus1, plus2, plus3 } })
}
function getX(array) {
  return reducer(array)
    .map(v => v.dataX)
}
function getY(array) {
  const data = reducer(array)
  const render = {
    min3: [],
    min2: [],
    min1: [],
    nol: [],
    plus1: [],
    plus2: [],
    plus3: []
  }
  for (let i = 0; i < data.length; i++) {
    const d = data[i];
    render.min3.push(d.min3)
    render.min2.push(d.min2)
    render.min1.push(d.min1)
    render.nol.push(d.nol)
    render.plus1.push(d.plus1)
    render.plus2.push(d.plus2)
    render.plus3.push(d.plus3)
  }
  return render
}
function batasan(namefile) {
  const data = (fs.readFileSync(path.join(__dirname, "public", namefile), { encoding: "utf8" })).split("\n").filter((v, i) => i > 0).filter(v => v !== undefined)
  const x = getX(data)
  const y = getY(data)
  return {
    x,
    y,
  }
}

console.log({ batasan: batasan("rangking_lk.csv").y.min3 });