import UserDto from "../dtos/userDto.js";
import ApiError from "../exceptions/ApiError.js";
import roleModel from "../models/roleModel.js";
import userModel from "../models/userModel.js";

import bcrypt from 'bcrypt'; // импортируем bcrypt для хеширования пароля(в данном случае импортируем вручную)
import tokenService from "./tokenService.js";

import commentModel from "../models/commentModel.js";

import cartMealModel from "../models/cartMealModel.js";

// создаем класс UserService для сервиса пользователей(их удаление,добавление и тд)
class UserService {

    // используем throw для ошибки(когда используем throw(то мы указываем,что это типа исключение,которое нужно обрабатывать с помощью try catch в родительской функции),то ошибка идет к функции выше,к родительской функции,в которой эта функция была вызвана,и если у этой родительской функции не было обработки ошибок с помощью try catch,то будет ошибка,что не обработано исключение(то есть ошибка,но не та,которую мы хотели обработать),в данном случае,когда мы указываем throw ошибку,то она идет в родительскую функцию и там срабатывает блок catch,и в этом блоке catch мы описали,что передаем ошибку в функцию next(наш errorMiddleware),где она будет обработана,а при использовании return Error(типа возвращаем ошибку),то нужно обрабатывать где-то(в другой функции) возврат этой ошибки,так,например,в функции для эндпоинта есть функция callback next,и когда мы возвращаем ошибку с помощью return в функции для эндпоинта,то эта ошибка передается в функцию next и там уже обрабатывается(мы это сами прописывали,нужно для этого отдельно подключить свою функци типа errorMiddleware и там обрабатывать ошибку))

    // функция регистрации,принимает в параметрах email,userName, и password(которые мы будем получать в теле запроса)
    async registration(email, password, userName) {

        const candidate = await userModel.findOne({ email }); // ищем в базе данных пользователя с таким же email,как и параметр этой функции email с помощью функции findOne() у нашей UserModel,передаем в параметре объект и поле email(по этому полю будет осуществляться поиск) и помещаем результат функции findOne(true или false,в зависимости,найден ли такой объект с таким же значением в поле email,как и параметр этой функции email) в переменную candidate

        // если candidate true,то есть такой пользователь с таким email уже есть в базе данных
        if (candidate) {
            throw ApiError.BadRequest(`Пользователь с адресом ${email} уже существует`); // вместо throw new Error указываем throw ApiError(наш класс для обработки ошибок),указываем у него функцию BadRequest,то есть показываем ошибку с сообщением
        }

        const hashPassword = await bcrypt.hash(password, 3); // хешируем пароль с помощью функции hash() у bcrypt,первым параметром передаем пароль,а вторым - соль,степень хеширования(чем больше - тем лучше захешируется,но не нужно слишком большое число,иначе будет долго хешироваться пароль)

        const userRole = await roleModel.findOne({ value: "USER" }); // получаем роль из базы данных со значением USER и помещаем ее в переменную userRole

        const user = await userModel.create({ email, password: hashPassword, userName, role: userRole.value }); // создаем объект с полями email и password в базу данных и помещаем этот объект в переменную user,в поле password помещаем значение из переменной hashPassword,то есть уже захешированный пароль,и указываем в объекте еще поле activationLink(в данном случае не делаем активацию аккаунта по почте,поэтому не указываем здесь поле activationLink),в поле role указываем наш userRole.value(значение роли,которую мы получили из базы данных выше),так как мы получили объект из базы данных,а нам надо из него достать само значение

        const userDto = new UserDto(user); // помещаем в переменную userDto объект,созданный на основе нашего класса UserDto и передаем в параметре конструктора модель(в данном случае объект user,который мы создали в базе данных,в коде выше),в итоге переменная userDto(объект) будет обладать полями id,email,isActivated(в данном случае не делаем активацию аккаунта по почте,поэтому не будет тут у объекта пользователя поля isActivated),которую можем передать как payload(данные,которые будут помещены в токен) в токене


        const tokens = tokenService.generateTokens({ ...userDto });  // помещаем в переменную tokens пару токенов,refresh и access токены,которые создались в нашей функции generateTokens(),передаем в параметре payload(данные,которые будут спрятаны в токен),в данном случае передаем в параметре объект,куда разворачиваем все поля объекта userDto

        await tokenService.saveToken(userDto.id, tokens.refreshToken); // сохраняем refresh токен в базу данных,используя нашу функцию saveToken,передаем в параметрах userDto.id(id пользователя,который создали в базе данных) и refreshToken,который мы сгенерировали выше и поместили в объект tokens

        // возвращаем все поля объекта tokens(то есть access и refresh токены),и в поле user указываем значение userDto
        return {
            ...tokens,
            user: userDto
        }

    }


