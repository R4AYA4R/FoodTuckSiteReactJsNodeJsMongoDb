import { Router } from "express";
import mealController from "../controllers/mealController.js";

const router = new Router(); // создаем объект на основе этого класса Router

router.get('/getMeals',mealController.getMeals); // описываем get запрос на сервере,первым параметром указываем url,по которому этот эндпоинт будет отрабатывать,а вторым передаем функцию,которая будет срабатывать на этом эндпоинте(по этому url)

router.get('/getMealsCatalog',mealController.getMealsCatalog); // описываем get запрос на сервере для получения блюд для каталога

router.get('/getMealsCatalog/:id',mealController.getMealId); // описываем get запрос на сервере для получения объекта блюда по id,указываем этот динамический параметр id через : (двоеточие) в url к этому эндпоинту

export default router;