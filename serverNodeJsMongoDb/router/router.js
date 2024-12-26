import { Router } from "express";
import mealController from "../controllers/mealController.js";
import userController from "../controllers/userController.js";
import { body } from "express-validator"; // импортируем функцию body из express-validator для валидации тела запроса,в данном случае импортируем вручную,так как автоматически не импортируется

const router = new Router(); // создаем объект на основе этого класса Router

router.get('/getMeals',mealController.getMeals); // описываем get запрос на сервере,первым параметром указываем url,по которому этот эндпоинт будет отрабатывать,а вторым передаем функцию,которая будет срабатывать на этом эндпоинте(по этому url)

router.get('/getMealsCatalog',mealController.getMealsCatalog); // описываем get запрос на сервере для получения блюд для каталога

router.get('/getMealsCatalog/:id',mealController.getMealId); // описываем get запрос на сервере для получения объекта блюда по id,указываем этот динамический параметр id через : (двоеточие) в url к этому эндпоинту


router.post('/createComment',userController.createComment); // создаем post запрос на создание комментария в базе данных

router.get('/getCommentsForProduct',userController.getCommentsForProduct); // создаем get запрос на получение комментариев для определенного товара

router.put('/updateProductRating',userController.updateProductRating); // создаем put запрос для обновления рейтинга товара 


router.post('/registration',
    body('email').isEmail(),
    body('password').isLength({min:3,max:32}),
    userController.registration); // указываем post запрос для регистрации по маршруту /registration,вторым параметром указываем middleware(функцию body для валидации),указываем в параметре body() названия поля из тела запроса,которое хотим провалидировать(в данном случае это email),и указываем валидатор isEmail() для проверки на email,также валидируем и пароль,но там уже указываем валидатор isLength(),куда передаем объект и поля min(минимальное количество) и max(максимальное) по количеству символов,третьим параметром указываем функцию registration из нашего userController для регистрации,которая будет отрабатывать на этом эндпоинте


router.post('/login',userController.login); // указываем post запрос для логина

router.post('/logout',userController.logout);  // указываем post запрос для выхода из аккаунта

router.get('/refresh',userController.refresh); // указываем get запрос для перезаписывания access токена,если он умер(то есть здесь будем отправлять refresh токен и получать обратно пару access и refresh токенов),если у access токена время действия закончилось,то мы с фронтенда делаем запрос на /refresh,перезаписываем там access и refresh токены,и тогда,если аккаунт украли и у мошенника закончилсоь время жизни access токена,то делается запрос на /refresh,но уже у него access и refresh токены не действительны и он не может получить доступ к сервисам,authMiddleware нужен,чтобы защитить пользователя от мошенников,так как,когда истекает access токен,идет запрос на refresh токен,и после этого обновляется и access токен,и refresh токен,соответственно мошенник уже не может получить доступ к этому эндпоинту(маршруту по url),так как его refresh и access токен будут уже не действительны,а функция checkAuth нужна для проверки только refresh токена(то есть,если пользователь вообще не пользовался сервисом какое-то время(которое указали у жизни refresh токена),нужно именно не переобновлять страницы и тд,чтобы не шел запрос на /refresh(иначе refresh токен будет переобновляться с каждым запросом,нужно,чтобы refresh токен истек до запроса на /refresh, также функция checkAuth на фронтенде будет делать запрос на /refresh и тем самым будет проверять,действует ли еще refresh токен пользователя и если еще действует,то обновлять refresh и access токены),то его refresh токен истечет и его выкинет с аккаунта после обновления страницы,но если пользователь будет использовать в данном случае,например,функцию authMiddleware,то его access токен и refresh токен будут заново перезаписаны и таймер на время жизни refresh токена будет обновлен и заново запущен,поэтому его не будет выкидывать из аккаунта) 



export default router;