    async login(email, password) {

        const user = await userModel.findOne({ email }); // ищем в базе данных объект с полем email и значением как параметр email этой функции login,то есть проверяем,зарегестрирован ли пользователь вообще,и помещаем найденный(если он найден) объект в переменную user

        // если user false(или null),то есть такой пользователь не найден
        if (!user) {

            // используем throw для ошибки(когда используем throw(то мы указываем,что это типа исключение,которое нужно обрабатывать с помощью try catch в родительской функции),то ошибка идет к функции выше,к родительской функции,в которой эта функция была вызвана,и если у этой родительской функции не было обработки ошибок с помощью try catch,то будет ошибка,что не обработано исключение(то есть ошибка,но не та,которую мы хотели обработать),в данном случае,когда мы указываем throw ошибку,то она идет в родительскую функцию и там срабатывает блок catch,и в этом блоке catch мы описали,что передаем ошибку в функцию next(наш errorMiddleware),где она будет обработана,а при использовании return Error(типа возвращаем ошибку),то нужно обрабатывать где-то(в другой функции) возврат этой ошибки,так,например,в функции для эндпоинта есть функция callback next,и когда мы возвращаем ошибку с помощью return в функции для эндпоинта,то эта ошибка передается в функцию next и там уже обрабатывается(мы это сами прописывали,нужно для этого отдельно подключить свою функци типа errorMiddleware и там обрабатывать ошибку))
            throw ApiError.BadRequest('Пользователь с таким email не найден');  // бросаем ошибку с помощью нашего ApiError,указываем у него функцию BadRequest и передаем туда сообщение

        }

        const isPassEquals = await bcrypt.compare(password, user.password); // сравниваем пароль,который отправил пользователь с захешированным паролем в базе данных,используем функцию compare() у bcrypt,передаем туда первым параметром пароль,который пользователь отправил(параметр этой функции login),а вторым параметром передаем пароль из базы данных(то есть пароль,который есть у объекта user(мы его нашли в переменной user по email))

        // если isPassEquals false(или null),то есть пароли не одинаковы
        if (!isPassEquals) {

            throw ApiError.BadRequest('Неверный пароль'); // бросаем ошибку с помощью нашего ApiError,указываем у него функцию BadRequest и передаем туда сообщение

        }

        const userDto = new UserDto(user); // помещаем в переменную userDto объект,созданный на основе нашего класса UserDto и передаем в параметре конструктора модель(в данном случае объект user,который мы создали в базе данных,в коде выше),в итоге переменная userDto(объект) будет обладать полями id,email,userName,role и которую можем передать как payload(данные,которые будут помещены в токен) в токене

        const tokens = tokenService.generateTokens({ ...userDto });  // помещаем в переменную tokens пару токенов,refresh и access токены,которые создались в нашей функции generateTokens(),передаем в параметре payload(данные,которые будут спрятаны в токен),в данном случае передаем в параметре объект,куда разворачиваем все поля объекта userDto

        await tokenService.saveToken(userDto.id, tokens.refreshToken);  // сохраняем refresh токен в базу данных,используя нашу функцию saveToken,передаем в параметрах userDto.id(id пользователя,который создали в базе данных,в данном случае,id пользователя,который мы нашли в базе данных по email,так как эта функция login) и refreshToken,который мы сгенерировали выше и поместили в объект tokens

        // возвращаем все поля объекта tokens(то есть access и refresh токены),и в поле user указываем значение userDto
        return {
            ...tokens,
            user: userDto
        }

    }


