import Joi from 'joi';


const login = Joi.object({
  email: Joi.required(),
  password: Joi.string().min(3).required(),
});


const register = Joi.object({
  name: Joi.required(),
  email: Joi.required(),
  password: Joi.string().min(3).required(),

});


export default {register, login}