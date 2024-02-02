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

export const bookValidationRules = [
  body('title')
    .isString()
    .withMessage('Title must be a string')
    .not()
    .isEmpty()
    .withMessage('Title is required'),

  body('author')
    .isString()
    .withMessage('Author must be a string')
    .not()
    .isEmpty()
    .withMessage('Author is required'),

  body('quantity')
    .isInt({ min: 0 })
    .withMessage('Quantity must be a non-negative integer'),

  body('shelfLocation')
    .isString()
    .withMessage('Shelf location must be a string')
    .not()
    .isEmpty()
    .withMessage('Shelf location is required'),
];