    async refresh(refreshToken) {

        // если refreshToken false,то есть его нету
        if (!refreshToken) {
            throw ApiError.UnauthorizedError(); // бросаем ошибку с помощью нашего ApiError,указываем у него функцию UnauthorizedError(),если у пользователя токена нет,то он и не авторизован
        }

        const userData = tokenService.validateRefreshToken(refreshToken); // вызываем нашу функцию validateRefreshToken(),передаем туда refreshToken,помещаем в переменную userData,payload данные(данные,которые мы помещали в токен,id пользователя и тд),которые верифицировали с помощью jwt.verify() в нашей фукнции validateRefreshToken(),если будет ошибка при верификации токена в нашей функции validateRefreshToken(),то будет возвращен null(это мы прописали в нашей функции validateRefreshToken())

        const tokenFromDb = await tokenService.findToken(refreshToken); // ищем такой токен в базе данных,помещаем найденный токен в переменную tokenFromDb,используя нашу функцию findToken(),куда передаем в параметре refreshToken

        // если userData false(или null) или tokenFromDb false(или null),то есть пользователь не авторизован
        if (!userData || !tokenFromDb) {
            throw ApiError.UnauthorizedError(); // бросаем ошибку с помощью нашего ApiError,указываем у него функцию UnauthorizedError(),если у пользователя токена нет,то он и не авторизован
        }

        const user = await userModel.findById(userData.id); // находим пользователя по id,который равен id у userData(то есть данные о пользователе,которые мы верифицировали из refresh токена выше в коде),который верифицировали из токена выше в коде с помощью нашей функции validateRefreshToken()

        const userDto = new UserDto(user); // помещаем в переменную userDto объект,созданный на основе нашего класса UserDto и передаем в параметре конструктора модель(в данном случае объект user,который мы создали в базе данных,в коде выше),в итоге переменная userDto(объект) будет обладать полями id,email,userName,role и которую можем передать как payload(данные,которые будут помещены в токен) в токене

        const tokens = tokenService.generateTokens({ ...userDto }); // помещаем в переменную tokens пару токенов(наша функция generateTokens() их возвращает),refresh и access токены,которые создались в нашей функции generateTokens(),передаем в параметре payload(данные,которые будут спрятаны в токен),в данном случае передаем в параметре объект,куда разворачиваем все поля объекта userDto

        await tokenService.saveToken(userDto.id, tokens.refreshToken); // сохраняем refresh токен в базу данных,используя нашу функцию saveToken,передаем в параметрах userDto.id(id пользователя,который создали в базе данных,в данном случае,который нашли в базе данных по id,который достали из refresh токена с помощью нашей функции validateRefreshToken) и refreshToken,который мы сгенерировали выше и поместили в объект tokens

        // возвращаем все поля объекта tokens(то есть access и refresh токены),и в поле user указываем значение userDto
        return {
            ...tokens,
            user: userDto
        }

    }


    // функция для выхода из аккаунта,параметром принимает refreshToken 
    async logout(refreshToken) {

        const token = await tokenService.removeToken(refreshToken); // удаляем refreshToken из базы данных,вызывая нашу функцию removeToken(),передавая в параметре refreshToken

        return token; // возвращаем токен(в данном случае это будет удаленный объект из базы данных с таким значением refreshToken как и в параметре этой функции logout, но в данном случае возвращается не сам удаленный объект токена из базы данных, а объект с полем deletedCount и значением 1,типа был удален объект)

    }


