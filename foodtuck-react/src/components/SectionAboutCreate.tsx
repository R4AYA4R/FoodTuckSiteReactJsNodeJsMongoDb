import { Link } from "react-router-dom";
import { useIsOnCreen } from "../hooks/useIsOnScreen";
import { useRef } from "react";

const SectionAboutCreate = () => {

    // в данном случае скопировали эти useRef из другого компонента,а html  элементу section дали такой же id и такие же классы(кроме одного класса нового sectionAboutCreate),так как анимация появления этой секции такая же,как и в другом компоненте,работает все нормально с одинаковыми id для IntersectionObserver(так как секции в разное время срабатывают,пока пользователь доскроллит(докрутит сайт) до определенной секции )
    const sectionImportantFoodRef = useRef(null); // создаем ссылку на html элемент и помещаем ее в переменную sectionTopRef, указываем в useRef null,так как используем typeScript

    const onScreen = useIsOnCreen(sectionImportantFoodRef); // вызываем наш хук useIsOnScreen(),куда передаем ссылку на html элемент(в данном случае на sectionTop),и этот хук возвращает объект состояний,который мы помещаем в переменную onScreen

    return (
        <section id="sectionImportantFood" className={onScreen.sectionImportantFoodIntersecting ? "sectionImportantFood sectionImportantFood__active sectionAboutCreate" : "sectionImportantFood sectionAboutCreate"} ref={sectionImportantFoodRef}>
            <div className="container">
                <div className="sectionAboutCreate__inner">
                    <div className="sectionAboutCreate__leftBlock">
                        <h4 className="sectionImportantFood__rightBlock-subtitle">About us</h4>
                        <h2 className="sectionImportantFood__rightBlock-title">We Create the bestfoody product</h2>
                        <p className="sectionTop__leftBlock-text">Sit amet, consectetur adipiscing elit. Quisque diam pellentesque bibendum non dui volutpat fringilla bibendum. Urna, elit augue urna, vitae feugiat pretium donec id elementum. Ultrices mattis sed vitae mus risus. Lacus nisi, et ac dapibus sit eu velit in consequat.</p>

                        <ul className="sectionAboutCreate__items">
                            <li className="sectionAboutCreate__items-item">
                                <img src="/images/sectionAboutCreate/Check (1).png" alt="" className="sectionAboutCreate__item-img" />
                                <p className="sectionAboutCreate__item-text"> Lacus nisi, et ac dapibus sit eu velit in consequat.</p>
                            </li>
                            <li className="sectionAboutCreate__items-item">
                                <img src="/images/sectionAboutCreate/Check (1).png" alt="" className="sectionAboutCreate__item-img" />
                                <p className="sectionAboutCreate__item-text">  Quisque diam pellentesque bibendum non dui volutpat fringilla </p>
                            </li>
                            <li className="sectionAboutCreate__items-item">
                                <img src="/images/sectionAboutCreate/Check (1).png" alt="" className="sectionAboutCreate__item-img" />
                                <p className="sectionAboutCreate__item-text"> Lorem ipsum dolor sit amet, consectetur adipiscing elit</p>
                            </li>
                        </ul>

                        <Link to="/catalog" className="sectionTop__leftBlock-link">Show more</Link>
                    </div>
                    <div className="sectionAboutCreate__rightBlock">
                        <img src="/images/sectionAboutCreate/Eggs.png" alt="" className="sectionAboutCreate__rightBlock-img" />
                        <div className="sectionAboutCreate__rightBlock-images">
                            <img src="/images/sectionAboutCreate/Steak.png" alt="" className="sectionAboutCreate__rightBlock-img" />
                            <img src="/images/sectionAboutCreate/Burger.png" alt="" className="sectionAboutCreate__rightBlock-img" />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default SectionAboutCreate;