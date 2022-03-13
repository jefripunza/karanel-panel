const { ChartJSNodeCanvas } = require('chartjs-node-canvas');

const fs = require('fs');
const path = require('path');

const {
    nowDateIndo,
} = require("../helpers/date")

function makeRightLabel(batas, ctx, urutan) {
    // -3
    ctx.fillText('-3', batas, urutan["-3"]);
    // -2
    ctx.fillText('-2', batas, urutan["-2"]);
    // -1
    ctx.fillText('-1', batas, urutan["-1"]);
    // 0
    ctx.fillText('0', batas, urutan["0"]);
    // 1
    ctx.fillText('1', batas, urutan["1"]);
    // 2
    ctx.fillText('2', batas, urutan["2"]);
    // 3
    ctx.fillText('3', batas, urutan["3"]);
}

// ========================== with gender ========================== //
function reducerWithGender(array, gender) {
    return array
        .filter(v => String(v).split(";")[1].toLowerCase() === gender)
        .map(v => { const [dataX, gender, min3, min2, min1, nol, plus1, plus2, plus3] = String(v).split(";").map((v, i) => i !== 1 ? parseFloat(v) : i == 0 ? parseInt(v) : v); return { dataX, gender, min3, min2, min1, nol, plus1, plus2, plus3 } })
}
function getXWithGender(array) {
    return reducerWithGender(array, "p")
        .map(v => v.dataX)
}
function getYWithGender(array, gender) {
    const data = reducerWithGender(array, gender)
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
function batasanWithGender(namefile) {
    const data = (fs.readFileSync(path.join(__dirname, "..", "public", namefile), { encoding: "utf8" })).split("\n").filter((v, i) => i > 0).filter(v => v !== undefined)
    const x = getXWithGender(data)
    const male = getYWithGender(data, "p")
    const female = getYWithGender(data, "l")
    return {
        x,
        male,
        female,
    }
}
const makeLineChartWithGender = async (filename, yLabel, data, xLabel, gender, rightLabel, withZero = true) => {
    const getBatasan = batasanWithGender(filename)
    const xBatasan = getBatasan.x
    const maleBatasan = getBatasan.male
    const femaleBatasan = getBatasan.female

    function makeY(gender, rangking) {
        const dataBatasan = String(gender).toLowerCase() === "male" ? maleBatasan : femaleBatasan
        return dataBatasan[rangking]
    }

    const width = 1200; //px
    const height = 800; //px
    const backgroundColour = 'white';
    const chartJSNodeCanvas = new ChartJSNodeCanvas({ width, height, backgroundColour });
    // chartJSNodeCanvas.registerFont('./fonts/montserrat/Montserrat-Bold.otf', { family: 'Montserrat', weight: '900' });

    const padding = 30;
    const tension = 0.2;
    return await chartJSNodeCanvas.renderToBuffer({
        type: 'line',
        data: {
            labels: xBatasan,
            datasets: [{
                data,
                label: "Data Anak",
                tension,
                borderColor: "#030ffc",
                fill: false,
                pointBackgroundColor: "#030ffc",
                pointRadius: 4,
            }, {
                data: makeY(gender, "min3"),
                label: "-3",
                tension,
                borderColor: "#e60e0e",
                fill: false
            }, {
                data: makeY(gender, "min2"),
                label: "-2",
                tension,
                borderColor: "#f56342",
                fill: false
            }, {
                data: makeY(gender, "min1"),
                label: "-1",
                tension,
                borderColor: "#f58742",
                fill: false
            }, {
                data: makeY(gender, "nol"),
                label: "0",
                tension,
                borderColor: "#dbc027",
                fill: false
            }, {
                data: makeY(gender, "plus1"),
                label: "1",
                tension,
                borderColor: "#aedb27",
                fill: false
            }, {
                data: makeY(gender, "plus2"),
                label: "2",
                tension,
                borderColor: "#8ddb27",
                fill: false
            }, {
                data: makeY(gender, "plus3"),
                label: "3",
                tension,
                borderColor: "#54db27",
                fill: false
            }],
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: false,
                },
            },
            scales: {
                x: {
                    display: true,
                    ticks: {
                        color: 'white',
                    },
                    title: {
                        display: true,
                        text: xLabel,
                        color: 'white',
                        font: {
                            size: 18,
                        },
                    },
                },
                y: {
                    beginAtZero: withZero,
                    type: 'linear', // linear logarithmic
                    display: true,
                    position: 'left',
                    ticks: {
                        color: 'white',
                        maxTicksLimit: 40,
                        stepSize: 0.5,
                        callback: function (val, index) {
                            // Hide the label of every 2nd dataset
                            return index % 2 === 0 ? this.getLabelForValue(val) : '';
                        },
                    },
                    title: {
                        display: true,
                        text: yLabel,
                        color: 'white',
                        font: {
                            size: 18,
                        },
                    },
                },
            },
            elements: {
                point: {
                    radius: 0, // remove dot
                }
            },
            interaction: {
                // mode: 'index',
                intersect: false,
            },
            stacked: false,
            layout: {
                padding: {
                    top: padding,
                    right: padding,
                    bottom: padding,
                    left: padding,
                }
            },
        },
        plugins: [{
            id: 'custom_canvas_background_color',
            beforeDraw: function (chart, options) {
                const ctx = chart.ctx;
                // console.log({ select: ctx })
                ctx.save();

                ctx.fillStyle = String(gender).toLowerCase() === "male" ? "#0197D4" : "#E67FB4";

                const rectSize = [
                    padding, // top
                    padding, // right
                    padding + 65, // bottom
                    padding + 58, // left
                ]
                ctx.fillRect(0, 0, chart.width, rectSize[0]); // top
                ctx.fillRect(chart.width - rectSize[1], 0, chart.width - rectSize[1], chart.height); // right
                ctx.fillRect(0, chart.height - rectSize[2], chart.width, chart.height); // bottom
                ctx.fillRect(0, 0, rectSize[3], chart.height); // left

                ctx.fillStyle = "#fff" // white / reset
                ctx.font = "italic 0.7em sans-serif";
                ctx.fillText(nowDateIndo(), 20, chart.height - 20); // waktu
                ctx.fillText('@ 2022 Karanel', chart.width - 150, chart.height - 20);

                // right label per line
                ctx.font = "bold 0.8em sans-serif";
                const batas_right_label = chart.width - 28;

                rightLabel(batas_right_label, ctx)

                ctx.restore();
            }
        }],
    });
}

