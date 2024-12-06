
// создаем и экспортируем тип для объекта блюда
export interface IMeal{

    _id:number, // указываем поле id с нижним подчеркиванием(_id),чтобы брать id у объекта из базы данных mongodb,так как там id указывается с нижним подчеркиванием 
    name:string,
    price:number,
    priceFilter:string,
    amount:number,
    totalPrice:number,
    rating:number
    image:string,

}

// создаем и экспортируем тип для объекта,который придет от сервера при запросе на товары каталога,указываем поле meals(массив объектов блюд) с типом на основе нашего интерфейса IMeal[],и также для allMeals(в нем будут все объекты блюд без лимитов и состояния страницы пагинации)
export interface IResponseCatalog{
    meals:IMeal[],
    allMeals:IMeal[]
}