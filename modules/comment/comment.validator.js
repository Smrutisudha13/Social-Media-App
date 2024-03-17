import joi from "joi";

export const addComment = {
  body: joi.object().required().keys({
    commentBody: joi.string().required(),
  }),
  headers: joi
    .object()
    .required()
    .keys({
      authorization: joi.string().required(),
    })
    .options({ allowUnknown: true }),
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
export const updateComment = {
  body: joi.object().required().keys({
    commentBody: joi.string().required(),
  }),
  headers: joi
    .object()
    .required()
    .keys({
      authorization: joi.string().required(),
    })
    .options({ allowUnknown: true }),
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
export const deleteComment = {
  headers: joi
    .object()
    .required()
    .keys({
      authorization: joi.string().required(),
    })
    .options({ allowUnknown: true }),
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
export const likeComment = {
  headers: joi
    .object()
    .required()
    .keys({
      authorization: joi.string().required(),
    })
    .options({ allowUnknown: true }),
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
export const replayOnComment = {
  body: joi.object().required().keys({
    commentBody: joi.string().required(),
  }),
  headers: joi
    .object()
    .required()
    .keys({
      authorization: joi.string().required(),
    })
    .options({ allowUnknown: true }),
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
export const replayOnReplay = {
  body: joi.object().required().keys({
    commentBody: joi.string().required(),
  }),
  headers: joi
    .object()
    .required()
    .keys({
      authorization: joi.string().required(),
    })
    .options({ allowUnknown: true }),
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
export const getCommentInfo = {
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