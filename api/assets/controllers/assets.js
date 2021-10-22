'use strict';

module.exports = {
    async create(ctx) {
        const assetsData = ctx.request.body;
        const asset = await strapi.services.assets.create(assetsData);
        await strapi.services.threats.create({
            threats: assetsData?.threats || [],
            project: asset?.project.id,
            asset: asset?.id,
            probability: [],
            availability: [],
            integrity: [],
            confidentiality: [],
            authenticity: [],
            traceability: [],
        }) 
        return asset;
    },
    async update(ctx) {
        const assetsData = ctx.request.body;
        const asset = await strapi.services.assets.update({ _id: ctx.params.id }, assetsData);
        await strapi.services.threats.update({ _id: asset?.threat?.id }, {
            threats: assetsData?.threats || [],
        }) 
        return asset;  
    }
};
