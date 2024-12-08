import mealModel from "../models/mealModel.js";

class MealController{

    // первым параметром эти функции принимают req(запрос),а вторым параметром res(ответ),третьим параметром передаем функцию next(следующий по цепочке middleware,в данном случае это наш errorMiddleware)
    async getMeals(req,res,next){

        // отличие req.params от req.query заключается в том,что в req.params указываются параметры в самом url до эндпоинта на бэкэнде(в node js в данном случае,типа /api/getProducts) через :(типа /:id,динамический параметр id),а req.query - это параметры,которые берутся из url(которые дополнительно добавили с фронтенда к url) через знак ?(типа ?name=bob)

        const {limit,skip} = req.query; // берем из параметров запроса поля limit и skip

        try{

            const meals = await mealModel.find().limit(limit).skip(skip); // находим объекты всех блюд в базе данных mongodb с помощью метода find() у модели(схемы) mealModel(модель блюда), через точку указываем метод limit() и передаем в него значение лимита,в данном случае указываем,что лимит будет 2,то есть из базы данных придут максимум 2 объекта,через точку указываем метод skip() и передаем в него значение,сколько нужно пропустить объектов,прежде чем начать брать из базы данных mongodb, в данном случае указываем в методах limit и skip значения query параметров limit и skip,которые взяли из url(передали с фронтенда) 


            return res.json(meals);  // возвращаем на клиент массив объектов блюд meals

        }catch(e){

            next(e); // вызываем функцию next()(параметр этой функции getMeals) и туда передаем ошибку,в этот next() попадает ошибка,и если ошибка будет от нашего класса ApiError(наш класс обработки ошибок,то есть когда мы будем вызывать функцию из нашего класса ApiError для обработки определенной ошибки,то эта функция будет возвращать объект с полями message и тд,и этот объект будет попадать в эту функцию next(в наш errorMiddleware) у этой нашей функции getMeals,и будет там обрабатываться),то она будет там обработана с конкретным сообщением,которое мы описывали,если эта ошибка будет не от нашего класса ApiError(мы обрабатывали какие-то конкретные ошибки,типа UnauthorizedError,ошибки при авторизации и тд),а какая-то другая,то она будет обработана как обычная ошибка(просто выведена в логи,мы это там прописали),вызывая эту функцию next(),мы попадаем в наш middleware error-middleware(который подключили в файле index.js)

        }

    }


