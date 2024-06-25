const express = require("express");
const bcrypt = require("bcrypt");

const { babyMonitorRouters } = require("./config");
const { generalError, noAuth } = require("../constants/general");

const { nameLengthValidation } = require("../utils/validation");
const { babyMonitorAuth } = require("../middlewares/authentication");
const { BabyMonitorError } = require("../middlewares/errorHandler");
const { isValidWeight, isValidHeight, isValidAge } = require("../utils/babyMonitorValidations");
const { upload } = require("../middlewares/upload");

const BabyMonitor = require("../database/model/BabyMonitor");

const router = express.Router();

//--------------------------------------------------------------- GET REQUESTS --------------------------------------------------------------- //

router.get(`${babyMonitorRouters.Auth.path}`, babyMonitorAuth, async (req, res, next) => {
  try {
    const { babyMonitor } = req;
    res.send({ babyMonitor });
  } catch (e) {
    next(e);
  }
});

//--------------------------------------------------------------- POST REQUESTS --------------------------------------------------------------- //

router.post(`${babyMonitorRouters.Sign.path}`, async (req, res, next) => {
  try {
    const { motherName, babyName, password } = req.body;
    if (!motherName || !babyName || !password) return next(new BabyMonitorError(generalError, 400));
    if (!nameLengthValidation(motherName) || !nameLengthValidation(babyName)) return next(new BabyMonitorError(generalError, 400));

    const babyMonitor = await BabyMonitor.findOne({ motherName });
    if (babyMonitor) {
      const isMatch = await bcrypt.compare(password, babyMonitor.password);
      if (!isMatch) return next(new BabyMonitorError(noAuth, 401));

      delete babyMonitor.password;
      const token = await babyMonitor.generateToken();
      res.send({ babyMonitor, token });
    } else {
      const newBabyMonitor = new BabyMonitor({ motherName, babyName, password });
      if (!newBabyMonitor) return next(new BabyMonitorError(generalError, 500));

      await newBabyMonitor.save();

      delete newBabyMonitor.password;
      const token = await newBabyMonitor.generateToken();
      res.send({ babyMonitor: newBabyMonitor, token });
    }
  } catch (e) {
    next(e);
  }
});

//--------------------------------------------------------------- PATCH REQUESTS --------------------------------------------------------------- //

router.patch(`${babyMonitorRouters.Information.path}`, babyMonitorAuth, async (req, res, next) => {
  try {
    const { babyMonitor } = req;
    const { weight, height, birthDate } = req.body;

    if (isValidWeight(weight)) babyMonitor.information.weight.push(weight);
    if (isValidHeight(height)) babyMonitor.information.height.push(height);
    if (isValidAge(birthDate)) babyMonitor.information.birthDate = birthDate;

    await babyMonitor.save();

    res.send({ babyMonitor });
  } catch (e) {
    next(e);
  }
});

//--------------------------------------------------------------- PUT REQUESTS --------------------------------------------------------------- //

router.put(`${babyMonitorRouters.Information.path}${babyMonitorRouters.Information.subPaths.avatar}`, babyMonitorAuth, upload.single("avatar"), async (req, res, next) => {
  try {
    const avatar = req.file;
    if (!avatar) return next(new BabyMonitorError(generalError, 500));

    const encodedAvatar = avatar.buffer.toString("base64");
    const { babyMonitor } = req;
    babyMonitor.avatar = encodedAvatar;

    await babyMonitor.save();

    res.send({ babyMonitor });
  } catch (e) {
    console.log(e);
    next(e);
  }
});

module.exports = router;
