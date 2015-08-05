'use strict';

module.exports = function (mongoose) {
  var recallSchema = mongoose.Schema({
    Year: Number,
    Make: String,
    Model: String,
    Manufacturer: String,
    Component: String,
    Summary: String,
    Consequence: String,
    Remedy: String,
    Notes: String,
    NHTSACampaignNumber: String,
    ReportReceivedDate: String
  });
  mongoose.model('Recall', recallSchema);
};
