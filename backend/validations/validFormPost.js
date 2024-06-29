import { body } from 'express-validator';

export const validaciaForm = [
    body('nameUser', 'Имя слшиком короткое').isLength({ min: 2 }),
    body('emailUser', 'Поле с почтой не должно быть пустым').isEmail(),
    body('messageUser', 'Поле с текстом не должно быть пустым').isLength({ min: 1 })
];