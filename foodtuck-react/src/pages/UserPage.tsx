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
import AuthService from "../service/AuthService";
import { useLocation } from "react-router-dom";

const UserPage = () => {

    const [tab, setTab] = useState('Dashboard');

    const { isAuth, user, isLoading } = useTypedSelector(state => state.userSlice); // указываем наш слайс(редьюсер) под названием userSlice и деструктуризируем у него поле состояния isAuth,используя наш типизированный хук для useSelector

    const { setLoadingUser, checkAuthUser, logoutUser } = useActions(); // берем actions для изменения состояния пользователя у слайса(редьюсера) userSlice у нашего хука useActions уже обернутые в диспатч,так как мы оборачивали это в самом хуке useActions


    // функция для проверки авторизован ли пользователь(валиден ли его refresh токен)
    const checkAuth = async () => {

        setLoadingUser(true); // изменяем поле isLoading состояния пользователя в userSlice на true(то есть пошла загрузка)

        // оборачиваем в try catch,чтобы отлавливать ошибки
        try {

            // здесь используем уже обычный axios,указываем тип в generic,что в ответе от сервера ожидаем наш тип данных AuthResponse,указываем наш url до нашего роутера(/api) на бэкэнде(API_URL мы импортировали из другого нашего файла) и через / указываем refresh(это тот url,где мы выдаем access и refresh токены на бэкэнде),и вторым параметром указываем объект опций,указываем поле withCredentials true(чтобы автоматически с запросом отправлялись cookies)
            const response = await axios.get<AuthResponse>(`${API_URL}/refresh`, { withCredentials: true });

            console.log(response);

            checkAuthUser(response.data); // вызываем нашу функцию(action) для изменения состояния пользователя и передаем туда response.data(в данном случае это объект с полями accessToken,refreshToken и user,которые пришли от сервера)

        } catch (e: any) {

            console.log(e.reponse?.data?.message); // если была ошибка,то выводим ее в логи,берем ее из ответа от сервера из поля message из поля data у response у e

        } finally {

            // в блоке finally будет выполнен код в независимости от try catch(то есть в любом случае,даже если будет ошибка)
            setLoadingUser(false); // изменяем поле isLoading состояния пользователя в userSlice на false(то есть загрузка закончена)

        }

    }


    // при запуске сайта(в данном случае при запуске этого компонента,то есть этой страницы) будет отработан код в этом useEffect
    useEffect(() => {

        // если localStorage.getItem('token') true,то есть по ключу token в localStorage что-то есть
        if (localStorage.getItem('token')) {

            checkAuth(); // вызываем нашу функцию checkAuth(),которую описали выше для проверки авторизован ли пользователь

        }

        console.log(isAuth);
        console.log(user.userName);

    }, [])


    // функция для выхода из аккаунта
    const logout = async () => {

        // оборачиваем в try catch,чтобы отлавливать ошибки 
        try {

            const response = await AuthService.logout(); // вызываем нашу функцию logout() у AuthService

            logoutUser(); // вызываем нашу функцию(action) для изменения состояния пользователя для выхода из аккаунта и в данном случае не передаем туда ничего

            setTab('Dashboard'); // изменяем состояние таба на dashboard то есть показываем секцию dashboard(в данном случае главный отдел пользователя),чтобы при выходе из аккаунта и входе обратно у пользователя был открыт главный отдел аккаунта,а не настройки или последний отдел,который пользователь открыл до выхода из аккаунта

        } catch (e: any) {

            console.log(e.reponse?.data?.message); // если была ошибка,то выводим ее в логи,берем ее из ответа от сервера из поля message из поля data у response у e 

        }

    }


    // если состояние загрузки true,то есть идет загрузка запроса на сервер,то показываем лоадер(загрузку),если не отслеживать загрузку при функции checkAuth(для проверки на refresh токен при запуске страницы),то будет не правильно работать(только через некоторое время,когда запрос на /refresh будет отработан,поэтому нужно отслеживать загрузку и ее возвращать как разметку страницы,пока грузится запрос на /refresh)
    if (isLoading) {

        // возвращаем тег main с классом main,так как указали этому классу стили,чтобы был прижат header и footer
        return (
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
    if (!isAuth) {

        return (
            <main className="main">
                <SectionSignUpTop />

                <UserFormComponent />
            </main>
        )

    }


    return (
        <main className="main">

            <SectionUserPageTop />

            <section className="sectionUserPage">
                <div className="container">
                    <div className="sectionUserPage__inner">
                        <div className="sectionUserPage__leftBar">
                            <ul className="sectionUserPage__leftBar-menu">
                                <li className={tab === 'Dashboard' ? "leftBar__menu-item leftBar__menu-item--active" : "leftBar__menu-item"} onClick={() => setTab('Dashboard')}>
                                    <img src="/images/sectionUserPage/dashboard 2.png" alt="" className="leftBar__item-img" />
                                    <button className="leftBar__menu-btn" >Dashboard</button>
                                </li>
                                <li className={tab === 'Account Settings' ? "leftBar__menu-item leftBar__menu-item--active" : "leftBar__menu-item"} onClick={() => setTab('Account Settings')}>
                                    <img src="/images/sectionUserPage/dashboard 2 (1).png" alt="" className="leftBar__item-img" />
                                    <button className={tab === 'Account Settings' ? "leftBar__menu-btn leftBar__menu-btn--active" : "leftBar__menu-btn"} >Account Settings</button>
                                </li>
                            </ul>

                            <div className="leftBar__menu-item" onClick={logout}>
                                <img src="/images/sectionUserPage/dashboard 2 (2).png" alt="" className="leftBar__item-img" />
                                <button className="leftBar__menu-btn leftBar__menu-btnLogout">Logout</button>
                            </div>
                        </div>
                        <div className="sectionUserPage__mainBlock">

                            {tab === 'Dashboard' &&
                                <div className="sectionUserPage__mainBlock-inner">
                                    <div className="sectionUserPage__dashboard">
                                        <img src="/images/sectionUserPage/Ellipse 5.png" alt="" className="dashboard__img" />
                                        <h3 className="dashboard__name">{user.userName}</h3>
                                        <p className="dashboard__email">{user.email}</p>
                                        <button className="dashboard__btn" onClick={() => setTab('Account Settings')}>Edit Profile</button>
                                    </div>
                                </div>
                            }

                            {tab === 'Account Settings' &&
                                <div className="sectionUserPage__mainBlock-inner">
                                    Account Settings
                                </div>
                            }

                        </div>
                    </div>
                </div>
            </section>
        </main>
    )



}

export default UserPage;