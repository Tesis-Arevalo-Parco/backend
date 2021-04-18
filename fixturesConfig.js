const Fixtures = require('node-mongodb-fixtures');
require('dotenv').config();

const fixtures = new Fixtures({
  dir: 'fixtures'
});
fixtures
  .connect(`mongodb://${process.env.DATABASE_HOST || 'localhost'}:${process.env.DATABASE_PORT || 27017}/digital-retail-api`)
  .then(() => fixtures.unload())
  .then(() => fixtures.load())
  .catch(e => console.error(e))
  .finally(() => fixtures.disconnect());
