import { validationResult } from "express-validator";
import roleModel from "../models/roleModel.js";
import userModel from "../models/userModel.js";
import ApiError from "../exceptions/ApiError.js";
import userService from "../service/userService.js";
import commentModel from "../models/commentModel.js";
import mealModel from "../models/mealModel.js";

import * as path from 'path'; // импортируем все из модуля path для работы с файлами(в данном случае импортируем вручную и указываем *,то есть берем все из модуля path и указываем название этому всему как path)

import fs from 'fs'; // импортируем fs для работы с файлами

// создаем класс для UserController,где будем описывать функции для эндпоинтов
class UserController{

    // указываем фукнцию для эндпоинта регистрации,в параметре указываем req(запрос),res(ответ) и next(мидлвэир)
    async registration(req,res,next){

        try{

            const errors = validationResult(req); // используем validationResult и передаем туда запрос(req),из него автоматически достанутся необходимые поля и провалидируются,и помещаем ошибки валидации в переменную errors

            // если errors.isEmpty() false,то есть массив ошибок не пустой
            if(!errors.isEmpty()){
                return next(ApiError.BadRequest('Ошибка валидации при регистрации'),errors.array()); // возвращаем функцию next(),используем здесь return,чтобы код ниже не читался,если была эта ошибка,вызываем функцию next()(параметр этой функции registration),то есть если была ошибка при валидации,то передаем ее в наш error-middleware,и в параметре next() указываем наш ApiError и у него указываем функцию BadRequest(она вернет объект,созданный на основе класса ApiError),куда передаем сообщение для ошибки и массив ошибок,полученных при валидации с помощью errors.array()
            }

            const {email,password,userName} = req.body; // вытаскиваем(деструктуризируем) из тела запроса поля email, password и userName

            const userData = await userService.registration(email,password,userName); // так как функция registration из нашего userService асинхронная,то указываем await,вызываем нашу функцию registration из userService,передаем туда email, password и userName,в переменную userData помещаем токены и информацию о пользователе(это возвращает наша функция registration() из userService)

            res.cookie('refreshToken',userData.refreshToken,{maxAge:30 * 24 * 60 * 60 * 1000,httpOnly:true}); // будем хранить refresh токен в cookie,вызываем функцю cookie() у res и передаем первым параметром название,по которому этот cookie будет храниться,а вторым параметром передаем сам cookie,(данные,которые будут храниться в cookie,то есть наш рефреш токен),третьим параметром передаем объект опций,указываем maxAge:30 дней умножаем на 24 часа * на 60 минут * 60 секунд * 1000 миллисекунд(это значит,что этот cookie будет жить 30 дней,указываем таким образом,потому что по другому указать тут нельзя ),указываем httpOnly:true(чтобы этот cookie нельзя было изменять и получать внутри браузера),если используем https,то можно добавить флаг secure:true(это тоже самое,что httpOnly только для https)

            return res.json(userData);  // возвращаем на клиент объект userData с помощью json()


        }catch(e){
            next(e); // вызываем функцию next()(параметр этой функции registration) и туда передаем ошибку,в этот next() попадает ошибка,и если ошибка будет от нашего класса ApiError(наш класс обработки ошибок,то есть когда мы будем вызывать функцию из нашего класса ApiError для обработки определенной ошибки,то эта функция будет возвращать объект с полями message и тд,и этот объект будет попадать в эту функцию next(в наш errorMiddleware) у этой нашей функции registration,и будет там обрабатываться),то она будет там обработана с конкретным сообщением,которое мы описывали,если эта ошибка будет не от нашего класса ApiError(мы обрабатывали какие-то конкретные ошибки,типа UnauthorizedError,ошибки при авторизации и тд),а какая-то другая,то она будет обработана как обычная ошибка(просто выведена в логи,мы это там прописали),вызывая эту функцию next(),мы попадаем в наш middleware error-middleware(который подключили в файле index.js)
        }

    }


