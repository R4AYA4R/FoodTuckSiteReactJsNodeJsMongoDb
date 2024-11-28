import { useRef } from "react";
import { useIsOnCreen } from "../hooks/useIsOnScreen";

const SectionMenu = ()=>{

    // в данном случае скопировали эти useRef из другого компонента,а html  элементу section дали такой же id и такие же классы(кроме одного класса нового sectionAboutCreate),так как анимация появления этой секции такая же,как и в другом компоненте,работает все нормально с одинаковыми id для IntersectionObserver(так как секции в разное время срабатывают,пока пользователь доскроллит(докрутит сайт) до определенной секции )
    const sectionImportantFoodRef = useRef(null); // создаем ссылку на html элемент и помещаем ее в переменную sectionTopRef, указываем в useRef null,так как используем typeScript

    const onScreen = useIsOnCreen(sectionImportantFoodRef); // вызываем наш хук useIsOnScreen(),куда передаем ссылку на html элемент(в данном случае на sectionTop),и этот хук возвращает объект состояний,который мы помещаем в переменную onScreen

    return(
        <section id="sectionImportantFood" className={onScreen.sectionImportantFoodIntersecting ? "sectionImportantFood sectionImportantFood__active sectionMenu" : "sectionImportantFood sectionMenu"} ref={sectionImportantFoodRef}>
            <div className="container">
                <div className="sectionMenu__inner">
                    <h2 className="sectionMenu__title">Our Popular Meals</h2>
                    <p className="sectionMenu__subtitle">Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Varius sed pharetra dictum neque massa congue</p>
                    <div className="sectionMenu__meals">
                        <div className="sectionMenu__meals-leftBlock">
                            <div className="meals__item">
                                <div className="meals__item-leftBlock">
                                    <img src="/images/sectionMenu/Lettuce.png" alt="" className="meals__item-img" />
                                    <div className="meals__item-info">
                                        <h4 className="meals__info-title">Lettuce Leaf</h4>
                                        <p className="meals__info-subtitle">Toasted French bread topped with romano, cheddar</p>
                                    </div>
                                </div>
                                <p className="meals__info-price">32$</p>
                            </div>
                            <div className="meals__item">
                                <div className="meals__item-leftBlock">
                                    <img src="/images/sectionMenu/Fresh Breakfast.png" alt="" className="meals__item-img" />
                                    <div className="meals__item-info">
                                        <h4 className="meals__info-title">Fresh Breakfast</h4>
                                        <p className="meals__info-subtitle">Toasted French bread topped with romano, cheddar</p>
                                    </div>
                                </div>
                                <p className="meals__info-price">18$</p>
                            </div>
                        </div>
                        <div className="sectionMenu__meals-rightBlock">
                            <div className="meals__item">
                                <div className="meals__item-leftBlock">
                                    <img src="/images/sectionMenu/Cheese.png" alt="" className="meals__item-img" />
                                    <div className="meals__item-info">
                                        <h4 className="meals__info-title">Glow Cheese</h4>
                                        <p className="meals__info-subtitle">Toasted French bread topped with romano, cheddar</p>
                                    </div>
                                </div>
                                <p className="meals__info-price">38$</p>
                            </div>
                            <div className="meals__item">
                                <div className="meals__item-leftBlock">
                                    <img src="/images/sectionMenu/Pizza.png" alt="" className="meals__item-img" />
                                    <div className="meals__item-info">
                                        <h4 className="meals__info-title">Italian Pizza</h4>
                                        <p className="meals__info-subtitle">Toasted French bread topped with romano, cheddar</p>
                                    </div>
                                </div>
                                <p className="meals__info-price">25$</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default SectionMenu;