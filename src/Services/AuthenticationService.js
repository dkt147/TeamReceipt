import authRepo from "../repositories/Authentication-repository.js";
import bcrypt from "bcrypt";
class AuthService {
  constructor() {
    this.authRepository = new authRepo();
  }
  async signup(data) {
    try {
      function generateUserName() {
        const randomFourDigitNumber = Math.floor(1000 + Math.random() * 9000);
        return `user${randomFourDigitNumber}`;
      }
      function hashPassword(password) {
        const saltRounds = 10;
        return bcrypt.hashSync(password, saltRounds);
      }
      if (data.email === "" || data.password === "") {
        const error = errorHandler("Invalid email or password", 404);
        throw error;
      }
      const response = await this.authRepository.createUser(
        data,
        generateUserName,
        hashPassword
      );
      console.log(response);
      return response;
    } catch (err) {
      return err;
    }
  }

  async signin(data) {
    const response = await this.authRepository.signin(data);
    console.log(response);
    return response;
  }

  async passwordRecovery(data) {
    const response = await this.authRepository.resetPassword(data);
    console.log(response);
    return response;
  }
}

export default AuthService;
