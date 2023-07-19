import Joi from "joi";
import { promisify } from "util";

import Account from "../model/account";
import { generateToken } from "../helpers/tokenHelper";
import { isAdmin } from "../helpers/authorizationHelper";
import db from "./db";

const validate = promisify(Joi.validate);
const emailValidator = Joi.string().email();

class AuthenticationController {
  async authenticate(req, res) {
    const { email, password } = req.body;


    db.raw('select 1+1 as result')
      .then(() => {
        console.log('Database connection is established');
      })
      .catch((err) => {
        console.error('Database connection could not be established', err);
      });
    console.log("email", email);
    console.log("ATTEMPTING AUTHENTICATION!")

    // email and password are required
    if (!email || !password)
      return res.status(400).json({ message: "parameters are missing" });

    // validate email
    try {
      console.log("VALIDATING 1")
      await validate(email, emailValidator);
    } catch (validationError) {
      return res.status(422).json({ message: "invalid email" });
    }

    // check if account with email exists
    const [username, domain] = email.split("@");
    const account = (await Account.getAccount({ username, domain }))[0];

    if (!account) {
      return res.status(401).json({ message: `credentials mismatch` });
    }

    // check passwords
    console.log("We are now comparing passwords!")
    const authenticated = Account.comparePasswords(password, account.password);
    console.log("Result" + authenticated)
    if (!authenticated) {
      return res.status(401).json({ message: `credentials mismatch` });
    }
    console.log("Generating JWT")
    // generate JWT
    const token = await generateToken({ email });
    res.json({ token, admin: isAdmin(email), id: account.id });
  }
}

export default new AuthenticationController();
