var log = require('../util/log')(module);

require('./Reservation');
require('./Plan');
require('./User');
require('./Client');
require('./Company');

log.info('Finished loading models');