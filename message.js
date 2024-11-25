class Message {
    error(message) {
        const error = {
            error: 400,
            msg: message
        };
        return error;
    }

    token(message) {
        const error = {
            error: 401,
            msg: message
        };
        return error;
    }

    invalidaccess() {
        const error = {
            error: 403,
            msg: "Access Denied"
        };
        return error;
    }

    success(message = "", data = "") {
        const meta = {
            error: 200,
            msg: message
        };

        if (data) {
            meta["data"] = data;
        }
        return meta;
    }

}
module.exports = new Message();