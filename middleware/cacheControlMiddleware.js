function setCacheControl(req, res, next) {
    // Set Cache-Control headers based on your requirements
    res.setHeader('Cache-Control', 'no-store');
    next();
  }
  
  module.exports = setCacheControl;