"use strict";

/**
 * ClickController
 * @description :: Server-side logic for ...
 */

var _ = require('lodash');

var description = '# HELP click_count The total number of clicks.\n# TYPE click_count counter\n';

module.exports = {

  getCount: function (req, res) {
    Click.find()
      .then(function(clicks) {
        var result = _.groupBy(clicks, function(click) {
          return click.origin;
        });
        res.ok(result);
      })
      .catch(function(err) {
        res.serverError(err);
      })
  },

  metrics: function(req, res) {
    Click.find()
      .then(function(clicks) {
        var grouped = _.groupBy(clicks, function(click) {
          return click.origin;
        });
        var multiplier = Number.parseInt(sails.config.CLICK_MULTIPLIER);
        var counts = _.map(grouped, function(value, key) {
          return {origin: key, count: value.length * multiplier};
        });
        var result = '';
        _.forEach(counts, function(count) {
          result += '# HELP click_count_' + count.origin + ' The total number of clicks from ' + count.origin + '.\n# TYPE click_count_' + count.origin + ' counter\n';
          result += 'click_count_' + count.origin + ' ' + count.count + '\n';
        });
        res.set('Content-Type', 'text/plain');
        res.send(result);
      })
      .catch(function(err) {
        res.serverError(err);
      })
  },

  getMultiplier: function(req, res) {
    res.ok(sails.config.CLICK_MULTIPLIER);
  },

  setMultiplier: function(req, res) {
    var multiplier = Number.parseInt(req.param('multiplier'));

    if (multiplier && multiplier > 0) {
      sails.config.CLICK_MULTIPLIER = multiplier;
      return res.ok();
    } else {
      return res.badRequest();
    }
  }

};
