import { useRef, useState } from "react";
import SectionSignUpTop from "../components/SectionSignUpTop";
import { useIsOnCreen } from "../hooks/useIsOnScreen";
import UserFormComponent from "../components/UserFormComponent";
import { useTypedSelector } from "../hooks/useTypedSelector";
import SectionUserPageTop from "../components/SectionUserPageTop";

const UserPage = () => {

    const { isAuth,user } = useTypedSelector(state => state.userSlice); // указываем наш слайс(редьюсер) под названием userSlice и деструктуризируем у него поле состояния isAuth,используя наш типизированный хук для useSelector

    // если isAuth false,то есть пользователь не авторизован(когда возвращается ошибка от сервера от эндпоинта /refresh в функции checkAuth,то isAuth становится типа false,и тогда пользователя типа выкидывает из аккаунта,то есть в данном случае возвращаем компонент формы регистрации и авторизации),то возвращаем компонент формы,вместо страницы пользователя,когда пользотватель логинится и вводит правильно данные,то эта проверка на isAuth тоже работает правильно и если данные при логине были введены верно,то сразу показывается страница пользователя(даже без использования отдельного useEffect)
    if(!isAuth){

        return (
            <main className="main">
                <SectionSignUpTop />
                
                <UserFormComponent/>
            </main>
        )

    }


    return (
        <main className="main">
            
            <SectionUserPageTop/>

            <section className="sectionUserPage">
                <div className="container">
                    userPage userEmail:{user.email}
                </div>
            </section>
        </main>
    )
    


}

export default UserPage;