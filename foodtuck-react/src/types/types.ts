
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