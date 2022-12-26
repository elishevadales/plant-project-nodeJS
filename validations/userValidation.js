const Joi = require("joi");

//sign-in validate
exports.validUser = (_reqBody) => {
    let joiSchema = Joi.object({
      name:Joi.string().min(2).max(25).required(),
      email:Joi.string().min(2).max(99).email().required(),
      password:Joi.string().min(3).max(99).required(),
      img_url:Joi.string().min(0).max(1000).allow(),
      img_url_preview:Joi.string().min(0).max(1000).allow()
    })
  
    return joiSchema.validate(_reqBody);
  }
  
  //login validate
  exports.validLogin = (_reqBody) => {
    let joiSchema = Joi.object({
      email:Joi.string().min(2).max(99).email().required(),
      password:Joi.string().min(3).max(99).required()
    })
  
    return joiSchema.validate(_reqBody);
  }
  
  //update userInfo validate
  exports.validInfo = (_reqBody) => {
    let joiSchema = Joi.object({
      name:Joi.string().min(2).max(25).allow(),
      img_url:Joi.string().min(0).max(1000).allow(),
      img_url_preview:Joi.string().min(0).max(1000).allow()
    })
    return joiSchema.validate(_reqBody);
  }
  
  //change password validate
  exports.validNewPassword = (_reqBody) => {
    let joiSchema = Joi.object({
      email:Joi.string().min(2).max(99).email().required(),
      password:Joi.string().min(3).max(99).required(),
      newPassword:Joi.string().min(3).max(99).required()
    })
    return joiSchema.validate(_reqBody);
  }
  