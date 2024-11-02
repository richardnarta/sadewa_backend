const { verifyToken } = require('../utils/jwt');
const { getToken, extendTokenExpire } = require('../utils/redis');

async function jwtMiddleware(request, h) {
  const requiresAuth = request.route.settings.plugins.auth;
  if (!requiresAuth) {
    return h.continue;
  }

  const authorizationHeader = request.headers.authorization;
  if (!authorizationHeader) {
    return h.response({
        error: true,
        message: "Authorization header tidak ada"
    }).code(401).takeover();
  }

  const token = authorizationHeader.split(' ')[1];
  const decoded = await verifyToken(token);
  if (decoded === null) {
    return h.response({
        error: true,
        message: "Token tidak valid"
    }).code(401).takeover();
  }

  const storedToken = await getToken(`${decoded.id}:token`);
  if (token !== storedToken) {
    return h.response({
        error: true,
        message: "Token tidak sesuai"
    }).code(401).takeover();
  } else if (request.route.path != '/auth/logout') {
    await extendTokenExpire(`${decoded.userId}:token`);
  }

  const requiresRole = request.route.settings.plugins.admin;
  if (requiresRole) {
    if (decoded.type != 'admin') {
      return h.response({
        error: true,
        message: "Forbidden"
      }).code(403).takeover();
    }
  }

  request.auth = {
    userId: decoded.id,
    userType: decoded.type
  };

  return h.continue;
}

module.exports = jwtMiddleware;