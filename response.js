const response = (statusCode, data, message, res) => {
    res.json(statusCode, [
      {
        payload: data,
        message,
        metadata: {
          prev: "",
          next: "",
          current: "",
        },
      },
    ]);
  };
  
  //res disini untuk kirim ke luar
  
  module.exports = response;