    async login(req,res,next){

        // оборачиваем в блок try catch,чтобы отлавливать ошибки
        try{

            const { email,password } = req.body; // достаем(деструктуризируем) из тела запроса поля email и password

            const userData = await userService.login(email,password);  // вызываем нашу функцию login из userService,передаем туда email и password,эта функция возвращает refreshToken и userDto(объект пользователя с полями id,email,userName,role) и помещаем эти данные в переменную userData

            res.cookie('refreshToken',userData.refreshToken,{ maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly:true }); // будем хранить refresh токен в cookie,вызываем функцю cookie() у res и передаем первым параметром название,по которому этот cookie будет храниться,а вторым параметром передаем сам cookie,(данные,которые будут храниться в cookie,то есть наш рефреш токен),третьим параметром передаем объект опций,указываем maxAge:30 дней умножаем на 24 часа * на 60 минут * 60 секунд * 1000 миллисекунд(это значит,что этот cookie будет жить 30 дней,указываем таким образом,потому что по другому указать тут нельзя ),указываем httpOnly:true(чтобы этот cookie нельзя было изменять и получать внутри браузера),если используем https,то можно добавить флаг secure:true(это тоже самое,что httpOnly только для https)

            return res.json(userData); // возвращаем на клиент объект userData с помощью json()


        }catch(e){

            next(e); // вызываем функцию next()(параметр этой функции registration) и туда передаем ошибку,в этот next() попадает ошибка,и если ошибка будет от нашего класса ApiError(наш класс обработки ошибок,то есть когда мы будем вызывать функцию из нашего класса ApiError для обработки определенной ошибки,то эта функция будет возвращать объект с полями message и тд,и этот объект будет попадать в эту функцию next(в наш errorMiddleware) у этой нашей функции registration,и будет там обрабатываться),то она будет там обработана с конкретным сообщением,которое мы описывали,если эта ошибка будет не от нашего класса ApiError(мы обрабатывали какие-то конкретные ошибки,типа UnauthorizedError,ошибки при авторизации и тд),а какая-то другая,то она будет обработана как обычная ошибка(просто выведена в логи,мы это там прописали),вызывая эту функцию next(),мы попадаем в наш middleware error-middleware(который подключили в файле index.js)

        }

    }


    async refresh(req,res,next){

        // оборачиваем в блок try catch,чтобы отлавливать ошибки
        try{
            
            const { refreshToken } = req.cookies; // достаем(деструктуризируем) refreshToken из cookies,то есть из запроса из поля cookies 
            
            const userData = await userService.refresh(refreshToken); // вызываем нашу функцию refresh из userService,передаем туда refreshToken,эта функция возвращает refreshToken,accessToken и userDto(объект пользователя с полями id,email,userName,role) и помещаем эти данные в переменную userData

            res.cookie('refreshToken',userData.refreshToken,{maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly:true }); // будем хранить refresh токен в cookie,вызываем функцю cookie() у res и передаем первым параметром название,по которому этот cookie будет храниться,а вторым параметром передаем сам cookie,(данные,которые будут храниться в cookie,то есть наш рефреш токен),третьим параметром передаем объект опций,указываем maxAge:30 дней умножаем на 24 часа * на 60 минут * 60 секунд * 1000 миллисекунд(это значит,что этот cookie будет жить 30 дней,указываем таким образом,потому что по другому указать тут нельзя ),указываем httpOnly:true(чтобы этот cookie нельзя было изменять и получать внутри браузера),если используем https,то можно добавить флаг secure:true(это тоже самое,что httpOnly только для https)

            return res.json(userData); // возвращаем на клиент объект userData с помощью json()


        }catch(e){

            next(e); // вызываем функцию next()(параметр этой функции registration) и туда передаем ошибку,в этот next() попадает ошибка,и если ошибка будет от нашего класса ApiError(наш класс обработки ошибок,то есть когда мы будем вызывать функцию из нашего класса ApiError для обработки определенной ошибки,то эта функция будет возвращать объект с полями message и тд,и этот объект будет попадать в эту функцию next(в наш errorMiddleware) у этой нашей функции registration,и будет там обрабатываться),то она будет там обработана с конкретным сообщением,которое мы описывали,если эта ошибка будет не от нашего класса ApiError(мы обрабатывали какие-то конкретные ошибки,типа UnauthorizedError,ошибки при авторизации и тд),а какая-то другая,то она будет обработана как обычная ошибка(просто выведена в логи,мы это там прописали),вызывая эту функцию next(),мы попадаем в наш middleware error-middleware(который подключили в файле index.js)

        }

    }


