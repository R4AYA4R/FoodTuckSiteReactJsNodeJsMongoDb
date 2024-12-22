import { useEffect, useRef, useState } from "react";
import SectionSignUpTop from "../components/SectionSignUpTop";
import { useIsOnCreen } from "../hooks/useIsOnScreen";
import UserFormComponent from "../components/UserFormComponent";
import { useTypedSelector } from "../hooks/useTypedSelector";
import SectionUserPageTop from "../components/SectionUserPageTop";
import { useActions } from "../hooks/useActions";
import axios from "axios";
import { AuthResponse } from "../types/types";
import { API_URL } from "../http/http";

const UserPage = () => {

    const { isAuth,user,isLoading} = useTypedSelector(state => state.userSlice); // указываем наш слайс(редьюсер) под названием userSlice и деструктуризируем у него поле состояния isAuth,используя наш типизированный хук для useSelector

    const { setLoadingUser,checkAuthUser } = useActions(); // берем actions для изменения состояния пользователя у слайса(редьюсера) userSlice у нашего хука useActions уже обернутые в диспатч,так как мы оборачивали это в самом хуке useActions


    // функция для проверки авторизован ли пользователь(валиден ли его refresh токен)
    const checkAuth = async () => {

        setLoadingUser(true); // изменяем поле isLoading состояния пользователя в userSlice на true(то есть пошла загрузка)

        // оборачиваем в try catch,чтобы отлавливать ошибки
        try{

            // здесь используем уже обычный axios,указываем тип в generic,что в ответе от сервера ожидаем наш тип данных AuthResponse,указываем наш url до нашего роутера(/api) на бэкэнде(API_URL мы импортировали из другого нашего файла) и через / указываем refresh(это тот url,где мы выдаем access и refresh токены на бэкэнде),и вторым параметром указываем объект опций,указываем поле withCredentials true(чтобы автоматически с запросом отправлялись cookies)
            const response = await axios.get<AuthResponse>(`${API_URL}/refresh`, { withCredentials:true });

            console.log(response);

            checkAuthUser(response.data); // вызываем нашу функцию(action) для изменения состояния пользователя и передаем туда response.data(в данном случае это объект с полями accessToken,refreshToken и user,которые пришли от сервера)

        }catch(e:any){

            console.log(e.reponse?.data?.message); // если была ошибка,то выводим ее в логи,берем ее из ответа от сервера из поля message из поля data у response у e

        } finally {

            // в блоке finally будет выполнен код в независимости от try catch(то есть в любом случае,даже если будет ошибка)
            setLoadingUser(false); // изменяем поле isLoading состояния пользователя в userSlice на false(то есть загрузка закончена)

        }

    }

    
    // при запуске сайта(в данном случае при запуске этого компонента,то есть этой страницы) будет отработан код в этом useEffect
    useEffect(()=>{

        // если localStorage.getItem('token') true,то есть по ключу token в localStorage что-то есть
        if(localStorage.getItem('token')){

            checkAuth(); // вызываем нашу функцию checkAuth(),которую описали выше для проверки авторизован ли пользователь

        }

        console.log(isAuth);
        console.log(user.userName);

    },[])


    // если состояние загрузки true,то есть идет загрузка запроса на сервер,то показываем лоадер(загрузку),если не отслеживать загрузку при функции checkAuth(для проверки на refresh токен при запуске страницы),то будет не правильно работать(только через некоторое время,когда запрос на /refresh будет отработан,поэтому нужно отслеживать загрузку и ее возвращать как разметку страницы,пока грузится запрос на /refresh)
    if(isLoading){

        // возвращаем тег main с классом main,так как указали этому классу стили,чтобы был прижат header и footer
        return(
            <main className="main">
                <div className="container">
                    <div className="innerForLoader">
                        <div className="loader"></div>
                    </div>
                </div>
            </main>
        )

    }


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