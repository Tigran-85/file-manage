const AuthService = require("../services/AuthService");

class AuthenticationController {

  constructor() {
    this.authService = new AuthService()
  }

  async signUp(req, res, next) {
      const data = await this.authService.signUp(req, res, next);
      if (data) {
        res.status(data.statusCode).json(data);
      }
  }

  async signIn(req, res) {
    const data = await this.authService.signIn(req);
    res.status(data.statusCode).json(data);
  }

  
  async resendVerificationToken(req, res) {
    const data = await this.authService.resendVerificationToken(req);
    res.status(data.statusCode).json(data);
  }
}

module.exports = AuthenticationController;