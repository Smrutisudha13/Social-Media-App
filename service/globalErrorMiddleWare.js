let mode = "dev";
const globalErrorMiddleWare = (err, req, res, next) => {
  if (mode == "dev") {
    devMOde(err, res);
  } else {
    prodMOde(err, res);
  }
};
const prodMOde = (err, res) => {s
  let code = err.statusCode || 500;
  res
    .status(code)
    .json({ statusCode: code, message: err.message});
};
const devMOde = (err, res) => {
  let code = err.statusCode || 500;
  res
    .status(code)
    .json({ statusCode: code, message: err.message, stack: err.stack });
};

export { prodMOde, devMOde, globalErrorMiddleWare };
