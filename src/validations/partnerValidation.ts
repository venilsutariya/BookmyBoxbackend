import { body } from 'express-validator';

export const registrationPartnerValidationRules = [
    body('adminName' , 'adminName must be at least 3 to 20 characters long').isLength({ min: 3 , max : 20 }),
    body('email' , 'Invalid email address').isEmail(),
    body('password' , 'Password must be at least 5 to 25 characters long').isLength({ min: 5 , max : 25 }),
  ];

export const loginPartnerValidationRules = [
  body('email' , 'Invalid email address').isEmail(),
  body('password' , 'Password must be at least 5 to 25 characters long').isLength({ min: 5 , max : 25 }),
]

export const updatePartnerValidationRules = [
  body('adminName' , 'adminName must be at least 3 to 20 characters long').isLength({ min: 3 , max : 20 }),
  body('email' , 'Invalid email address').isEmail(),
]

export const forgotPasswordValidationRules = [
  body('email' , 'Invalid email address').isEmail(),
]

export const resetPasswordValidationRules = [
  body('password' , 'Password must be at least 5 to 25 characters long').isLength({ min: 5 , max : 25 }),
]