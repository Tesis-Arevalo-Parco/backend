module.exports = ({ env }) => ({
  // ...
  email: {
    provider: 'sendgrid',
    providerOptions: {
      apiKey: env('SENDGRID_API_KEY'),
    },
    settings: {
      defaultFrom: 'marcopparcorp@gmail.com',
      defaultReplyTo: 'marcopparcorp@gmail.com',
      testAddress: 'marcopparcorp@gmail.com',
    },
  },
  // ...
});

