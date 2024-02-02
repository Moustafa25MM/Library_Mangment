import { body } from 'express-validator';

export const userValidationRules = [
  body('name')
    .isString()
    .withMessage('Name must be a string')
    .not()
    .isEmpty()
    .withMessage('Name is required'),

  body('email').isEmail().withMessage('Must be a valid email address'),

  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),

  body('role')
    .optional()
    .isIn(['BORROWER', 'ADMIN'])
    .withMessage('Invalid role specified'),

  body('registeredDate')
    .optional()
    .isISO8601()
    .withMessage('Registered date must be a valid ISO 8601 date'),
];
