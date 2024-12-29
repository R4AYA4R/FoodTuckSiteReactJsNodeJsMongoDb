import { model, Schema } from "mongoose";

// создаем схему,которая описывает то,как будет выглядеть объект в базе данных mongodb (в данном случае создаем схему(сущность) для объекта блюда корзины),описываем поля
const CartMealSchema = new Schema({

    usualProductId:{type:String,required:true}, // указываем поле для id объекта блюда из обычного каталога,потом на фронтенде будем использовать это поле,чтобы перейти на страницу товара(блюда) каталога

    category:{type:String,required:true},   

    price:{type:Number,required:true}, // указываем этому полю тип Number(для любых чисел,обычных и с запятой типа float)

    priceFilter:{type:String,required:true},

    amount:{type:Number,required:true},

    totalPrice:{type:Number,required:true},

    rating:{type:Number,required:true},

    image:{type:String,required:true},

    forUser:{type:String,required:true} // указываем поле,в котором будем хранить id пользователя,для которого этот объект товара(блюда) в корзине

})

export default model('cartMeal',CartMealSchema); // экспортируем модель,которая будет называться 'cartMeal'(указываем это первым параметром),и построена на основе нашей схемы CartMealSchema(передаем ее вторым параметром)