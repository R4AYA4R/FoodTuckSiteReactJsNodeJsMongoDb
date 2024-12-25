import axios from "axios";
import { useEffect } from "react";
import { NavLink } from "react-router-dom";
import { AuthResponse } from "../types/types";
import { API_URL } from "../http/http";
import { useActions } from "../hooks/useActions";
import { useTypedSelector } from "../hooks/useTypedSelector";

const Header = () => {

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


    return (
        <header className="header">
            <div className="container">
                <div className="header__inner">
                    <NavLink to="/" className="header__logo-link"><h2>FoodTuck</h2></NavLink>
                    <ul className="header__menu-list">
                        <li className="menu__list-item">
                            <NavLink to="/" className={({ isActive }) => isActive ? "header__menu-link header__menu-linkActive" : "header__menu-link"}>Home</NavLink>
                        </li>
                        <li className="menu__list-item">
                            <NavLink to="/catalog" className={({ isActive }) => isActive ? "header__menu-link header__menu-linkActive" : "header__menu-link"}>Catalog</NavLink>
                        </li>
                        <li className="menu__list-item">
                            <NavLink to="/aboutUs" className={({ isActive }) => isActive ? "header__menu-link header__menu-linkActive" : "header__menu-link"}>About Us</NavLink>
                        </li>
                        <li className="menu__list-item">
                            <NavLink to="/userPage" className={({ isActive }) => isActive ? "header__menu-link header__menu-linkActive" : "header__menu-link"}>
                                <img src="/images/header/User.png" alt="" className="menu__list-itemImg" />
                            </NavLink>
                        </li>
                        <li className="menu__list-item">
                            <NavLink to="/cart" className={({ isActive }) => isActive ? "header__menu-link  header__menu-linkCart header__menu-linkActive" : "header__menu-link header__menu-linkCart"}>
                                <img src="/images/header/Tote.png" alt="" className="menu__list-itemImg" />
                                <span className="menu__link-spanCart">0</span>
                            </NavLink>
                        </li>
                    </ul>
                </div>
            </div>
        </header>
    )
}

export default Header;