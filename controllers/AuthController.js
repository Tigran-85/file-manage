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

  async signIn(req, res, next) {
    const data = await this.authService.signIn(req, res, next);
    if (data) {
      res.status(data.statusCode).json(data);
    }
  }

  
  async logout(req, res, next) {
    const data = await this.authService.logout(req, res, next);
    if (data) {
      res.status(data.statusCode).json(data);
    }
  }

  async refresh(req, res, next) {
    const data = await this.authService.refresh(req, res, next);
    if (data) {
      res.status(data.statusCode).json(data);
    }
  }

  async userInfo(req, res, next) {
    const data = await this.authService.userInfo(req, res, next);
    if (data) {
      res.status(data.statusCode).json(data);
    }
  }
}

module.exports = AuthenticationController;