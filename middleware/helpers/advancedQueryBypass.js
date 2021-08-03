const advancedQueryBypass = (query, res, next) => {
  console.log("BYPASS QUERY MIDDLEWARE".red)
  query.exec((err, results) => {
    if (err) {
      return res.status(400).send({
        success: false,
        error_message: err.message,
        err_name: err.name,
      });
    }

    if (results) {
      const size = new TextEncoder().encode(JSON.stringify(results)).length;
      const kb = (size / 1025).toFixed(2);
      const mb = (kb / 1025).toFixed(2);
      res.advancedResults = {
        success: true,
        size,
        kb,
        mb,
        data: results,
      };
      return next();
    }

    return res.status(500).send({
      success: false,
      error_message: "Your request could not be processed.",
    });
  });
};

module.exports = advancedQueryBypass;