    async logout(req,res,next){

        // оборачиваем в блок try catch,чтобы отлавливать ошибки
        try{
            
            const { refreshToken } = req.cookies; // достаем(деструктуризируем) refreshToken из cookies,то есть из запроса из поля cookies 
            
            const token = await userService.logout(refreshToken); // вызываем нашу функцию logout() и передаем туда refreshToken

            res.clearCookie('refreshToken'); // удаляем саму куку(cookie) с рефреш токеном,указываем функцию clearCookie() и передаем туда название cookie,которое хранит refreshToken

            return res.json(token); // возвращаем на клиент сам token(в данном случае это будет удаленный объект из базы данных у tokenModel,со значением refreshToken как и у refreshToken,который мы взяли из запроса из cookies(req.cookies), но в данном случае возвращается не сам удаленный объект токена из базы данных, а объект с полем deletedCount и значением 1,типа был удален объект)


        }catch(e){

            next(e); // вызываем функцию next()(параметр этой функции registration) и туда передаем ошибку,в этот next() попадает ошибка,и если ошибка будет от нашего класса ApiError(наш класс обработки ошибок,то есть когда мы будем вызывать функцию из нашего класса ApiError для обработки определенной ошибки,то эта функция будет возвращать объект с полями message и тд,и этот объект будет попадать в эту функцию next(в наш errorMiddleware) у этой нашей функции registration,и будет там обрабатываться),то она будет там обработана с конкретным сообщением,которое мы описывали,если эта ошибка будет не от нашего класса ApiError(мы обрабатывали какие-то конкретные ошибки,типа UnauthorizedError,ошибки при авторизации и тд),а какая-то другая,то она будет обработана как обычная ошибка(просто выведена в логи,мы это там прописали),вызывая эту функцию next(),мы попадаем в наш middleware error-middleware(который подключили в файле index.js)

        }

    }

    async createComment(req,res,next){

        // оборачиваем в блок try catch,чтобы отлавливать ошибки
        try{
            
            const comment = req.body;  // достаем(деструктуризируем) из тела запроса весь объект запроса со всеми полями,которые мы передали с фронтенда(не используем здесь деструктуризацию типа деструктурировать из req.body {comment} в квадратных скобках,так как просто берем все тело запроса,то есть весь объект тела запроса,а не отдельные поля)

            const commentCreated = await commentModel.create({...comment}); // создаем объект комментария в базе данных,разворачивая весь объект comment(это весь объект тела запроса),вместо ...comment будут подставлены все поля с их значениями,которые есть в объекте тела запроса

            return res.json(commentCreated); // возвращаем созданный объект комментария на фронтенд


        }catch(e){

            next(e); // вызываем функцию next()(параметр этой функции registration) и туда передаем ошибку,в этот next() попадает ошибка,и если ошибка будет от нашего класса ApiError(наш класс обработки ошибок,то есть когда мы будем вызывать функцию из нашего класса ApiError для обработки определенной ошибки,то эта функция будет возвращать объект с полями message и тд,и этот объект будет попадать в эту функцию next(в наш errorMiddleware) у этой нашей функции registration,и будет там обрабатываться),то она будет там обработана с конкретным сообщением,которое мы описывали,если эта ошибка будет не от нашего класса ApiError(мы обрабатывали какие-то конкретные ошибки,типа UnauthorizedError,ошибки при авторизации и тд),а какая-то другая,то она будет обработана как обычная ошибка(просто выведена в логи,мы это там прописали),вызывая эту функцию next(),мы попадаем в наш middleware error-middleware(который подключили в файле index.js)

        }

    }

