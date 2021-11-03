"use strict";

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

module.exports = {
  async find(ctx) {
    return strapi.services.projects.find(ctx);
  },
  async findOne(ctx) {
    return strapi.services.projects.findOne({ _id: ctx.params.id }, [
      {
        path: "assets",
        populate: {
          path: "threat",
        },
      },
      {
        path: "dependency",
      },
      {
        path: "safeguards",
      },
    ]);
  },
};
