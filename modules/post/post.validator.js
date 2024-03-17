import joi from "joi";

// export const addPost = {
//     body : joi.object().required().keys({
//         postBody : joi.string().required()
//     }),
//     headers: joi.object().required().keys({
//         authorization : joi.string().required()
//     }).options({allowUnknown: true})
// }
export const updatePost = {
  body: joi.object().required().keys({
    postBody: joi.string().required(),
  }),
  params: joi
    .object()
    .required()
    .keys({
      id: joi
        .string()
        .pattern(new RegExp(/^[a-fA-F0-9]{24}$/))
        .required(),
    }),
  headers: joi
    .object()
    .required()
    .keys({
      authorization: joi.string().required(),
    })
    .options({ allowUnknown: true }),
};
export const deletePost = {
  params: joi
    .object()
    .required()
    .keys({
      id: joi
        .string()
        .pattern(new RegExp(/^[a-fA-F0-9]{24}$/))
        .required(),
    }),
    headers: joi
    .object()
    .required()
    .keys({
      authorization: joi.string().required(),
    })
    .options({ allowUnknown: true }),
};
export const likePost = {
  params: joi
    .object()
    .required()
    .keys({
      id: joi
        .string()
        .pattern(new RegExp(/^[a-fA-F0-9]{24}$/))
        .required(),
    }),
    headers: joi
    .object()
    .required()
    .keys({
      authorization: joi.string().required(),
    })
    .options({ allowUnknown: true }),
};
export const unLikePost = {
  params: joi
    .object()
    .required()
    .keys({
      id: joi
        .string()
        .pattern(new RegExp(/^[a-fA-F0-9]{24}$/))
        .required(),
    }),
    headers: joi
    .object()
    .required()
    .keys({
      authorization: joi.string().required(),
    })
    .options({ allowUnknown: true }),
};
export const getAllposts = {
    query: joi
      .object()
      .required()
      .keys({
        page: joi.number().integer().max(50),
        size: joi.number().integer().max(15),
      }),
  };
export const getPostsOfUser = {
    query: joi
      .object()
      .required()
      .keys({
        page: joi.number().integer().max(50),
        size: joi.number().integer().max(15),
      }),
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
  