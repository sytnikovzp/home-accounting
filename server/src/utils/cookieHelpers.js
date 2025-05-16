const setRefreshTokenCookie = function (res, refreshToken) {
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    maxAge: 60 * 24 * 60 * 60 * 1000,
  });
};

module.exports = {
  setRefreshTokenCookie,
};
