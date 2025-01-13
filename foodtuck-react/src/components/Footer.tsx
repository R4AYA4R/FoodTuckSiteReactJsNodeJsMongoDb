import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Link } from "react-router-dom";
import { IAdminFields } from "../types/types";
import $api, { API_URL } from "../http/http";
import { useTypedSelector } from "../hooks/useTypedSelector";
import { useEffect, useState } from "react";

const Footer = () => {

    const [tabChangeTel, setTabChangeTel] = useState(false); // делаем состояние для таба изменения номера телефона для админа(будем показывать или не показывать инпут изменения номера телефона в зависимости от этого состояния)

    const [inputChangeTelValue, setInputChangeTelValue] = useState<string | undefined>('');  // делаем состояние для инпута изменения телефона и указываем ему тип данных как string | (или) undefined(указываем ему,что он может быть  undefined,чтобы не было ошибки,что это состояние не может быть undefined,когда задаем ему первоначальное значение как dataAdminFields?.data.phoneNumber(поле номера телефона из объекта админ полей из базы данных)

    const [errorChangeTel, setErrorChangeTel] = useState(''); // состояние для ошибки при изменении номера телефона в базе данных


    const { user } = useTypedSelector(state => state.userSlice); // указываем наш слайс(редьюсер) под названием userSlice и деструктуризируем у него поле состояния user,используя наш типизированный хук для useSelector

    // создаем функцию запроса и делаем запрос на сервер(при создании функции в useQuery запрос автоматически делается 1 раз при запуске страницы) для получения объекта админ полей(нужных полей текста и тд для сайта,чтобы потом мог админ их изменять в базе данных)
    const { data: dataAdminFields, refetch } = useQuery({
        queryKey: ['adminFields'],
        queryFn: async () => {

            // делаем запрос на сервер на получение объекта админ полей,указываем тип данных,которые придут от сервера(тип данных на основе нашего интерфеса IAdminFields),используем тут обычный axios,так как не нужна здесь проверка на access токен пользователя
            const response = await axios.get<IAdminFields>(`${API_URL}/getAdminFields`);

            return response;
        }
    })


    // при изменении dataAdminFields?.data(объекта админ полей) изменяем состояние inputChangeTelValue на dataAdminFields?.data.phoneNumber(поле номера телефона из объекта админ полей,который взяли из базы данных),делаем этот useEffect,чтобы при загрузке страницы первоначальное значение состояния inputChangeTelValue было как dataAdminFields?.data.phoneNumber,чтобы при показе инпута изменения номера телефона для админа,там сразу было значение dataAdminFields?.data.phoneNumber(поле номера телефона из базы данных),которое можно стереть,если не сделать этот useEffect,то первоначальное значение состояния inputChangeTel не будет задано
    useEffect(() => {

        setInputChangeTelValue(dataAdminFields?.data.phoneNumber);

    }, [dataAdminFields?.data])


    // функция для кнопки для изменения номера телефона в базе данных
    const onClickChangeTel = async () => {

        try {

            const response = await $api.put(`${API_URL}/changeAdminFields`, { ...dataAdminFields?.data, phoneNumber: inputChangeTelValue });  // делаем запрос на сервер(лучше было это вынести в отдельную функцию,но уже сделали так),используем здесь наш axios с определенными настройками($api),которые мы задали ему в файле http,чтобы правильно работали запросы на authMiddleware на проверку на access токен на бэкэнде, и в объект тела запроса разворачиваем весь объект dataAdminFields?.data(который изначально получили из базы данных),разворачиваем весь этот объект dataAdminFields?.data,чтобы не менялись другие поля,которые есть на сайте(то есть даем им такое же значение,как они и были до этого),а меняем только поле phoneNumber на значение состояния inputChangeTelValue(значение инпута изменения телефона)

            console.log(response.data);

            refetch(); // переобновляем данные объекта админ полей

            setTabChangeTel(false); // изменяем значение tabChangeTel на false,чтобы убрать инпут для изменения номера телефона

        } catch (e: any) {

            console.log(e.response?.data?.message);

            return setErrorChangeTel(e.response?.data?.message); // возвращаем и показываем ошибку,используем тут return чтобы если будет ошибка,чтобы код ниже не работал дальше,то есть на этой строчке завершим функцию,чтобы не закрывался таб с инпутом для изменения номера телефона,если есть ошибка

        }

    }


    return (
        <footer className="footer">
            <div className="footer__topBlock">
                <div className="container">
                    <div className="footer__topBlock-inner">
                        <div className="footer__topBlock-leftBlock">
                            <Link to="/" className="topBlock__leftBlock-title">Foodtuck</Link>
                            <p className="footer__leftBlock-text">Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                                Varius sed pharetra dictum neque massa congue</p>
                        </div>
                        <ul className="footer__topBlock-list">
                            <li className="topBlock__list-item">
                                <h4 className="topBlock__item-title">Links</h4>
                            </li>
                            <li className="topBlock__list-item">
                                <Link to="/aboutUs" className="footer__item-link">
                                    <p className="footer__item-linkText">About us</p>
                                </Link>
                            </li>
                            <li className="topBlock__list-item">
                                <Link to="/catalog" className="footer__item-link">
                                    <p className="footer__item-linkText">Our Menu</p>
                                </Link>
                            </li>
                            <li className="topBlock__list-item">
                                <Link to="/cart" className="footer__item-link">
                                    <p className="footer__item-linkText">Cart</p>
                                </Link>
                            </li>
                        </ul>
                        <ul className="footer__topBlock-list">
                            <li className="topBlock__list-item">
                                <h4 className="topBlock__item-title">Contact Us</h4>
                            </li>
                            <li className="topBlock__list-item">
                                <a href="#" className="footer__item-link">
                                    <img src="/images/footer/MapPin.png" alt="" className="footer__item-linkImg" />
                                    <p className="footer__item-linkText">Kolkata India , 3rd Floor, Office 45</p>
                                </a>
                            </li>

                            {/* если состояние таба tabChangeTel false,то показываем номер телефона и кнопку,чтобы изменить номер телефона,если это состояние tabChangeTel будет равно true,то этот блок показываться не будет */}
                            {!tabChangeTel &&

                                <li className="topBlock__list-item footer__changeBlockTel">
                                    <a href="#" className="footer__item-link footer__changeBlockTel-link">
                                        <img src="/images/footer/Phone.png" alt="" className="footer__item-linkImg" />
                                        <p className="footer__item-linkText">{dataAdminFields?.data.phoneNumber}</p>
                                    </a>

                                    {/* если user.role равно 'ADMIN'(то есть пользователь авторизован как администратор),то показываем кнопку админа для изменения номера телефона в базе данных */}
                                    {user.role === 'ADMIN' &&
                                        // в onClick(по клику этой кнопки) изменяем состояние tabChangeTel на true,чтобы показался инпут изменения телефона 
                                        <button className="products__item-deleteBtn sectionProductItemPage__priceBlock-btn" onClick={() => setTabChangeTel(true)}>
                                            <img src="/images/sectionCatalog/Close.png" alt="" className="products__deleteBtn-img" />
                                        </button>
                                    }

                                </li>

                            }

                            {/* если состояние таба tabChangeTel true,то показываем блок с инпутом изменения номера телефона,в другом случае он показан не будет */}
                            {tabChangeTel &&
                                <>
                                    <div className="sectionProductItemPage__priceBlockChange">
                                        <div className="sectionProductItemPage__bottomBlock-inputBlock">
                                            <p className="accountSettings__form-text">Phone Number</p>

                                            <input type="text" className="sectionProductItemPage__inputBlock-input footer__changeTelBlock-input" value={inputChangeTelValue} onChange={(e) => setInputChangeTelValue(e.target.value)} />

                                        </div>

                                        {/* в onClick(при клике на кнопку) указываем нашу функцию onClickChangeTel */}
                                        <button className="sectionProductItemPage__bottomBlock-btn" onClick={onClickChangeTel}>
                                            <p className="sectionProductItemPage__btn-text">Save Changes</p>
                                        </button>
                                    </div>

                                    {/* если errorChangeTel true(то есть в состоянии errorChangeTel что-то есть),то показываем текст ошибки */}
                                    {errorChangeTel &&
                                        <p className="formErrorText footer__changeTelBlock-errorText">{errorChangeTel}</p>
                                    }

                                </>
                            }


                        </ul>
                    </div>
                </div>
            </div>
            <div className="footer__bottomBlock">
                <div className="container">
                    <p className="footer__bottomBlock-text">Copyright © 2000-2020.logo.com. All rights reserved</p>
                </div>
            </div>
        </footer>
    )
}

export default Footer;