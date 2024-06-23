const mongoose = require("mongoose");
const { babyMonitorDB } = require("../mongoose");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const babyMonitorSchema = new mongoose.Schema({
  motherName: { type: String, required: true, unique: true },
  babyName: { type: String, required: true },
  password: { type: String, required: true },
  avatar: { type: String, default: null },
  information: {
    weight: [{ type: Number, default: [] }],
    height: [{ type: Number, default: [] }],
    birthDate: { type: Date, default: null },
  },
  monitor: [
    {
      date: { type: Date, required: true },
      feeding: [
        {
          startTime: { type: Date, required: true },
          endTime: { type: Date },
          isBottle: { type: Boolean, required: true },
          note: { type: String },
        },
      ],
      diapers: [
        {
          time: { type: Date, required: true },
          isPee: { type: Boolean, required: true },
          note: { type: String },
        },
      ],
      sleep: [
        {
          startTime: { type: Date, required: true },
          endTime: { type: Date },
          note: { type: String },
        },
      ],
    },
  ],
});

babyMonitorSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    const babyMonitorPassword = await bcrypt.hash(this.password, 8);
    this.password = babyMonitorPassword;
  }
  next();
});

babyMonitorSchema.methods.generateToken = async function () {
  const token = jwt.sign({ motherName: this.motherName }, process.env.SECRET, { expiresIn: "180d" });
  return token;
};

const BabyMonitor = babyMonitorDB.model("Baby Monitor", babyMonitorSchema);
module.exports = BabyMonitor;
