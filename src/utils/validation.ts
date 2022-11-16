import { Joi, celebrate, Segments } from 'celebrate';

export const EMAIL_VALIDATION = Joi.string().required().email().messages({
  'any.required': 'Email обязателен',
});
export const PASSWORD_VALIDATION = Joi.string().required().messages({
  'any.required': 'Пароль обязателен',
});
export const NAME_VALIDATION = Joi.string().min(2).max(30).messages({
  'string.min': 'Имя не может быть короче 2 символов',
  'string.max': 'Имя не может быть длиннее 30 символов',
  'string.empty': 'Имя не может быть пустым',
});
export const ABOUT_VALIDATION = Joi.string().min(2).max(30).messages({
  'string.min': 'About не может быть короче 2 символов',
  'string.max': 'About не может быть длиннее 30 символов',
  'string.empty': 'About не может быть пустым',
});
export const AVATAR_VALIDATION = Joi.string();
export const LINK_VALIDATION = Joi.string().required().messages({ 'any.required': 'Ссылка обязательна' });

export const signinValidation = celebrate({
  [Segments.BODY]: Joi.object().keys({
    email: EMAIL_VALIDATION,
    password: PASSWORD_VALIDATION,
  }),
});

export const createUserValidation = celebrate({
  [Segments.BODY]: Joi.object().keys({
    email: EMAIL_VALIDATION,
    password: PASSWORD_VALIDATION,
    name: NAME_VALIDATION,
    about: ABOUT_VALIDATION,
    avatar: AVATAR_VALIDATION,
  }),
});

export const getUserValidation = celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    userId: Joi.string().required(),
  }),
});

export const updateUserValidation = celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: NAME_VALIDATION,
    about: ABOUT_VALIDATION,
  }),
});

export const updateUserAvatarValidation = celebrate({
  [Segments.BODY]: Joi.object().keys({
    avatar: AVATAR_VALIDATION,
  }),
});

export const createCardValidation = celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: NAME_VALIDATION,
    link: LINK_VALIDATION,
  }),
});

export const cardValidation = celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    cardId: Joi.string().required(),
  }),
});
