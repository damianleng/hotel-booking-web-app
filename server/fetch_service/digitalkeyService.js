const DigitalKeyDetail = require("../data_schema/digitalkeySchema");

const fetchDigitalkey = async () => {
  try {
    const keys = await DigitalKeyDetail.find({});
    if (keys.length === 0) {
      console.log("No digital keys found in the collection.");
    } else {
      console.log("Digital Keys Details:", keys);
    }
  } catch (error) {
    console.error("Error retrieving digital keys details:", error);
  }
};

module.exports = { fetchDigitalkey };