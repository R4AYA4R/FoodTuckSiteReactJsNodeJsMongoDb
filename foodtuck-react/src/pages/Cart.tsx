import { ChangeEvent, useRef, useState } from "react";
import SectionCartTop from "../components/SectionCartTop";
import { useIsOnCreen } from "../hooks/useIsOnScreen";
import MealItemCart from "../components/MealItemCart";

const Cart = () => {

    // в данном случае скопировали эти useRef из другого компонента,а html  элементу section дали такой же id и такие же классы(кроме одного класса нового sectionAboutCreate),так как анимация появления этой секции такая же,как и в другом компоненте,работает все нормально с одинаковыми id для IntersectionObserver(так как секции в разное время срабатывают,пока пользователь доскроллит(докрутит сайт) до определенной секции )
    const sectionImportantFoodRef = useRef(null); // создаем ссылку на html элемент и помещаем ее в переменную sectionTopRef, указываем в useRef null,так как используем typeScript

    const onScreen = useIsOnCreen(sectionImportantFoodRef); // вызываем наш хук useIsOnScreen(),куда передаем ссылку на html элемент(в данном случае на sectionTop),и этот хук возвращает объект состояний,который мы помещаем в переменную onScreen


    return (
        <main className="main">
            <SectionCartTop />
            <section id="sectionImportantFood" className={onScreen.sectionImportantFoodIntersecting ? "sectionImportantFood sectionImportantFood__active sectionCart" : "sectionImportantFood sectionCart"} ref={sectionImportantFoodRef}>
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

                                <MealItemCart/>

                            </div>
                        </div>
                        <div className="sectionCart__bill">
                            <div className="bill__topBlock">
                                <div className="sectionCart__bill-item">
                                    <p className="bill__item-text">Cart Subtotal</p>
                                    <p className="bill__item-subText">$120.00</p>
                                </div>
                                <div className="sectionCart__bill-item">
                                    <p className="bill__item-textGrey">Shipping Charge</p>
                                    <p className="bill__item-subTextGrey">$10.00</p>
                                </div>
                            </div>
                            <div className="bill__bottomBlock">
                                <div className="sectionCart__bill-item">
                                    <p className="bill__item-text">Total</p>
                                    <p className="bill__item-subText">$130.00</p>
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