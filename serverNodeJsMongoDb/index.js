// прописали npm init в проект,чтобы инициализировать npm менеджер пакетов,чтобы устанавливать зависимости и пакеты(после npm init на все вопросы можно нажать enter и они будут тогда по дефолту указаны),устанавливаем express,cors(для отправки запросов через браузер),cookie-parser, устанавливаем с помощью npm i,устанавливаем nodemon(npm i nodemon --save-dev(чтобы устанавилось только для режима разработки)),чтобы перезагружался сервер автоматически при изменении файлов,указываем в package json в поле scripts поле dev и значение nodemon index.js(чтобы запускался index.js с помощью nodemon,чтобы перезагружался сервер автоматически при изменении файлов),используем команду npm run dev,чтобы запустить файл index.js,добавляем поле type со значение module в package.json,чтобы работали импорты типа import from,устанавливаем dotenv(npm i dotenv),чтобы использовать переменные окружения,создаем файл .env в корне папки server,чтобы указывать там переменные окружения(переменные среды),устанавливаем npm i mongodb mongoose,для работы с базой данных mongodb,на сайте mongodb создаем новый проект для базы данных,и потом берем оттуда ссылку для подключения к базе данных,устанавливаем еще jsonwebtoken(для генерации jwt токена),bcrypt(для хеширования пароля),uuid(для генерации рандомных строк) (npm i jsonwebtoken bcrypt uuid),все модули для backend(бэкэнда,в данном случае в папке server) нужно устанавливать в папку для бэкэнда(в данном случае это папка server),для этого нужно каждый раз из корневой папки переходить в папку server(cd server) и уже там прописывать npm i,устанавливаем еще пакет nodemailer(npm i nodemailer) для работы с отправкой сообщений на почту,устанавливаем библиотеку express-validator(npm i express-validator) для валидации паролей,почт и тд(для их проверки на правилно введенную информацию),для работы с файлами в express, нужно установить модуль npm i express-fileupload,лучше создать, подключить git репозиторий в проект,сделать первый commit и push данных в git до того,как создали папку с фронтендом на react js,иначе могут быть ошибки(могут и не быть) сохранений git папки всего проекта и git папки самого фронтенда на react js

//authMiddleware нужен,чтобы защитить пользователя от мошенников,так как,когда истекает access токен,идет запрос на refresh токен,и после этого обновляется и access токен,и refresh токен,соответственно мошенник уже не может получить доступ к этому эндпоинту(маршруту по url),так как его refresh и access токен будут уже не действительны,а функция checkAuth нужна для проверки только refresh токена(то есть,если пользователь вообще не пользовался сервисом какое-то время(которое указали у жизни refresh токена),нужно именно не переобновлять страницы и тд,чтобы не шел запрос на /refresh(иначе refresh токен будет переобновляться с каждым запросом,нужно,чтобы refresh токен истек до запроса на /refresh),то его refresh токен истечет и его выкинет с аккаунта после обновления страницы,но если пользователь будет использовать в данном случае,например,функцию authMiddleware,то его access токен и refresh токен будут заново перезаписаны и таймер на время жизни refresh токена будет обновлен и заново запущен,поэтому его не будет выкидывать из аккаунта) 

import dotenv from 'dotenv'; // импортируем dotenv(в данном случае импортируем это вручную,потому что автоматически не импортируется)

import express from 'express'; // импортируем express(express типа для node js express,в данном случае импортируем это вручную,потому что автоматически не импортируется)

import cookieParser from 'cookie-parser'; // импортируем cookieParser для использования cookie

import cors from 'cors'; // импортируем cors,чтобы можно было отправлять запросы на сервер из браузера(в данном случае импортируем это вручную,потому что автоматически не импортируется)

import mongoose from 'mongoose'; // импортируем mongoose,для упрощенной работы с mongodb
import mealModel from './models/mealModel.js';
import router from './router/router.js';
import errorMiddleware from './middlewares/errorMiddleware.js';
import roleModel from './models/roleModel.js';

import bcrypt from 'bcrypt'; // импортируем bcrypt для хеширования пароля(в данном случае импортируем вручную)
import userModel from './models/userModel.js';

import fileUpload from 'express-fileupload'; // импортируем fileUpload для работы с загрузкой файлов 
import adminFieldsModel from './models/adminFieldsModel.js';

dotenv.config(); // используем config() у dotenv,чтобы работал dotenv и можно было использовать переменные окружения

const PORT = process.env.PORT || 5000; // указываем переменную PORT и даем ей значение как у переменной PORT из файла .env,если такой переменной нет,то указываем значение 5000

const app = express(); // создаем экземпляр нашего приложения с помощью express()

// подключать этот fileUpload нужно в начале всех подключений use,или хотя бы выше,чем router,иначе не работает
app.use(fileUpload({})); // регистрируем модуль fileUpload с помощью use(),чтобы он работал,передаем в fileUpload() объект,используем fileUpload для работы с загрузкой файлов

app.use(express.static('static')); // делаем возможность отдавать изображение,то есть показывать изображение из папки static в браузере,когда,например, используем картинку,чтобы в src картинки можно было вставить путь до этой картинки на нашем node js сервере,и она показывалась


app.use(cookieParser()); // подключаем cookieParser,чтобы работали cookie

// подключаем cors,чтобы взаимодействовать с сервером(отправлять запросы) через браузер,указываем,с каким доменом нужно этому серверу обмениваться куками(cookies),для этого передаем объект в cors(),указываем поле credentials true(разрешаем использовать cookies) и указываем в origin url нашего фронтенда(в данном случае это http://localhost:3000),указываем этот url через переменную окружения CLIENT_URL(мы вынесли туда этот url)
app.use(cors({
    credentials:true,
    origin:process.env.CLIENT_URL
}))

