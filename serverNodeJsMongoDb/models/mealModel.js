import { model, Schema } from "mongoose"; // импортируем schema и model,для описани модели в базе данных mongodb(в данном случае импортируем вручную,потому что автоматически не работает)

// если сохранили схему(Schema) для объектов в базе данных и она уже добавилась в mongodb,и мы хотим изменить ее,добавить или убрать ей поля,то нужно удалить ее из mongodb полностью,а потом сохранить в коде уже с изменениями,иначе не будет работать

// создаем schema(схему),она описывает какие поля будет содержать сущность(в данном случае блюда) в базе данных mongodb,указываем поле name с типом String,указываем,что оно будет уникальное(unique:true),то есть одинаковых таких записей в базе данных быть не должно,и указываем,что оно должно быть обязательным(required:true),и также указываем другие поля 
const MealSchema = new Schema({
    name:{type:String,unique:true,required:true},

    category:{type:String,required:true},   

    price:{type:Number,required:true}, // указываем этому полю тип Number(для любых чисел,обычных и с запятой типа float)

    priceFilter:{type:String,required:true},

    amount:{type:Number,required:true},

    totalPrice:{type:Number,required:true},

    rating:{type:Number,required:true},

    image:{type:String,required:true}

})

export default model('Meal',MealSchema); // экспортируем модель,которая будет называться 'Meal'(указываем это первым параметром),и построена на основе нашей схемы MealSchema(передаем ее вторым параметром)