    async getCommentsForProduct(req,res,next){

        // оборачиваем в блок try catch,чтобы отлавливать ошибки
        try{
            
            const { productNameFor } = req.query; // берем из url(строки) запроса параметр productId,чтобы получить все комментарии для конкретного товара

            const comments = await commentModel.find({productNameFor:productNameFor}); // получаем все объекты комментариев,у которых productIdFor равен параметру productId,который мы взяли из url(строки) запроса

            console.log(comments)

            return res.json(comments); // возвращаем эти комментарии на фронтенд

        }catch(e){

            next(e); // вызываем функцию next()(параметр этой функции registration) и туда передаем ошибку,в этот next() попадает ошибка,и если ошибка будет от нашего класса ApiError(наш класс обработки ошибок,то есть когда мы будем вызывать функцию из нашего класса ApiError для обработки определенной ошибки,то эта функция будет возвращать объект с полями message и тд,и этот объект будет попадать в эту функцию next(в наш errorMiddleware) у этой нашей функции registration,и будет там обрабатываться),то она будет там обработана с конкретным сообщением,которое мы описывали,если эта ошибка будет не от нашего класса ApiError(мы обрабатывали какие-то конкретные ошибки,типа UnauthorizedError,ошибки при авторизации и тд),а какая-то другая,то она будет обработана как обычная ошибка(просто выведена в логи,мы это там прописали),вызывая эту функцию next(),мы попадаем в наш middleware error-middleware(который подключили в файле index.js)

        }

    }

    async updateProductRating(req,res,next){

        // оборачиваем в блок try catch,чтобы отлавливать ошибки
        try{
            
            const product = req.body;  // достаем(деструктуризируем) из тела запроса весь объект запроса со всеми полями,которые мы передали с фронтенда(не используем здесь деструктуризацию типа деструктурировать из req.body {product} в квадратных скобках,так как просто берем все тело запроса,то есть весь объект тела запроса,а не отдельные поля)

            const productFounded = await mealModel.findById(product._id);  // находим товар по _id(указываем нижнее подчеркивание _ перед id,так как id объектов в базе данных mongodb по дефолту указываются с нижним подчеркиванием),который равен _id у product(то есть весь объект тела запроса)

            productFounded.rating = product.rating; // изменяем поле rating у найденного объекта товара в базе данных(productFounded) на значение поля rating у product(объект тела запроса)

            await productFounded.save(); // сохраняем обновленный объект товара в базе данных

            return res.json(productFounded); // возвращаем обновленный товар на фронтенд


        }catch(e){

            next(e); // вызываем функцию next()(параметр этой функции registration) и туда передаем ошибку,в этот next() попадает ошибка,и если ошибка будет от нашего класса ApiError(наш класс обработки ошибок,то есть когда мы будем вызывать функцию из нашего класса ApiError для обработки определенной ошибки,то эта функция будет возвращать объект с полями message и тд,и этот объект будет попадать в эту функцию next(в наш errorMiddleware) у этой нашей функции registration,и будет там обрабатываться),то она будет там обработана с конкретным сообщением,которое мы описывали,если эта ошибка будет не от нашего класса ApiError(мы обрабатывали какие-то конкретные ошибки,типа UnauthorizedError,ошибки при авторизации и тд),а какая-то другая,то она будет обработана как обычная ошибка(просто выведена в логи,мы это там прописали),вызывая эту функцию next(),мы попадаем в наш middleware error-middleware(который подключили в файле index.js)

        }

    }


    async changeAccInfo(req,res,next){

        // оборачиваем в блок try catch,чтобы отлавливать ошибки
        try{
            
            const errors = validationResult(req); // используем validationResult и передаем туда запрос(req),из него автоматически достанутся необходимые поля и провалидируются,и помещаем ошибки валидации в переменную errors

            const { userId, name, email } = req.body; // достаем(деструктуризируем) из тела запроса поля userId(id пользователя),name(новое имя пользователя) и email(новую почту)

            const newUserData = await userService.changeInfo(userId,name,email,errors); // вызываем нашу функцию changeInfo в userService и туда передаем параметры и в переменную newUserData помещаем новый измененный объект пользователя в базе данных,передаем параметр errors в нашу функцию changeInfo,чтобы там обработать ошибку при валидации поля email

            return res.json(newUserData); // возвращаем на клиент объект newUserData с помощью json()

        }catch(e){

            next(e); // вызываем функцию next()(параметр этой функции registration) и туда передаем ошибку,в этот next() попадает ошибка,и если ошибка будет от нашего класса ApiError(наш класс обработки ошибок,то есть когда мы будем вызывать функцию из нашего класса ApiError для обработки определенной ошибки,то эта функция будет возвращать объект с полями message и тд,и этот объект будет попадать в эту функцию next(в наш errorMiddleware) у этой нашей функции registration,и будет там обрабатываться),то она будет там обработана с конкретным сообщением,которое мы описывали,если эта ошибка будет не от нашего класса ApiError(мы обрабатывали какие-то конкретные ошибки,типа UnauthorizedError,ошибки при авторизации и тд),а какая-то другая,то она будет обработана как обычная ошибка(просто выведена в логи,мы это там прописали),вызывая эту функцию next(),мы попадаем в наш middleware error-middleware(который подключили в файле index.js)

        }

    }