    // создаем функцию для получения блюд для каталога
    async getMealsCatalog(req,res,next){

        try{

            let {limit,page,name,category} = req.query; // берем из параметров запроса поля categoryId и tasteId,указываем здесь let,чтобы  можно было изменять значения этих параметров(переменных),в данном случае это надо для limit и page,также берем параметр sort(в нем будет название поля,по которому нужно сортировать,это мы передаем с фронтенда) и поле order(в нем будет значение,каким методом сортировать,например, DESC(по убыванию,от большего к меньшему)),берем поле name,чтобы искать объекты блюд по этому полю name для поиска

            let categoryObj; // указываем переменную для объекта категории,укаызаем ей let,чтобы потом изменять ее значение

            page = page || 1; // указываем значение переменной page как параметр,который взяли из строки запроса,если он не указан,то делаем значение 1 

            limit = limit || 2; // указываем значение переменной limit как параметр,который взяли из строки запроса,если он не указан,то делаем значение 2

            let offset = page * limit - limit; // считаем отступ,допустим перешли на вторую страницу и первые 3 товара нужно пропустить(в данном случае это limit),поэтому умножаем page(текущую страницу) на limit и отнимаем лимит(чтобы правильно считались страницы,и показывалась последняя страница с товарами,если не отнять,то на последней странице товаров не будет,так как будет указано пропустить все объекты товаров из базы данных,прежде чем начать отправлять их),то есть offset считает,сколько нужно пропустить объектов до того,как отправлять объекты(например всего товаров 12, текущая страница 3,лимит 3, соответственно 3 * 3 - 3 будет 6,то есть 6 товаров пропустятся,на следующей странице(4) будет уже пропущено 4 * 3 - 3 равно 9(то есть 9 товаров пропущено будет), offset указывает пропустить указанное число строк(объектов в таблице в базе данных), прежде чем начать выдавать строки(объекты) )


            // если category true(то есть в параметре category есть какое-то значение,то указываем значение переменной categoryObj как объект с полем category и значением параметра category(который мы взяли из url),в другом случае указываем значение переменной categoryObj как null,это делаем,чтобы проверить,указана ли category,и если нет,то указываем этой переменной значение null,и потом эту переменную(этот объект) categoryObj разворачиваем в условии для получения объектов товаров из базы данных mongodb ниже в коде)
            if(category){

                categoryObj = {
                    category:category
                }

            }else{

                categoryObj = null;

            }

            const allMeals = await mealModel.find({

                name:{$regex:`${name}`,$options:'i'}, 

                ...categoryObj, // разворачиваем объект categoryObj(вместо этого будет подставлено category:category(то есть ищем объекты,у которых поле category равно параметру category,который взяли из url с фронтенда),если проверка выше на category была true,если была false,то тут будет null)

            }); // ищем все объекты товаров в базе данных,чтобы отправить их на клиент и потом получить число сколько всего товаров в базе данных,для пагинации,а в переменную meals поместим уже конкретно объекты товаров на отдельной странице пагинации,в find() в объекте указываем поле name(по нему будем делать поиск объектов блюд) и указываем через двоеточие объект, указываем поле $regex(по какому значению будем делать поиск по полю name,в данном случае указываем значение как `${name}` параметр,который взяли с фронтенда) и через запятую указываем поле $options(в нем указываем опции для поиска,то есть игнорировать ли пробелы в строке поиска,чувствительный регистр букв или нет(учитывать разницу больших букв и маленьких) и тд), в $options значение i указывает,что регистр букв не чувствительный,то есть можно писать в поиске маленькими буквами,а будут находиться названия с большими такими же буквами и наоборот, значение x указывает,игнорировать ли пробелы в поиске и символ решетки(#),эти значение типа i и x нужно писать вместе('ix'),чтобы они работали,также есть и другие опции типа этих,если они нужны,то их также нужно указывать вместе,без пробела,в данном случае используем опцию только i

            const meals = await mealModel.find({

                name:{$regex:`${name}`,$options:'i'}, 

                ...categoryObj, // разворачиваем объект categoryObj(вместо этого будет подставлено category:category(то есть ищем объекты,у которых поле category равно параметру category,который взяли из url с фронтенда),если проверка выше на category была true,если была false,то тут будет null)
            
            }).limit(limit).skip(offset); // находим объекты всех блюд в базе данных mongodb с помощью метода find() у модели(схемы) mealModel(модель блюда), через точку указываем метод limit() и передаем в него значение query параметра limit,который мы взяли из url от фронтенда,в данном случае указываем,что лимит будет 2,то есть из базы данных придут максимум 2 объекта,через точку указываем метод skip() и передаем в него значение,сколько нужно пропустить объектов,прежде чем начать брать из базы данных mongodb, в данном случае указываем значение переменной offset, в find() в объекте указываем поле name(по нему будем делать поиск объектов блюд) и указываем через двоеточие объект, указываем поле $regex(по какому значению будем делать поиск по полю name,в данном случае указываем значение как `${name}` параметр,который взяли с фронтенда) и через запятую указываем поле $options(в нем указываем опции для поиска,то есть игнорировать ли пробелы в строке поиска,чувствительный регистр букв или нет(учитывать разницу больших букв и маленьких) и тд), в $options значение i указывает,что регистр букв не чувствительный,то есть можно писать в поиске маленькими буквами,а будут находиться названия с большими такими же буквами и наоборот, значение x указывает,игнорировать ли пробелы в поиске и символ решетки(#),эти значение типа i и x нужно писать вместе('ix'),чтобы они работали,также есть и другие опции типа этих,если они нужны,то их также нужно указывать вместе,без пробела,в данном случае используем опцию только i


            return res.json({meals,allMeals});  // возвращаем на клиент объект с полями массива объектов блюд meals и массива объектов allMeals,указываем это в объекте,так как передаем уже 2 массива

        }catch(e){

            next(e); // вызываем функцию next()(параметр этой функции getMeals) и туда передаем ошибку,в этот next() попадает ошибка,и если ошибка будет от нашего класса ApiError(наш класс обработки ошибок,то есть когда мы будем вызывать функцию из нашего класса ApiError для обработки определенной ошибки,то эта функция будет возвращать объект с полями message и тд,и этот объект будет попадать в эту функцию next(в наш errorMiddleware) у этой нашей функции getMeals,и будет там обрабатываться),то она будет там обработана с конкретным сообщением,которое мы описывали,если эта ошибка будет не от нашего класса ApiError(мы обрабатывали какие-то конкретные ошибки,типа UnauthorizedError,ошибки при авторизации и тд),а какая-то другая,то она будет обработана как обычная ошибка(просто выведена в логи,мы это там прописали),вызывая эту функцию next(),мы попадаем в наш middleware error-middleware(который подключили в файле index.js)

        }

    }

}

export default new MealController(); // экспортируем объект на основе класса MealController