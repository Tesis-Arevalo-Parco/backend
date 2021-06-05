'use strict';
const {sanitizeEntity} = require('strapi-utils');

module.exports = {
    async find(ctx){    
        const userProjects = await strapi.query('projects').model.find({user:{_id: ctx.state.user.id}});
        const projects = sanitizeEntity(userProjects, { model: strapi.models.projects });
        return projects;
    }
};
