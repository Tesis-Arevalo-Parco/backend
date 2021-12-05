"use strict";

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */
module.exports = {
  async findSafeguardThreats(ctx) {
    const { id } = ctx.params;
    return await strapi.services.safeguards.findSafeguardThreats(id);
  },
};