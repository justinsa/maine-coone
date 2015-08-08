'use strict';

module.exports = function (mongoose) {
  var recallSchema = mongoose.Schema({
    Year: { type: Number, index: true },
    Make: { type: String, index: true },
    Model: { type: String, index: true },
    Manufacturer: String,
    Component: String,
    Summary: String,
    Consequence: String,
    Remedy: String,
    Notes: String,
    NHTSACampaignNumber: String,
    ReportReceivedDate: String
  });
  recallSchema.set('autoIndex', false);
  recallSchema.index({ Year: 1, Make: 1, Model: 1 });
  mongoose.model('Recall', recallSchema);
};
