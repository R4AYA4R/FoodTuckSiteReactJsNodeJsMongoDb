import { Router } from "express";
import mealController from "../controllers/mealController.js";
import userController from "../controllers/userController.js";
import { body } from "express-validator"; // импортируем функцию body из express-validator для валидации тела запроса,в данном случае импортируем вручную,так как автоматически не импортируется

const router = new Router(); // создаем объект на основе этого класса Router

router.get('/getMeals',mealController.getMeals); // описываем get запрос на сервере,первым параметром указываем url,по которому этот эндпоинт будет отрабатывать,а вторым передаем функцию,которая будет срабатывать на этом эндпоинте(по этому url)

router.get('/getMealsCatalog',mealController.getMealsCatalog); // описываем get запрос на сервере для получения блюд для каталога

router.get('/getMealsCatalog/:id',mealController.getMealId); // описываем get запрос на сервере для получения объекта блюда по id,указываем этот динамический параметр id через : (двоеточие) в url к этому эндпоинту


router.post('/registration',
    body('email').isEmail(),
    body('password').isLength({min:3,max:32}),
    userController.registration); // указываем post запрос для регистрации по маршруту /registration,вторым параметром указываем middleware(функцию body для валидации),указываем в параметре body() названия поля из тела запроса,которое хотим провалидировать(в данном случае это email),и указываем валидатор isEmail() для проверки на email,также валидируем и пароль,но там уже указываем валидатор isLength(),куда передаем объект и поля min(минимальное количество) и max(максимальное) по количеству символов,третьим параметром указываем функцию registration из нашего userController для регистрации,которая будет отрабатывать на этом эндпоинте


export default router;