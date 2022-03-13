const {
  makeRightLabel,

  makeLineChart,
  makeLineChartWithGender,
} = require("../utils/chartBuilder")

// ============================================================================== //

exports.chartWithGender = async (req, res) => { // with gender
  const {
    csv_name,
    gender,
    value,
  } = req.params;
  const extraValue = String(value).split(",").map(v => parseFloat(v))
  // return res.json({ gender, xBatasan, data: makeY(gender, "min3"), extraValue }) // debug

  if (csv_name === "bb_u") {
    const image = await makeLineChartWithGender(`rangking_bb_u.csv`, 'Berat Badan (kg)', extraValue, 'Umur (bulan)', gender, (batas, ctx) => {
      if (String(gender).toLowerCase() === "male") {
        makeRightLabel(batas, ctx, {
          ["-3"]: 440,
          ["-2"]: 400,
          ["-1"]: 355,
          ["0"]: 300,
          ["1"]: 230,
          ["2"]: 150,
          ["3"]: 45,
        })
      } else {
        makeRightLabel(batas, ctx, {
          ["-3"]: 410,
          ["-2"]: 370,
          ["-1"]: 320,
          ["0"]: 270,
          ["1"]: 200,
          ["2"]: 125,
          ["3"]: 40,
        })
      }
    })
    res.type("image/png")
    res.send(image)
  } else if (csv_name === "pb_u") {
    const image = await makeLineChartWithGender(`rangking_pb_u.csv`, 'Tinggi Badan (cm)', extraValue, 'Umur (bulan)', gender, (batas, ctx) => {
      if (String(gender).toLowerCase() === "male") {
        makeRightLabel(batas, ctx, {
          ["-3"]: 280,
          ["-2"]: 240,
          ["0"]: 160,
          ["2"]: 85,
          ["3"]: 45,
        })
      } else {
        makeRightLabel(batas, ctx, {
          ["-3"]: 270,
          ["-2"]: 235,
          ["0"]: 155,
          ["2"]: 80,
          ["3"]: 45,
        })
      }
    }, false)
    res.type("image/png")
    res.send(image)
  } else if (csv_name === "bb_pb") {
    const image = await makeLineChartWithGender(`rangking_bb_pb.csv`, 'Berat Badan (kg)', extraValue, 'Tinggi Badan (cm)', gender, (batas, ctx) => {
      if (String(gender).toLowerCase() === "male") {
        makeRightLabel(batas, ctx, {
          ["-3"]: 325,
          ["-2"]: 290,
          ["-1"]: 250,
          ["0"]: 210,
          ["1"]: 160,
          ["2"]: 105,
          ["3"]: 45,
        })
      } else {
        makeRightLabel(batas, ctx, {
          ["-3"]: 320,
          ["-2"]: 285,
          ["-1"]: 250,
          ["0"]: 210,
          ["1"]: 160,
          ["2"]: 110,
          ["3"]: 45,
        })
      }
    })
    res.type("image/png")
    res.send(image)
  } else if (csv_name === "lk") {
    const image = await makeLineChart(`rangking_lk.csv`, 'Lingkar Kepala (kg)', extraValue, 'Umur (bulan)', gender, (batas, ctx) => {
      if (String(gender).toLowerCase() === "male") {
        makeRightLabel(batas, ctx, {
          ["-3"]: 440,
          ["-2"]: 400,
          ["-1"]: 355,
          ["0"]: 300,
          ["1"]: 230,
          ["2"]: 150,
          ["3"]: 45,
        })
      } else {
        makeRightLabel(batas, ctx, {
          ["-3"]: 410,
          ["-2"]: 370,
          ["-1"]: 320,
          ["0"]: 270,
          ["1"]: 200,
          ["2"]: 125,
          ["3"]: 40,
        })
      }
    }, false)
    res.type("image/png")
    res.send(image)
  } else {
    res.status(400).json({
      message: "salah select file csv lu..."
    })
  }
};