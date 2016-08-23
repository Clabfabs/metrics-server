"use strict";

/**
 * ClickController
 * @description :: Server-side logic for ...
 */

var _ = require('lodash');

var cost_amazonec2_us_tier1 = '0.02';
var cost_amazonec2_us_tier2 = '0.5';
var cost_amazonec2_eu_tier1 = '0.02';
var cost_amazonec2_eu_tier2 = '0.5';

var HIGH = false;

var costs = '# HELP cost_amazonec2_us_tier1 Hourly cost for a AWS, US and tier 1 machine.\n' +
  '# TYPE cost_amazonec2_us_tier1 gauge\n' +
  'cost_amazonec2_us_tier1 %COST1%\n' +
  '# HELP cost_amazonec2_us_tier2 Hourly cost for a AWS, US and tier 2 machine.\n' +
  '# TYPE cost_amazonec2_us_tier2 gauge\n' +
  'cost_amazonec2_us_tier2 %COST2%\n' +
  '# HELP cost_amazonec2_us_tier3 Hourly cost for a AWS, US and tier 3 machine.\n' +
  '# TYPE cost_amazonec2_us_tier3 gauge\n' +
  'cost_amazonec2_us_tier3 1.0\n' +
  '# HELP cost_amazonec2_eu_tier1 Hourly cost for a AWS, EU and tier 1 machine.\n' +
  '# TYPE cost_amazonec2_eu_tier1 gauge\n' +
  'cost_amazonec2_eu_tier1 %COST3%\n' +
  '# HELP cost_amazonec2_eu_tier2 Hourly cost for a AWS, EU and tier 2 machine.\n' +
  '# TYPE cost_amazonec2_eu_tier2 gauge\n' +
  'cost_amazonec2_eu_tier2 %COST4%\n' +
  '# HELP cost_amazonec2_eu_tier3 Hourly cost for a AWS, EU and tier 3 machine.\n' +
  '# TYPE cost_amazonec2_eu_tier3 gauge\n' +
  'cost_amazonec2_eu_tier3 1.0\n' +
  '# HELP cost_digitalocean_us_tier1 Hourly cost for a DO, US and tier 1 machine.\n' +
  '# TYPE cost_digitalocean_us_tier1 gauge\n' +
  'cost_digitalocean_us_tier1 0.01\n' +
  '# HELP cost_digitalocean_us_tier2 Hourly cost for a DO, US and tier 2 machine.\n' +
  '# TYPE cost_digitalocean_us_tier2 gauge\n' +
  'cost_digitalocean_us_tier2 0.02\n' +
  '# HELP cost_digitalocean_us_tier3 Hourly cost for a DO, US and tier 3 machine.\n' +
  '# TYPE cost_digitalocean_us_tier3 gauge\n' +
  'cost_digitalocean_us_tier3 0.04\n' +
  '# HELP cost_digitalocean_eu_tier1 Hourly cost for a DO, EU and tier 1 machine.\n' +
  '# TYPE cost_digitalocean_eu_tier1 gauge\n' +
  'cost_digitalocean_eu_tier1 0.01\n' +
  '# HELP cost_digitalocean_eu_tier2 Hourly cost for a DO, EU and tier 2 machine.\n' +
  '# TYPE cost_digitalocean_eu_tier2 gauge\n' +
  'cost_digitalocean_eu_tier2 0.02\n' +
  '# HELP cost_digitalocean_eu_tier3 Hourly cost for a DO, EU and tier 3 machine.\n' +
  '# TYPE cost_digitalocean_eu_tier3 gauge\n' +
  'cost_digitalocean_eu_tier3 0.04\n';


module.exports = {

  metrics: function (req, res) {
    Click.find()
      .then(function (clicks) {
        var grouped = _.groupBy(clicks, function (click) {
          return click.origin;
        });
        var multiplier = Number.parseInt(sails.config.CLICK_MULTIPLIER);
        var counts = _.map(grouped, function (value, key) {
          return {origin: key, count: value.length * multiplier};
        });
        var result = costs.replace('%COST1%', cost_amazonec2_us_tier1)
                          .replace('%COST2%', cost_amazonec2_us_tier2)
                          .replace('%COST3%', cost_amazonec2_eu_tier1)
                          .replace('%COST4%', cost_amazonec2_eu_tier2);
        _.forEach(counts, function (count) {
          result += '# HELP click_count_' + count.origin + ' The total number of clicks from ' + count.origin + '.\n# TYPE click_count_' + count.origin + ' counter\n';
          result += 'click_count_' + count.origin + ' ' + count.count + '\n';
        });
        res.set('Content-Type', 'text/plain');
        res.send(result);
      })
      .catch(function (err) {
        res.serverError(err);
      })
  },

  getMultiplier: function (req, res) {
    res.ok(sails.config.CLICK_MULTIPLIER);
  },

  setMultiplier: function (req, res) {
    var multiplier = Number.parseInt(req.param('multiplier'));

    if (multiplier && multiplier > 0) {
      sails.config.CLICK_MULTIPLIER = multiplier;
      return res.ok();
    } else {
      return res.badRequest();
    }
  },

  setHighCosts: function (req, res) {
    cost_amazonec2_us_tier1 = '1.0';
    cost_amazonec2_us_tier2 = '1.0';
    cost_amazonec2_eu_tier1 = '1.0';
    cost_amazonec2_eu_tier2 = '1.0';
    HIGH = true;
    res.ok();
  },

  setLowCosts: function (req, res) {
    cost_amazonec2_us_tier1 = '0.02';
    cost_amazonec2_us_tier2 = '0.5';
    cost_amazonec2_eu_tier1 = '0.02';
    cost_amazonec2_eu_tier2 = '0.5';
    HIGH = false;
    res.ok();
  }

};
