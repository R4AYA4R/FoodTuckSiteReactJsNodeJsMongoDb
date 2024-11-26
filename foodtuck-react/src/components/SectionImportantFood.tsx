import { useRef } from "react";
import { Link } from "react-router-dom";
import { useIsOnCreen } from "../hooks/useIsOnScreen";

const SectionImportantFood = () => {

    const sectionImportantFoodRef = useRef(null); // создаем ссылку на html элемент и помещаем ее в переменную sectionTopRef, указываем в useRef null,так как используем typeScript

    const onScreen = useIsOnCreen(sectionImportantFoodRef); // вызываем наш хук useIsOnScreen(),куда передаем ссылку на html элемент(в данном случае на sectionTop),и этот хук возвращает объект состояний,который мы помещаем в переменную onScreen

    return (
        <section id="sectionImportantFood" className={onScreen.sectionImportantFoodIntersecting ? "sectionImportantFood sectionImportantFood__active" : "sectionImportantFood"} ref={sectionImportantFoodRef} >
            <div className="container">
                <div className="sectionImportantFood__inner">
                    <div className="sectionImportantFood__leftBlock">
                        <img src="/images/sectionImportantFood/SouceImg.png" alt="" className="sectionImportantFood__leftBlock-imgSouce" />
                        <div className="sectionImportantFood__leftBlock-imgBlock">
                            <img src="/images/sectionImportantFood/NaggetsImg.png" alt="" className="sectionImportantFood__imgBlock-imgNaggets" />
                            <img src="/images/sectionImportantFood/SaladDishImg.png" alt="" className="sectionImportantFood__imgBlock-img" />
                        </div>
                    </div>
                    <div className="sectionImportantFood__rightBlock">
                        <div className="sectionTop__leftBlock">
                            <h4 className="sectionImportantFood__rightBlock-subtitle">About us</h4>
                            <h2 className="sectionImportantFood__rightBlock-title">Food is an important 
                            part Of a balanced Diet</h2>
                            <p className="sectionTop__leftBlock-text">Consectetur adipiscing elit. Quisque diam pellentesque bibendum non dui volutpat fringilla bibendum. Urna, elit augue urna, vitae feugiat pretium donec id elementum. Ultrices mattis  vitae mus risus. Lacus nisi, et ac dapibus sit eu velit in consequat.</p>
                            <Link to="/catalog" className="sectionTop__leftBlock-link">Show more</Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default SectionImportantFood;