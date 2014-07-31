'use strict';
exports.handle = function (req, res) {
  var id = req.params.id;
  var action = req.params.action;

  res.json({message: "I am Pi!"});
};