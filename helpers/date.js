const moment = require('moment-timezone');
function nowDateIndo() {
    return moment(Date.now()).tz("Asia/Jakarta").format('YYYY/MM/DD HH:mm:ss ZZ');
}

module.exports = {
    nowDateIndo,
}