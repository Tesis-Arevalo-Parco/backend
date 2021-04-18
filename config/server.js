module.exports = ({ env }) => ({
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', 1330),
  admin: {
    auth: {
      secret: env('ADMIN_JWT_SECRET', '503a5adbaa8b03561d59a10c0b5be3d5'),
    },
  },
});
