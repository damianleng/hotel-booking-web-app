const HousekeepingDetail = require("../data_schema/housekeepingSchema");

const fetchHousekeeping = async () => {
  try {
    const housekeeping = await HousekeepingDetail.find({});
    if (housekeeping.length === 0) {
      console.log("No house keeping found in the collection.");
    } else {
      console.log("House Keeping Details:", housekeeping);
    }
  } catch (error) {
    console.error("Error retrieving house keeping details:", error);
  }
};

module.exports = { fetchHousekeeping };