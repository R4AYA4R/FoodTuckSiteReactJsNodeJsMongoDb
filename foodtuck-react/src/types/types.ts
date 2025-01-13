
// создаем и экспортируем тип для объекта блюда
export interface IMeal{

    _id:number, // указываем поле id с нижним подчеркиванием(_id),чтобы брать id у объекта из базы данных mongodb,так как там id указывается с нижним подчеркиванием 
    name:string,
    category:string,
    price:number,
    priceFilter:string,
    amount:number,
    totalPrice:number,
    rating:number
    image:string,

}


// создаем и экспортируем наш тип для объекта товара корзины(IMealCart),указываем,что этот тип IMealCart расширяется(extends) на основе нашего интерфейса(типа) IMeal,то есть в этом типе IMealCart будут все поля,которые есть в типе IMeal и к этим полям будут добавлены поля,которые мы указываем при создании этого типа IMealCart(в данном случае добавляются еще поля usualProductId и forUser)
export interface IMealCart extends IMeal{

    usualProductId:number, // указываем это поле,чтобы туда потом указывать значение id обычного товара(блюда) из каталога,чтобы потом можно было перейти на страницу этого обычного товара(блюда) из корзины
  
    forUser:number // указываем это поле,чтобы указать значение id объекта пользователя,чтобы потом показывать в корзине товары только для определенного авторизованно пользователя

}

// создаем и экспортируем тип для объекта,который придет от сервера при запросе на товары каталога,указываем поле meals(массив объектов блюд) с типом на основе нашего интерфейса IMeal[],и также для allMeals(в нем будут все объекты блюд без лимитов и состояния страницы пагинации)
export interface IResponseCatalog{
    meals:IMeal[],
    allMeals:IMeal[]
}


// создаем и экспортируем интерфейс для объекта пользователя,который приходит от сервера
export interface IUser{
    email:string,
    userName:string,
    id:number,
    role:string
}


// создаем и экспортируем интерфейс для объекта состояния редьюсера для пользователя,указываем ему поле user на основе нашего интерфейса IUser,и остальные поля
export interface IUserInitialState{
    user:IUser,
    isAuth:boolean,
    isLoading:boolean
}

// создаем и экспортируем наш интерфейс для AuthResponse
export interface AuthResponse{
    // указываем здесь поля этого интерфейса(типа) для объекта
    accessToken:string,
    refreshToken:string,
    user:IUser // указываем в поле user объект(с теми полями, которые описаны в IUser) на основе нашего интерфеса IUser
}

// создаем и экспортируем наш интерфейс для объекта комментария
export interface IComment{
    _id:number, // указываем поле id с нижним подчеркиванием(_id),чтобы брать id у объекта из базы данных mongodb,так как там id указывается с нижним подчеркиванием  
    name:string,
    text:string,
    rating:number,
    createdTime:string,
    productNameFor:string
}

// создаем и экспортируем тип для объекта админ полей(нужных полей текста и тд для сайта,чтобы потом мог админ их изменять в базе данных)
export interface IAdminFields {
    _id:number, // указываем поле id с нижним подчеркиванием(_id),чтобы брать id у объекта из базы данных mongodb,так как там id указывается с нижним подчеркиванием  
    phoneNumber:string

}