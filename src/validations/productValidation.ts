import {body} from 'express-validator';

export const addProductValidationRules = [
    body('boxName' , 'boxName must be between 3 to 20').isLength({min : 3 , max : 20}),
];

export const editProductValidationRules = [
    body('boxName' , 'boxName must be between 3 to 20').isLength({min : 3 , max : 20}),
];