const { BabyMonitorError } = require("./errorHandler");
const { isSameDay } = require("../utils/date");
const { generalError } = require("../constants/general");

const addItemToMonitor = async (req, res, next) => {
  try {
    const { babyMonitor } = req;

    if (req.body.isPee !== undefined) {
      // PEE/POOP LOGIC
      const { time, isPee, note } = req.body;
      if (!time || isPee === undefined) return next(new BabyMonitorError(generalError, 400));
      const index = babyMonitor.monitor.findIndex((item) => isSameDay(new Date(item.date), new Date(time)));
      if (index > -1) {
        babyMonitor.monitor[index].diapers.push({
          time,
          isPee,
          note,
        });
      } else {
        const newMonitor = {
          date: new Date(),
          feeding: [],
          diapers: [
            {
              time,
              isPee,
              note,
            },
          ],
          sleep: [],
        };
        babyMonitor.monitor.push(newMonitor);
      }
    } else if (req.body.feed !== undefined) {
      // Bottle logics
      const { feed, time, note } = req.body;
      if (feed === undefined || !time) return next(new BabyMonitorError(generalError, 400));
      const index = babyMonitor.monitor.findIndex((item) => isSameDay(new Date(item.date), new Date(time)));
      if (index > -1) {
        babyMonitor.monitor[index].feeding.push({
          isBottle: feed === "BOTTLE",
          isRealFood: feed === "REAL_FOOD",
          time,
          note,
        });
      } else {
        const newMonitor = {
          date: new Date(),
          sleep: [],
          feeding: [
            {
              isBottle: feed === "BOTTLE",
              isRealFood: feed === "REAL_FOOD",
              time,
              note,
            },
          ],
          diapers: [],
        };
        babyMonitor.monitor.push(newMonitor);
      }
    } else {
      // SLEEP LOGIC
      const { startTime, endTime, note } = req.body;
      if (!startTime && !endTime) return next(new BabyMonitorError(generalError, 400));
      const index = babyMonitor.monitor.findIndex((item) => isSameDay(new Date(item.date), new Date(startTime || endTime)));
      if (index > -1) {
        const { sleep } = babyMonitor.monitor[index];
        if (sleep.length === 0) {
          if (endTime) {
            const yesterdayLastSleepItem = babyMonitor.monitor[index - 1]?.sleep[babyMonitor.monitor[index - 1]?.sleep?.length - 1];
            if (yesterdayLastSleepItem && yesterdayLastSleepItem.startTime && !yesterdayLastSleepItem.endTime) {
              yesterdayLastSleepItem.endTime = endTime;
              yesterdayLastSleepItem.note = note;
            } else return next(new BabyMonitorError(generalError, 400));
          }
          sleep.push({
            startTime,
            note,
          });
        } else {
          const lastSleepItem = sleep[sleep.length - 1];
          if (startTime) {
            if (lastSleepItem.startTime && lastSleepItem.endTime) sleep.push({ startTime, note });
            else return next(new BabyMonitorError(generalError, 400));
          } else {
            if (lastSleepItem.startTime && !lastSleepItem.endTime) {
              lastSleepItem.endTime = endTime;
              lastSleepItem.note = note;
            } else return next(new BabyMonitorError(generalError, 400));
          }
        }
      } else {
        if (endTime) return next(new BabyMonitorError(generalError, 400));
        const newMonitor = {
          date: new Date(),
          feeding: [],
          diapers: [],
          sleep: [
            {
              startTime,
              note,
            },
          ],
        };
        babyMonitor.monitor.push(newMonitor);
      }
    }

    await babyMonitor.save();
    next();
  } catch (e) {
    next(e);
  }
};

module.exports = { addItemToMonitor };
