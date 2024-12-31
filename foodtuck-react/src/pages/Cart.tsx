import { ChangeEvent, useEffect, useRef, useState } from "react";
import SectionCartTop from "../components/SectionCartTop";
import { useIsOnCreen } from "../hooks/useIsOnScreen";
import MealItemCart from "../components/MealItemCart";
import { useTypedSelector } from "../hooks/useTypedSelector";
import { useQuery } from "@tanstack/react-query";
import { AuthResponse, IMealCart } from "../types/types";
import axios from "axios";
import { API_URL } from "../http/http";
import { useActions } from "../hooks/useActions";

const Cart = () => {

    // const sectionImportantFoodRef = useRef(null); // создаем ссылку на html элемент и помещаем ее в переменную sectionTopRef, указываем в useRef null,так как используем typeScript

    // const onScreen = useIsOnCreen(sectionImportantFoodRef); // вызываем наш хук useIsOnScreen(),куда передаем ссылку на html элемент(в данном случае на sectionTop),и этот хук возвращает объект состояний,который мы помещаем в переменную onScreen

    const [subtotalCheckPrice,setSubtotalCheckPrice] = useState<number>();

    const { isAuth, user, isLoading } = useTypedSelector(state => state.userSlice); // указываем наш слайс(редьюсер) под названием userSlice и деструктуризируем у него поле состояния isAuth,используя наш типизированный хук для useSelector

    const { setLoadingUser, checkAuthUser, logoutUser } = useActions(); // берем actions для изменения состояния пользователя у слайса(редьюсера) userSlice у нашего хука useActions уже обернутые в диспатч,так как мы оборачивали это в самом хуке useActions


    // // функция для проверки авторизован ли пользователь(валиден ли его refresh токен),вызываем ее в этом компоненте Cart.tsx(страница корзины),чтобы после перезагрузки страницы корзины правильно отображалось авторизован ли пользователь,если эту функцию не вызвать здесь,то после перезагрузки страницы корзины,будет показывать,что пользователь не авторизован,даже если он авторизован
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

    // берем из useQuery поле isFetching,оно обозначает,что сейчас идет загрузка запроса на сервер,используем его для того,чтобы показать лоадер(загрузку) при загрузке запроса на сервер
    const { data: dataMealsCart, refetch: refetchMealsCart, isFetching } = useQuery({
        queryKey: ['mealsCart'],
        queryFn: async () => {

            // делаем запрос на сервер на получение всех товаров корзины,указываем тип данных,которые придут от сервера(тип данных на основе нашего интерфеса IMealCart,и указываем,что это массив IMealCart[]),указываем query параметр userId со значением id пользователя,чтобы получать товары(блюда) корзины для конкретного авторизованного пользователя
            const response = await axios.get<IMealCart[]>(`${API_URL}/getAllMealsCart?userId=${user.id}`);

            return response;
        }
    })

    const dataTotalPrice = dataMealsCart?.data.reduce((prev,curr) => prev + curr.totalPrice, 0);  // проходимся по массиву объектов товаров(блюд) корзины и на каждой итерации увеличиваем переменную prev(это число,и мы указали,что в начале оно равно 0 и оно будет увеличиваться на каждой итерации массива объектов,запоминая старое состояние числа и увеличивая его на новое значение) на curr(текущий итерируемый объект).totalPrice,это чтобы посчитать общую сумму цены всех товаров(блюд)

    // // при запуске сайта(в данном случае при запуске этого компонента,то есть этой страницы) будет отработан код в этом useEffect
    useEffect(() => {

        // если localStorage.getItem('token') true,то есть по ключу token в localStorage что-то есть
        if (localStorage.getItem('token')) {

            checkAuth(); // вызываем нашу функцию checkAuth(),которую описали выше для проверки авторизован ли пользователь

        }

        console.log(isAuth);
        console.log(user.userName);

    }, [])


    // при изменении dataProductsCart?.data(массива объектов корзины),изменяем состояние subtotalCheckPrice на dataTotalPrice,чтобы посчитать общую сумму товаров
    useEffect(()=>{

        setSubtotalCheckPrice(dataTotalPrice);

    },[dataMealsCart?.data])


    return (
        <main className="main">
            <SectionCartTop />
            {/* из-за того,что мы отслеживаем загрузку запроса на сервер(isFetching) для получения товаров корзины,то мы не можем тут использовать наш хук useIsOnScreen для intersectionObserver для показа анимации появления элемента корзины */}
            {/* <section id="sectionImportantFood" className={onScreen.sectionImportantFoodIntersecting ? "sectionImportantFood sectionImportantFood__active sectionCart" : "sectionImportantFood sectionCart"} ref={sectionImportantFoodRef}> */}
            <section className="sectionImportantFood__active sectionCart">
                <div className="container">
                    <div className="sectionCart__inner">
                        <div className="sectionCart__table">
                            <div className="sectionCart__table-names">
                                <p className="sectionCart__table-name">Meals</p>
                                <p className="sectionCart__table-name">Price</p>
                                <p className="sectionCart__table-name">Quantity</p>
                                <p className="sectionCart__table-name">Subtotal</p>
                            </div>
                            <div className="sectionCart__table-mainBlock">

                                {/* если user.userName true(то есть пользователь авторизован,если не сделать эту проверку на авторизован ли пользователь,то после выхода из аккаунта и возвращении на страницу корзины товары будут показываться до тех пор,пока не обновится страница,поэтому делаем эту проверку) и dataProductsCart?.data.length true(то есть есть длина массива товаров(блюд) корзины,то есть есть товары(блюда) в корзине),то тогда показываем товары корзины,в другом случае если isFetching true или isLoading true(указываем эту проверку на isLoading,которая отслеживает загрузку запроса на сервер для получения данных авторизован ли пользователь,если эту проверку не сделать,то будет не правильно отображаться лоадер,и сразу будет показывать,что товаров нет,а только через некоторое время будет показывать,что товары есть),то показываем лоадер, и уже в другом случае,если эти условия не верны,то показываем текст,что корзина пустая */}
                                {user.userName && dataMealsCart?.data.length ?
                                    <>
                                        {dataMealsCart.data.map(mealCart =>

                                            <MealItemCart key={mealCart._id} mealCart={mealCart} />

                                        )}

                                        <div className="table__mainBlock-bottomBlock">
                                            <button className="table__bottomBlock-clearCartBtn">Clear Cart</button>
                                            <button className="table__bottomBlock-updateCartBtn">Update Cart</button>
                                        </div>
                                    </>
                                    : isFetching || isLoading ? 
                                    <div className="innerForLoader innerForLoaderCart">
                                        <div className="loader"></div>
                                    </div>
                                    : <h3 className="textEmptyCart">Cart is Empty</h3>
                                }


                            </div>
                        </div>
                        <div className="sectionCart__bill">
                            <div className="bill__topBlock">
                                <div className="sectionCart__bill-item">
                                    <p className="bill__item-text">Cart Subtotal</p>
                                    <p className="bill__item-subText">${subtotalCheckPrice}</p>
                                </div>
                                <div className="sectionCart__bill-item">
                                    <p className="bill__item-textGrey">Shipping Charge</p>
                                    <p className="bill__item-subTextGrey">$10.00</p>
                                </div>
                            </div>
                            <div className="bill__bottomBlock">
                                <div className="sectionCart__bill-item">
                                    <p className="bill__item-text">Total</p>

                                    {/* если subtotalCheckPrice true(то есть в этом состоянии есть значение,в данном случае делаем эту проверку,потому что выдает ошибку,что subtotalCheckPrice может быть undefined),то указываем значение этому тексту как subtotalCheckPrice + 10(в данном случае 10 это типа цена доставки,мы ее прибавляем к общей цене всех товаров(блюд) корзины) */}
                                    <p className="bill__item-subText">${subtotalCheckPrice && subtotalCheckPrice + 10}</p>
                                </div>
                                <button className="bill__bottomBlock-btn">
                                    <p className="bill__btn-text">Proceed to Checkout</p>
                                    <img src="/images/cart/CheckSquareOffset.png" alt="" className="bill__btn-img" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    )
}

export default Cart;