const msg = require('./message');

function resposeData(res, errorType, message, data = null) {
    var meta = [];

    switch (errorType) {
        case 'success':
            meta = msg.success(message, data);
            break;
        case 'error':
            meta = msg.error(message);
            break;
        case 'token':
            meta = msg.token(message);
            break;
        case 'invalidaccess':
            meta = msg.invalidaccess();
            break;
        default:
            throw new Error('Invalid error type');
    }

    return res.json({ meta });
}

module.exports = resposeData;