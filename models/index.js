var log = require('../util/log')(module);

require('./Plan');
require('./User');
require('./Client');
require('./Company');
require('./Reservation');

log.info('Finished loading models');