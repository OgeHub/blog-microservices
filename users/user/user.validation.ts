import Joi from "joi";
/** Validates register user data */
const register = Joi.object({
  username: Joi.string().required(),
  name: Joi.string().max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required()
});

/** Validates user login with email data */
const loginWithEmail = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

/** Validates user login with username data */
const loginWithUsername = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required()
});

/** Validates edit user data */
const edit = Joi.object({
  username: Joi.string(),
  name: Joi.string().max(30)
});
export default { register, loginWithEmail, loginWithUsername, edit };
