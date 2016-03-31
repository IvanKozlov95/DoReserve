var log = require('../util/log')(module);

require('./User');
require('./Client')
require('./Company');

log.info('Finished loading models');