    // функция для изменения данных пользователя в базе данных
    async changeInfo(userId, name, email, errors) {

        const user = await userModel.findById(userId); // находим объект пользователя по id,который передали с фронтенда

        // если user false,то есть такой пользователь не найден
        if (!user) {

            throw ApiError.BadRequest('Такой пользователь не найден'); // бросаем ошибку

        }

        // если параметр name (который мы взяли с фронтенда) true,то есть в name есть какое-то значение,то изменяем его у пользователя
        if (name) {

            // если name.length < 3(если параметр name,то есть новое имя пользователя,которое мы взяли с фронтенда, по количеству символов меньше трех) или name.length > 20,то показываем ошибку,в другом случае изменяем имя пользователя
            if (name.length < 3 || name.length > 20) {

                throw ApiError.BadRequest('Name must be 3 - 20 characters');

            } else {

                user.userName = name; // изменяем поле userName у user(объект пользователя) на name,который передали с фронтенда

                await user.save(); // сохраняем объект пользователя в базе данных

            }

        }

        // если параметр email (который мы взяли с фронтенда) true,то есть в email есть какое-то значение,то изменяем его у пользователя
        if (email) {

            const userEmailFounded = await userModel.findOne({ email }); // ищем пользователя в базе данных,у которого поле email равно параметру email,который мы передали с фронтенда(то есть новому email,на который пользователь хочет изменить),если такой пользователь не будет найден,то переменная userEmailFounded будет равна null

            console.log(userEmailFounded);

            // если errors.isEmpty() false,то есть массив ошибок не пустой,этот параметр errors мы передали в эту функцию changeInfo из userController(этот параметр errors является результатом валидации поля email с помощью валидатора body(то есть если есть ошибки при валидации поля email,то показываем ошибку),это мы прописывали у эндпоинта /changeAccInfo)
            if (!errors.isEmpty()) {

                throw ApiError.BadRequest('Enter email correctly', errors.array()); // бросаем ошибку и в нашу функцию BadRequest() передаем сообщение для ошибки и массив ошибок,полученных при валидации с помощью errors.array()

            } else if (userEmailFounded) {
                // если userEmailFounded true,то есть такой пользователь с такой почтой,которую пользователь хочет сделать, уже найден,то показываем ошибку,что такая почта уже существует

                throw ApiError.BadRequest('This email already exists');


            } else {

                user.email = email; // изменяем поле email у user(объект пользователя) на email,который передали с фронтенда

                await user.save(); // сохраняем объект пользователя в базе данных

            }

        }

        const userDto = new UserDto(user);  // создаем дтошку,то есть выбрасываем из модели user базы данных все не нужное,помещаем в переменную userDto объект,созданный на основе нашего класса UserDto и передаем в параметре конструктора модель(в данном случае объект user,который мы нашли в базе данных по email,в коде выше),в итоге переменная userDto(объект) будет обладать полями id,email,isActivated,userName

        return userDto; // в данном случае возвращаем уже обновленный объект пользователя (userDto, только с определенными полями,не всеми,которые есть в базе данных)

    }


    // функция для изменения пароля пользователя в базе данных
    async changePass(userId,currentPass,newPass) {

        const user = await userModel.findById(userId); // ищем объект пользователя в базе данных,у которого id равен параметру userId,который мы передали этой функции changePass

        const isEqualPass = await bcrypt.compare(currentPass,user.password); // сравниваем пароль,который отправил пользователь с захешированным паролем в базе данных,используем функцию compare() у bcrypt,передаем туда первым параметром пароль,который пользователь отправил(параметр currentPass этой функции changePass),а вторым параметром передаем пароль из базы данных(то есть захешированный пароль,который есть у объекта user(мы его нашли в переменной user по userId))

        // если isEqualPass false,то есть пароли не одинаковы
        if(!isEqualPass){
            throw ApiError.BadRequest('Wrong current password'); // бросаем ошибку с помощью нашего ApiError,указываем у него функцию BadRequest и передаем туда сообщение
        }

        const newHashPassword = await bcrypt.hash(newPass,3); // хешируем пароль с помощью функции hash() у bcrypt,первым параметром передаем пароль,а вторым - соль,степень хеширования(чем больше - тем лучше захешируется,но не нужно слишком большое число,иначе будет долго хешироваться пароль)

        user.password = newHashPassword; // изменяем поле password у объекта user,то есть меняем пароль пользователя на новый захешированный пароль в переменной newHashPassword

        await user.save();  // сохраняем объект пользователя в базе данных,чтобы в данном случае сохранился новый пароль пользователя

        const userDto = new UserDto(user);  // создаем дтошку,то есть выбрасываем из модели user базы данных все не нужное,помещаем в переменную userDto объект,созданный на основе нашего класса UserDto и передаем в параметре конструктора модель(в данном случае объект user,который мы нашли в базе данных по id,в коде выше),в итоге переменная userDto(объект) будет обладать полями id,email,isActivated,userName

        return userDto; // возвращаем объект userDto только с определенными полями,не всеми,которые есть в базе данных

    }

}

export default new UserService(); // экспортируем уже объект на основе нашего класса UserService