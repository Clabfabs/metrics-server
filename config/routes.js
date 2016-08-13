"use strict";

/**
 * Route Mappings
 *
 * Your routes map URLs to views and controllers
 */

module.exports = {
  routes: {

    'GET /metrics': 'ClickController.metrics',
    'GET /getMultiplier': 'ClickController.getMultiplier',
    'PUT /setMultiplier': 'ClickController.setMultiplier'

  }
};
