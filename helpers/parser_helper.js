
const parserHelper = {

  headerParser(req) {
    const error = {
      status: 400,
      message: 'Bad Request',
    };
    if (req.headers && req.headers.authorization) {
      const parts = req.headers.authorization.split(' ');

      if (parts.length === 2 && parts[0] === 'Bearer') {
        return parts[1];
      } else {
        return error;
      }
    } else {
      return error;
    }
  },
};

export default parserHelper;
