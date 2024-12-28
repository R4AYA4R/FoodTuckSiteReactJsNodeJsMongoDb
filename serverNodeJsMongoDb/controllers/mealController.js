import mealModel from "../models/mealModel.js";

class MealController {

    // первым параметром эти функции принимают req(запрос),а вторым параметром res(ответ),третьим параметром передаем функцию next(следующий по цепочке middleware,в данном случае это наш errorMiddleware)
    async getMeals(req, res, next) {

        // отличие req.params от req.query заключается в том,что в req.params указываются параметры в самом url до эндпоинта на бэкэнде(в node js в данном случае,типа /api/getProducts) через :(типа /:id,динамический параметр id),а req.query - это параметры,которые берутся из url(которые дополнительно добавили с фронтенда к url) через знак ?(типа ?name=bob)

        const { limit, skip } = req.query; // берем из параметров запроса поля limit и skip

        try {

            const meals = await mealModel.find().limit(limit).skip(skip); // находим объекты всех блюд в базе данных mongodb с помощью метода find() у модели(схемы) mealModel(модель блюда), через точку указываем метод limit() и передаем в него значение лимита,в данном случае указываем,что лимит будет 2,то есть из базы данных придут максимум 2 объекта,через точку указываем метод skip() и передаем в него значение,сколько нужно пропустить объектов,прежде чем начать брать из базы данных mongodb, в данном случае указываем в методах limit и skip значения query параметров limit и skip,которые взяли из url(передали с фронтенда) 


            return res.json(meals);  // возвращаем на клиент массив объектов блюд meals

        } catch (e) {

            next(e); // вызываем функцию next()(параметр этой функции getMeals) и туда передаем ошибку,в этот next() попадает ошибка,и если ошибка будет от нашего класса ApiError(наш класс обработки ошибок,то есть когда мы будем вызывать функцию из нашего класса ApiError для обработки определенной ошибки,то эта функция будет возвращать объект с полями message и тд,и этот объект будет попадать в эту функцию next(в наш errorMiddleware) у этой нашей функции getMeals,и будет там обрабатываться),то она будет там обработана с конкретным сообщением,которое мы описывали,если эта ошибка будет не от нашего класса ApiError(мы обрабатывали какие-то конкретные ошибки,типа UnauthorizedError,ошибки при авторизации и тд),а какая-то другая,то она будет обработана как обычная ошибка(просто выведена в логи,мы это там прописали),вызывая эту функцию next(),мы попадаем в наш middleware error-middleware(который подключили в файле index.js)

        }

    }


