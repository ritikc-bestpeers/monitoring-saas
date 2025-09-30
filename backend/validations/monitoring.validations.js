import Joi from 'joi';


const createMonitor = Joi.object({
  name: Joi.string().alphanum().min(3).max(30).required(),
  url: Joi.string().uri().required(),
  frequencySec: Joi.number().integer().min(0).max(86400).default(60),
});


export default {createMonitor}