app.use(express.json()); // подключаем express.json(),чтобы наш сервер мог парсить json формат данных,то есть обмениваться с браузером json форматом данных
 
app.use('/api',router); // подключаем роутер к нашему серверу,первым параметром указываем url по которому будет отрабатывать этот роутер,а вторым параметром указываем сам роутер 

app.use(errorMiddleware); // подключаем наш middleware для обработки ошибок,middleware для обработки ошибок нужно подключать в самом конце всех подключений use()

// делаем эту функцию start асинхронной,так как все операции с базой данных являются асинхронными
const start = async () => {
    // оборачиваем в try catch,чтобы отлавливать ошибки
    try{

        await mongoose.connect(process.env.DB_URL); // подключаемся к базе данных,используя функцию connect(),в ее параметрах указываем ссылку для подключения к базе данных,которую взяли на сайте mongodb,в данном случае вынесли эту ссылку в конфигурационный файл .env,и берем его оттуда с помощью process.env,в этой ссылке для подключения к базе данных mongoDb нужно будет вставить(указать) пароль пользователя в эту строку вместо <db_password>,который указывали при создании кластера(cluster) на сайте mongoDb

        app.listen(PORT,() => console.log(`Server started on PORT = ${PORT}`)); // запускаем сервер,говоря ему прослушивать порт 5000(указываем первым параметром у listen() нашу переменную PORT) с помощью listen(),и вторым параметром указываем функцию,которая выполнится при успешном запуске сервера

        // использовали это 1 раз,чтобы создать такие объекты в базе данных 1 раз,чтобы они просто там были,после этого этот код закомментировали
        // await mealModel.create({name:"Burger",category:"Burgers",price:8,priceFilter:"Under $10",amount:1,rating:0,totalPrice:8,image:"Mask Group (4).png"}); // создали в базе данных в сущности блюд объект блюда с нужными полями

        // await mealModel.create({name:"Drink",category:"Drinks",price:11,priceFilter:"$10-$20",amount:1,rating:0,totalPrice:11,image:"Mask Group (1).png"});

        // await mealModel.create({name:"Pizza",category:"Pizza",price:21,priceFilter:"$20-$30",amount:1,rating:0,totalPrice:21,image:"Mask Group.png"});

        // await mealModel.create({name:"Cheese Butter",category:"Sandwiches",price:7,priceFilter:"Under $10",amount:1,rating:0,totalPrice:7,image:"Mask Group (2).png"});

        // await mealModel.create({name:"Sandwich",category:"Sandwiches",price:12,priceFilter:"$10-$20",amount:1,rating:0,totalPrice:12,image:"Mask Group (7).png"});

        // await mealModel.create({name:"Country Burger",category:"Burgers",price:24,priceFilter:"$20-$30",amount:1,rating:0,totalPrice:24,image:"Mask Group (5).png"});

        // await mealModel.create({name:"Chicken Chup",category:"Sandwiches",price:28,priceFilter:"$20-$30",amount:1,rating:0,totalPrice:28,image:"Mask Group (6).png"});

        // создаем объект в базе данных у сущности(таблицы) roleModel(сущности роли) с полем value и значением "USER" для роли пользователя,также ниже создаем роль для админа,делаем это 1 раз и потом этот код закомментируем
        // await roleModel.create({value:"USER"});

        // await roleModel.create({value:"ADMIN"});


        // создаем объект пользователя в сущности users(пользователи) в базе данных 1 раз с ролью ADMIN,чтобы там он просто был и потом можно было только входить в аккаунт этого админа,после этого код закомментировали
        // const hashPassword = await bcrypt.hash("adminFoodtuck",3); // хешируем пароль в данном случае для админа("adminFoodtuck") с помощью функции hash() у bcrypt,первым параметром передаем пароль,а вторым - соль,степень хеширования(чем больше - тем лучше захешируется,но не нужно слишком большое число,иначе будет долго хешироваться пароль)

        // const adminRole = await roleModel.findOne({value:"ADMIN"}); // получаем роль из базы данных со значением ADMIN и помещаем ее в переменную adminRole,изменяем значение value на ADMIN,чтобы зарегестрировать роль администратора

        // const adminCreated = await userModel.create({email:"adminFoodtuck@gmail.com",password:hashPassword,userName:"Admin",role:adminRole.value}); // создаем объект с полями email и password в базу данных и помещаем этот объект в переменную adminCreated,в поле password помещаем значение из переменной hashPassword,то есть уже захешированный пароль,и указываем в объекте еще поле userName,в поле role указываем наш adminRole.value(значение роли,которую мы получили из базы данных выше),так как мы получили объект из базы данных,а нам надо из него достать само значение),то есть таким образом указываем пользователю роль "ADMIN")


        // создаем объект в базе данных в таблице(сущности) adminFields,в create указываем объект с полем phoneNumber и значением номера телефона в виде строки,создаем этот объект один раз,а потом этот код закомментируем,чтобы каждый раз этот объект не создавался,а только один раз,создаем этот объект,чтобы потом на фронтенде брать этот номер телефона из базы данных и чтобы потом админ мог его изменять
        // await adminFieldsModel.create({phoneNumber:"065 - 9665986"});

    }catch(e){
        console.log(e);
    }
}

start();  // вызываем нашу функцию start(),чтобы запустить сервер