    async changeAccPass(req,res,next){

        // оборачиваем в блок try catch,чтобы отлавливать ошибки
        try{
            
            const { userId,currentPass,newPass } = req.body; // достаем(деструктуризируем) из тела запроса поля userId(id пользователя),currentPass(текущий пароль пользователя) и newPass(новый пароль пользователя)

            const newUserData = await userService.changePass(userId, currentPass, newPass); // вызываем нашу функцию changePass в userService и туда передаем параметры и в переменную newUserData помещаем новый измененный объект пользователя в базе данных

            return res.json(newUserData); // возвращаем на клиент объект newUserData с помощью json()

        }catch(e){

            next(e); // вызываем функцию next()(параметр этой функции registration) и туда передаем ошибку,в этот next() попадает ошибка,и если ошибка будет от нашего класса ApiError(наш класс обработки ошибок,то есть когда мы будем вызывать функцию из нашего класса ApiError для обработки определенной ошибки,то эта функция будет возвращать объект с полями message и тд,и этот объект будет попадать в эту функцию next(в наш errorMiddleware) у этой нашей функции registration,и будет там обрабатываться),то она будет там обработана с конкретным сообщением,которое мы описывали,если эта ошибка будет не от нашего класса ApiError(мы обрабатывали какие-то конкретные ошибки,типа UnauthorizedError,ошибки при авторизации и тд),а какая-то другая,то она будет обработана как обычная ошибка(просто выведена в логи,мы это там прописали),вызывая эту функцию next(),мы попадаем в наш middleware error-middleware(который подключили в файле index.js)

        }

    }

    async uploadFile(req,res,next){

        // оборачиваем в блок try catch,чтобы отлавливать ошибки
        try{
            
            const image = req.files.image; // помещаем в переменную image сам файл (в данном случае файл картинки, но так можно и с любым файлом делать) под названием image(который мы указали в formData на фронтенде),у files у req(запроса)

            const filePath = path.resolve('static',image.name); // помещаем в переменную filePath путь на диске,куда будем этот файл сохранять,используя resolve() у path(resolve() - берет текущую директорию(в данном случае директорию до \serverNodeJsMongoDb) и добавляет к ней папку,которую мы передаем в параметре(ее нужно сразу создать вручную)),и также передаем вторым параметром название файла,который нужно сохранить в этой папке

            const filePath2 = `${path.resolve()}\\static\\${image.name}`;  // помещаем в переменную filePath2 путь до файла,который возможно существует,и ниже в коде проверяем,существует ли он(здесь path.resolve() - берет текущую директорию(в данном случае директорию до \serverNodeJsMongoDb) потом через слеши наша папка static в которой мы храним все скачанные файлы с фронтенда и еще через слеши указываем название файла)

            // если путь filePath2 существует(то есть уже есть такой файл в такой папке),то показываем ошибку,проверяем это с помощью fs.existsSync()
            if(fs.existsSync(filePath2)){

                return next(ApiError.BadRequest('This file already exists')); // бросаем ошибку,возвращаем с помощью return нашу функцию next(это наш errorMiddleware) и передаем туда ошибку с помощью нашего ApiError и в BadRequest(наша функция для ошибки) передаем сообщение ошибки,не используем тут throw ApiError,так как это родительский компонент ошибки(то есть если и будет ошибка,то она будет только тут) и тут есть сразу функция next в параметрах этой функции uploadFile,указываем return,чтобы код ниже не работал,если будет ошибка,но можно тут указать и throw ApiError

            }

            image.mv(filePath); // перемещаем файл в папку по пути filePath

            // возвращаем на фронтенд объект с полями информации о файле
            return res.json({name:image.name,path:filePath,file:image});

        }catch(e){

            next(e); // вызываем функцию next()(параметр этой функции registration) и туда передаем ошибку,в этот next() попадает ошибка,и если ошибка будет от нашего класса ApiError(наш класс обработки ошибок,то есть когда мы будем вызывать функцию из нашего класса ApiError для обработки определенной ошибки,то эта функция будет возвращать объект с полями message и тд,и этот объект будет попадать в эту функцию next(в наш errorMiddleware) у этой нашей функции registration,и будет там обрабатываться),то она будет там обработана с конкретным сообщением,которое мы описывали,если эта ошибка будет не от нашего класса ApiError(мы обрабатывали какие-то конкретные ошибки,типа UnauthorizedError,ошибки при авторизации и тд),а какая-то другая,то она будет обработана как обычная ошибка(просто выведена в логи,мы это там прописали),вызывая эту функцию next(),мы попадаем в наш middleware error-middleware(который подключили в файле index.js)

        }

    }

