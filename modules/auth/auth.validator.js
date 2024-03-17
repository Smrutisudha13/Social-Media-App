import joi from 'joi'
export const signup = {
  body: joi
    .object()
    .required()
    .keys({
      name: joi
        .string()
        .pattern(new RegExp(/[A-Z][a-zA-Z][^#&<>\"~;$^%{}?]{1,20}$/))
        .required(),
      email: joi
        .string()
        .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
        .required()
        .messages({
          "any.required": "please enter your email",
          "string.empty": "email can not be empty",
          "string.base": "please enter valid string email",
        }),
      gender: joi.string().valid("male", "fmale"),
      password: joi
        .string()
        .pattern(
          new RegExp(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/
          )
        )
        .required(),
      cPassword: joi.string().valid(joi.ref("password")).required(),
      age: joi.number().min(16).max(100),
    }),
};
export const confirmEmail = {
  params: joi.object().required().keys({
    token: joi.string().required(),
  }),
};
export const refreshToken = {
  params: joi.object().required().keys({
    token: joi.string().required(),
  }),
};
export const signin = {
    body: joi
      .object()
      .required()
      .keys({
        email: joi
          .string()
          .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
          .required()
          .messages({
            "any.required": "please enter your email",
            "string.empty": "email can not be empty",
            "string.base": "please enter valid string email",
          }),
        password: joi
          .string()
          .pattern(
            new RegExp(
              /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/
            )
          )
          .required(),
      }),
  };