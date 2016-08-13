"use strict";

/**
 * Click
 * @description :: Model for storing Click records
 */

module.exports = {
  schema: true,

  attributes: {
    // Fill your attributes here

    origin: {
      type: 'string'
    },

    toJSON() {
      return this.toObject();
    }
  },

  beforeUpdate: (values, next) => next(),
  beforeCreate: (values, next) => next()
};
