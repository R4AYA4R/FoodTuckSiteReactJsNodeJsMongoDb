
export default class UserDto{
    
    // указываем,какие поля есть у этого класса
    email;
    id;
    userName;
    role;

    // описываем конструктор,который принимает в параметре model
    constructor(model){

        this.email = model.email; // изменяем переменную email этого класса на поле email у model 

        this.id = model._id; // изменяем переменную id этого класса на model._id(указываем нижнее подчеркивание у id,так как mongodb по дефолту ставит нижнее подчеркивание перед id,чтобы показать,что оно не изменяемое,тем самым,мы убираем это нижнее подчеркивание у id)

        this.userName = model.userName;

        this.role = model.role;

    }

}