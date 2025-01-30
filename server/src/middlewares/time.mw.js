module.exports.getTime = (req, res, next) => {
  req.getTime = new Date().toLocaleString('uk-UA', {
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    month: '2-digit',
    second: '2-digit',
    year: 'numeric',
  });
  next();
};

module.exports.showTime = (req, res, next) => {
  console.log('');
  console.log(
    '============================================================================================'
  );
  console.log(`↓ Date & Time: ${req.getTime} ↓`);
  console.log('=====================================');
  next();
};
