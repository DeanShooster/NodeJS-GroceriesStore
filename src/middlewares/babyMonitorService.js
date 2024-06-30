const { isSameDay } = require("../utils/date");

const addItemToMonitor = async (req, res, next) => {
  try {
    const { babyMonitor } = req;

    if (req.body.time) {
      const { time, isPee, note } = req.body;
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
    }
    //TODO Sleep logics

    await babyMonitor.save();
    next();
  } catch (e) {
    next(e);
  }
};

module.exports = { addItemToMonitor };