    // создаем функцию для получения блюд для каталога
    async getMealsCatalog(req, res, next) {

        try {

            let { limit, page, name, category, inputLeftRangePrice, inputRightRangePrice, sortBy } = req.query; // берем из параметров запроса поля categoryId и tasteId,указываем здесь let,чтобы  можно было изменять значения этих параметров(переменных),в данном случае это надо для limit и page,также берем параметр sort(в нем будет название поля,по которому нужно сортировать,это мы передаем с фронтенда) и поле order(в нем будет значение,каким методом сортировать,например, 1(по возрастанию,от большего к меньшему), -1(по убыванию,от большего к меньшему) ),берем поле name,чтобы искать объекты блюд по этому полю name для поиска, берем поле inputLeftRangePrice(состояние цены левого инпута с типом range у ползунка для фильтра цены) и inputRightRangePrice(состояние цены правого инпута с типом range у ползунка для фильтра цены),чтобы фильтровать объекты блюд по цене

            let categoryObj; // указываем переменную для объекта категории,укаызаем ей let,чтобы потом изменять ее значение

            let priceObj; // указываем переменную для объекта цены,укаызаем ей let,чтобы потом изменять ее значение

            let sortedObj; // указываем переменную для объекта сортировки полей,укаызаем ей let,чтобы потом изменять ее значение


            inputLeftRangePrice = inputLeftRangePrice || 0; // указываем значение полю inputLeftRagenPrice как значение этого же поля inputLeftRangePrice или 0,то есть если inputLeftRangePrice true(то есть в нем есть какое-то значение,которые мы получили от фронтенда),то указываем значение ему его же(inputLeftRangePrice),в другом случае,если значение этому полю inputLeftRangePrice не указано с фронтенда,то указываем ему значение 0(дефолтное значение,когда нету фильтра цены),указываем конкретно другое значение (0 в данном случае),даже если с фронтенда его не указали,иначе не будет выполняться правильно условие для сортировки объектов блюд по цене

            inputRightRangePrice = inputRightRangePrice || 100; // указываем значение полю inputRightRangePrice как значение этого же поля inputRightRangePrice или 100,то есть если inputRightRangePrice true(то есть в нем есть какое-то значение,которые мы получили от фронтенда),то указываем значение ему его же(inputRightRangePrice),в другом случае,если значение этому полю inputRightRangePrice не указано с фронтенда,то указываем ему значение 100(дефолтное значение,когда нету фильтра цены),указываем конкретно другое значение (100 в данном случае),даже если с фронтенда его не указали,иначе не будет выполняться правильно условие для сортировки объектов блюд по цене

            page = page || 1; // указываем значение переменной page как параметр,который взяли из строки запроса,если он не указан,то делаем значение 1 

            limit = limit || 2; // указываем значение переменной limit как параметр,который взяли из строки запроса,если он не указан,то делаем значение 2

            let offset = page * limit - limit; // считаем отступ,допустим перешли на вторую страницу и первые 3 товара нужно пропустить(в данном случае это limit),поэтому умножаем page(текущую страницу) на limit и отнимаем лимит(чтобы правильно считались страницы,и показывалась последняя страница с товарами,если не отнять,то на последней странице товаров не будет,так как будет указано пропустить все объекты товаров из базы данных,прежде чем начать отправлять их),то есть offset считает,сколько нужно пропустить объектов до того,как отправлять объекты(например всего товаров 12, текущая страница 3,лимит 3, соответственно 3 * 3 - 3 будет 6,то есть 6 товаров пропустятся,на следующей странице(4) будет уже пропущено 4 * 3 - 3 равно 9(то есть 9 товаров пропущено будет), offset указывает пропустить указанное число строк(объектов в таблице в базе данных), прежде чем начать выдавать строки(объекты) )


            // если category true(то есть в параметре category есть какое-то значение,то указываем значение переменной categoryObj как объект с полем category и значением параметра category(который мы взяли из url),в другом случае указываем значение переменной categoryObj как null,это делаем,чтобы проверить,указана ли category,и если нет,то указываем этой переменной значение null,и потом эту переменную(этот объект) categoryObj разворачиваем в условии для получения объектов товаров из базы данных mongodb ниже в коде)
            if (category) {

                categoryObj = {
                    category: category
                }

            } else {

                categoryObj = null;

            }


            // если inputLeftRangePrice меньше 0, или inputRightRangePrice меньше 100,то есть эти поля не равны своим первоначальным значениям,то есть когда пользователь указал фильтр цены
            if (inputLeftRangePrice > 0 || inputRightRangePrice < 100) {

                priceObj = {

                    // $and соединяет два условия,оба которых должны выполниться,то есть оператор и, $gte - оператор больше или равно, $lte - оператор меньше или равно,то есть сортируем объеты по полю price(по цене)
                    $and: [{ price: { $gte: inputLeftRangePrice } }, { price: { $lte: inputRightRangePrice } }]

                }

            } else {

                priceObj = null;

            }

            // если sortByRating равно 'rating',то есть пользователь на фронтенде выбрал сортировку по рейтингу
            if (sortBy === 'rating') {

                // указываем значение переменной sortedObj(объект для сортировки полей)
                sortedObj = {
                    rating: -1,
                    _id: 1
                } // вместо sort будет подставлено название поля,по которому нужно сортировать(это мы передали с фронтенда),а вместо order будет подставлен метод сортировки,например -1(сортировка по убыванию),или 1(сортировка по возрастанию),это мы передали с фронтенда, если нужно сортировать объекты товаров по нескольким полям,то можно просто их указывать через запятую в этом объекте, указываем поле _id(сортируем объекты по их id) и значение 1(сортировка по возрастанию, в данном случае можно поставить и -1,то есть сортировка по убыванию,оно тоже будет нормально работать(просто объекты будут в другом порядке,но это подойдет) или еще можно указать сортировку по полю name(со значениями тоже 1 или -1,оно тоже будет работать) вместо сортировки по _id,но главное поставить эту сортировку по _id или name),чтобы если значение рейтинга у объектов одинаковое,то они не дублировались и правильно отображались,если не указать еще сортировку по _id,то объекты с одинаковыми значениями поля рейтинга будут дублироваться и не правильно отображаться

            } else {

                sortedObj = null; // если условие выше не выполнилось,то есть параметр sort и order не true(то есть в них нету значения),то указываем значение переменной sortedObj(объект для сортировки полей) как null,делаем так,так как будем разворачивать объект sortedObj в метод sort() для сортировки полей товаров,и если этот объект будет со значением null,то сортировка не будет работать,но таким образом можно указать динамически этот объект,то есть если пользователь выберет сортировку товаров по какому-нибудь полю на фронтенде,то она будет работать,а если не выберет,то не будет работать,если не проверять так этот объект на условие если sort && order true,а просто в методе sort() сразу указать объект {sort:order},то будет ошибка,если в этих параметрах sort и order не будет значения

            }


            console.log(sortedObj)

            const allMeals = await mealModel.find({

                name: { $regex: `${name}`, $options: 'i' },

                ...categoryObj, // разворачиваем объект categoryObj(вместо этого будет подставлено category:category(то есть ищем объекты,у которых поле category равно параметру category,который взяли из url с фронтенда),если проверка выше на category была true,если была false,то тут будет null)

                ...priceObj

            }); // ищем все объекты товаров в базе данных,чтобы отправить их на клиент и потом получить число сколько всего товаров в базе данных,для пагинации,а в переменную meals поместим уже конкретно объекты товаров на отдельной странице пагинации,в find() в объекте указываем поле name(по нему будем делать поиск объектов блюд) и указываем через двоеточие объект, указываем поле $regex(по какому значению будем делать поиск по полю name,в данном случае указываем значение как `${name}` параметр,который взяли с фронтенда) и через запятую указываем поле $options(в нем указываем опции для поиска,то есть игнорировать ли пробелы в строке поиска,чувствительный регистр букв или нет(учитывать разницу больших букв и маленьких) и тд), в $options значение i указывает,что регистр букв не чувствительный,то есть можно писать в поиске маленькими буквами,а будут находиться названия с большими такими же буквами и наоборот, значение x указывает,игнорировать ли пробелы в поиске и символ решетки(#),эти значение типа i и x нужно писать вместе('ix'),чтобы они работали,также есть и другие опции типа этих,если они нужны,то их также нужно указывать вместе,без пробела,в данном случае используем опцию только i

            const meals = await mealModel.find({

                name: { $regex: `${name}`, $options: 'i' },

                ...categoryObj, // разворачиваем объект categoryObj(вместо этого будет подставлено category:category(то есть ищем объекты,у которых поле category равно параметру category,который взяли из url с фронтенда),если проверка выше на category была true,если была false,то тут будет null)

                ...priceObj

            }).sort({ ...sortedObj }).limit(limit).skip(offset); // находим объекты всех блюд в базе данных mongodb с помощью метода find() у модели(схемы) mealModel(модель блюда), через точку указываем метод limit() и передаем в него значение query параметра limit,который мы взяли из url от фронтенда,в данном случае указываем,что лимит будет 2,то есть из базы данных придут максимум 2 объекта,через точку указываем метод skip() и передаем в него значение,сколько нужно пропустить объектов,прежде чем начать брать из базы данных mongodb, в данном случае указываем значение переменной offset, в find() в объекте указываем поле name(по нему будем делать поиск объектов блюд) и указываем через двоеточие объект, указываем поле $regex(по какому значению будем делать поиск по полю name,в данном случае указываем значение как `${name}` параметр,который взяли с фронтенда) и через запятую указываем поле $options(в нем указываем опции для поиска,то есть игнорировать ли пробелы в строке поиска,чувствительный регистр букв или нет(учитывать разницу больших букв и маленьких) и тд), в $options значение i указывает,что регистр букв не чувствительный,то есть можно писать в поиске маленькими буквами,а будут находиться названия с большими такими же буквами и наоборот, значение x указывает,игнорировать ли пробелы в поиске и символ решетки(#),эти значение типа i и x нужно писать вместе('ix'),чтобы они работали,также есть и другие опции типа этих,если они нужны,то их также нужно указывать вместе,без пробела,в данном случае используем опцию только i, указываем метод sort() для сортировки объектов,указываем в нем объект,в который разворачиваем наш объект sortedObj(вместо него будут подставлены поля,которые нужно сортировать,и значения сортировки этих полей,или же будет подставлен null,если параметры sort и order не будут иметь значения(если с фронтенда не передали значения в них))

            console.log(meals)


            return res.json({ meals, allMeals });  // возвращаем на клиент объект с полями массива объектов блюд meals и массива объектов allMeals,указываем это в объекте,так как передаем уже 2 массива

        } catch (e) {

            next(e); // вызываем функцию next()(параметр этой функции getMeals) и туда передаем ошибку,в этот next() попадает ошибка,и если ошибка будет от нашего класса ApiError(наш класс обработки ошибок,то есть когда мы будем вызывать функцию из нашего класса ApiError для обработки определенной ошибки,то эта функция будет возвращать объект с полями message и тд,и этот объект будет попадать в эту функцию next(в наш errorMiddleware) у этой нашей функции getMeals,и будет там обрабатываться),то она будет там обработана с конкретным сообщением,которое мы описывали,если эта ошибка будет не от нашего класса ApiError(мы обрабатывали какие-то конкретные ошибки,типа UnauthorizedError,ошибки при авторизации и тд),а какая-то другая,то она будет обработана как обычная ошибка(просто выведена в логи,мы это там прописали),вызывая эту функцию next(),мы попадаем в наш middleware error-middleware(который подключили в файле index.js)

        }

    }


