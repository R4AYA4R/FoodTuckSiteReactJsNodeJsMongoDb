
import { model, Schema } from "mongoose";

// создаем схему,которая описывает то,как будет выглядеть объект в базе данных mongodb (в данном случае создаем схему(сущность) для полей(текста и тд) на сайте,которые сможет изменять админ),описываем поля
const AdminFieldsSchema = new Schema({

    phoneNumber:{type:String, required:true} // создаем поле для номера телефона с типом STRING и required true(что это поле обязательное,то есть в нем не может быть не указано значение)

})

export default model('adminFields',AdminFieldsSchema); // экспортируем модель,которая будет называться 'cartMeal'(указываем это первым параметром),и построена на основе нашей схемы CartMealSchema(передаем ее вторым параметром)