// ========================== no gender ========================== //
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
    const data = (fs.readFileSync(path.join(__dirname, "..", "public", namefile), { encoding: "utf8" })).split("\n").filter((v, i) => i > 0).filter(v => v !== undefined)
    const x = getX(data)
    const y = getY(data)
    return {
        x,
        y,
    }
}
const makeLineChart = async (filename, yLabel, data, xLabel, gender, rightLabel, withZero = true) => {
    const getBatasan = batasan(filename)
    const xBatasan = getBatasan.x
    const yBatasan = getBatasan.y

    function makeY(rangking) {
        return yBatasan[rangking]
    }

    const width = 1200; //px
    const height = 800; //px
    const backgroundColour = 'white';
    const chartJSNodeCanvas = new ChartJSNodeCanvas({ width, height, backgroundColour });
    // chartJSNodeCanvas.registerFont('./fonts/montserrat/Montserrat-Bold.otf', { family: 'Montserrat', weight: '900' });

    const padding = 30;
    const tension = 0.2;
    return await chartJSNodeCanvas.renderToBuffer({
        type: 'line',
        data: {
            labels: xBatasan,
            datasets: [{
                data,
                label: "Data Anak",
                tension,
                borderColor: "#030ffc",
                fill: false,
                pointBackgroundColor: "#030ffc",
                pointRadius: 4,
            }, {
                data: makeY("min3"),
                label: "-3",
                tension,
                borderColor: "#e60e0e",
                fill: false
            }, {
                data: makeY("min2"),
                label: "-2",
                tension,
                borderColor: "#f56342",
                fill: false
            }, {
                data: makeY("min1"),
                label: "-1",
                tension,
                borderColor: "#f58742",
                fill: false
            }, {
                data: makeY("nol"),
                label: "0",
                tension,
                borderColor: "#dbc027",
                fill: false
            }, {
                data: makeY("plus1"),
                label: "1",
                tension,
                borderColor: "#aedb27",
                fill: false
            }, {
                data: makeY("plus2"),
                label: "2",
                tension,
                borderColor: "#8ddb27",
                fill: false
            }, {
                data: makeY("plus3"),
                label: "3",
                tension,
                borderColor: "#54db27",
                fill: false
            }],
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: false,
                },
            },
            scales: {
                x: {
                    display: true,
                    ticks: {
                        color: 'white',
                    },
                    title: {
                        display: true,
                        text: xLabel,
                        color: 'white',
                        font: {
                            size: 18,
                        },
                    },
                },
                y: {
                    beginAtZero: withZero,
                    type: 'linear', // linear logarithmic
                    display: true,
                    position: 'left',
                    ticks: {
                        color: 'white',
                        maxTicksLimit: 40,
                        stepSize: 0.5,
                        callback: function (val, index) {
                            // Hide the label of every 2nd dataset
                            return index % 2 === 0 ? this.getLabelForValue(val) : '';
                        },
                    },
                    title: {
                        display: true,
                        text: yLabel,
                        color: 'white',
                        font: {
                            size: 18,
                        },
                    },
                },
            },
            elements: {
                point: {
                    radius: 0, // remove dot
                }
            },
            interaction: {
                // mode: 'index',
                intersect: false,
            },
            stacked: false,
            layout: {
                padding: {
                    top: padding,
                    right: padding,
                    bottom: padding,
                    left: padding,
                }
            },
        },
        plugins: [{
            id: 'custom_canvas_background_color',
            beforeDraw: function (chart, options) {
                const ctx = chart.ctx;
                // console.log({ select: ctx })
                ctx.save();

                ctx.fillStyle = String(gender).toLowerCase() === "male" ? "#0197D4" : "#E67FB4";

                const rectSize = [
                    padding, // top
                    padding, // right
                    padding + 65, // bottom
                    padding + 58, // left
                ]
                ctx.fillRect(0, 0, chart.width, rectSize[0]); // top
                ctx.fillRect(chart.width - rectSize[1], 0, chart.width - rectSize[1], chart.height); // right
                ctx.fillRect(0, chart.height - rectSize[2], chart.width, chart.height); // bottom
                ctx.fillRect(0, 0, rectSize[3], chart.height); // left

                ctx.fillStyle = "#fff" // white / reset
                ctx.font = "italic 0.7em sans-serif";
                ctx.fillText(nowDateIndo(), 20, chart.height - 20); // waktu
                ctx.fillText('@ 2022 Karanel', chart.width - 150, chart.height - 20);

                // right label per line
                ctx.font = "bold 0.8em sans-serif";
                const batas_right_label = chart.width - 28;

                rightLabel(batas_right_label, ctx)

                ctx.restore();
            }
        }],
    });
}

module.exports = {
    makeRightLabel,

    makeLineChart,
    makeLineChartWithGender,
}