    // функция для получения блюда по id
    async getMealId(req, res, next) {

        // отличие req.params от req.query заключается в том,что в req.params указываются параметры в самом url до эндпоинта на бэкэнде(в node js в данном случае,типа /api/getProducts) через :(типа /:id,динамический параметр id),а req.query - это параметры,которые берутся из url(которые дополнительно добавили с фронтенда к url) через знак ?(типа ?name=bob)

        const { id } = req.params; // берем из параметров запроса поле id

        try {

            const meal = await mealModel.findById(id); // находим объект блюда по id,который мы передали с фронтенда с помощью функции findById


            return res.json(meal);  // возвращаем на клиент массив объектов блюд meals

        } catch (e) {

            next(e); // вызываем функцию next()(параметр этой функции getMeals) и туда передаем ошибку,в этот next() попадает ошибка,и если ошибка будет от нашего класса ApiError(наш класс обработки ошибок,то есть когда мы будем вызывать функцию из нашего класса ApiError для обработки определенной ошибки,то эта функция будет возвращать объект с полями message и тд,и этот объект будет попадать в эту функцию next(в наш errorMiddleware) у этой нашей функции getMeals,и будет там обрабатываться),то она будет там обработана с конкретным сообщением,которое мы описывали,если эта ошибка будет не от нашего класса ApiError(мы обрабатывали какие-то конкретные ошибки,типа UnauthorizedError,ошибки при авторизации и тд),а какая-то другая,то она будет обработана как обычная ошибка(просто выведена в логи,мы это там прописали),вызывая эту функцию next(),мы попадаем в наш middleware error-middleware(который подключили в файле index.js)

        }

    }

}

export default new MealController(); // экспортируем объект на основе класса MealController