    async deleteFile(req,res,next){

        // оборачиваем в блок try catch,чтобы отлавливать ошибки
        try{
            
            const fileName = req.params.fileName; // получаем из параметров запроса название файла,его мы указывали как динамический параметр у эндпоинта /deleteFile,поэтому ее мы можем взять и помещаем ее в переменную fileName,просто у delete запросов на сервер нету тела запроса и все параметры нужно передавать как query параметры запроса(то есть в url(ссылке) к эндпоинту)

            const filePath = `${path.resolve()}\\static\\${fileName}`; // помещаем путь до файла,который хотим удалить в переменную filePath(здесь path.resolve() - берет текущую директорию(в данном случае директорию до \serverNodeJsMongoDb) потом через слеши наша папка static в которой мы храним все скачанные файлы с фронтенда и еще через слеши указываем название файла)

            // если fs.existsSync(filePath) false,то есть файл по такому пути,который находится в переменной filePath не найден,то показываем ошибку и не удаляем такой файл,иначе может быть ошибка,когда хотим удалить файл,что такого файла и так нету
            if(!fs.existsSync(filePath)){

                return next(ApiError.BadRequest('There is no such file to delete')); // бросаем ошибку,возвращаем с помощью return нашу функцию next(это наш errorMiddleware) и передаем туда ошибку с помощью нашего ApiError и в BadRequest(наша функция для ошибки) передаем сообщение ошибки,не используем тут throw ApiError,так как это родительский компонент ошибки(то есть если и будет ошибка,то она будет только тут) и тут есть сразу функция next в параметрах этой функции deleteFile,указываем return,чтобы код ниже не работал,если будет ошибка,но можно тут указать и throw ApiError

            }

            fs.unlinkSync(filePath); // удаляем файл по такому пути,который находится в переменной filePath с помощью fs.unlinkSync(),у модуля fs для работы с файлами есть методы обычные(типа unlink) и Sync(типа unlinkSync), методы с Sync блокируют главный поток node js и код ниже этой строки не будет выполнен,пока не будет выполнен метод с Sync

            return res.json({message:'Successfully deleted file',deletedFilePath:filePath}); // возвращаем на клиент объект с сообщением


        }catch(e){

            next(e); // вызываем функцию next()(параметр этой функции registration) и туда передаем ошибку,в этот next() попадает ошибка,и если ошибка будет от нашего класса ApiError(наш класс обработки ошибок,то есть когда мы будем вызывать функцию из нашего класса ApiError для обработки определенной ошибки,то эта функция будет возвращать объект с полями message и тд,и этот объект будет попадать в эту функцию next(в наш errorMiddleware) у этой нашей функции registration,и будет там обрабатываться),то она будет там обработана с конкретным сообщением,которое мы описывали,если эта ошибка будет не от нашего класса ApiError(мы обрабатывали какие-то конкретные ошибки,типа UnauthorizedError,ошибки при авторизации и тд),а какая-то другая,то она будет обработана как обычная ошибка(просто выведена в логи,мы это там прописали),вызывая эту функцию next(),мы попадаем в наш middleware error-middleware(который подключили в файле index.js)

        }

    }


}

export default new UserController(); // экспортируем уже объект на основе нашего класса UserController