import joi from "joi";

export const shareProfile = {
  params: joi
    .object()
    .required()
    .keys({
      id: joi
        .string()
        .pattern(new RegExp(/^[a-fA-F0-9]{24}$/))
        .required(),
    }),
};
export const updateProfile = {
  body: joi
    .object()
    .required()
    .keys({
      name: joi
        .string()
        .pattern(new RegExp(/[A-Z][a-zA-Z][^#&<>\"~;$^%{}?]{1,20}$/)),
      email: joi
        .string()
        .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
        .messages({
          "any.required": "please enter your email",
          "string.empty": "email can not be empty",
          "string.base": "please enter valid string email",
        }),
      cPassword: joi
        .string()
        .pattern(
          new RegExp(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/
          )
        )
        .required(),
      age: joi.number().min(16).max(100),
    }),
  headers: joi
    .object()
    .required()
    .keys({
      authorization: joi.string().required(),
    })
    .options({ allowUnknown: true }),
};
export const softDelete = {
  headers: joi
    .object()
    .required()
    .keys({
      authorization: joi.string().required(),
    })
    .options({ allowUnknown: true }),
};
export const addProfilePic = {
  headers: joi
    .object()
    .required()
    .keys({
      authorization: joi.string().required(),
    })
    .options({ allowUnknown: true }),
};
export const addProfileCov = {
  headers: joi
    .object()
    .required()
    .keys({
      authorization: joi.string().required(),
    })
    .options({ allowUnknown: true }),
};
export const getAllUsers = {
  query: joi
    .object()
    .required()
    .keys({
      page: joi.number().integer().max(50),
      size: joi.number().integer().max(15),
    }),
};
