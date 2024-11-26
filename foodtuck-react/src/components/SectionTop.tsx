import { MutableRefObject, useRef } from "react";
import { Link } from "react-router-dom";
import { useIsOnCreen } from "../hooks/useIsOnScreen";

const SectionTop = ()=>{

    const sectionTopRef = useRef(null); // создаем ссылку на html элемент и помещаем ее в переменную sectionTopRef, указываем в useRef null,так как используем typeScript

    const onScreen = useIsOnCreen(sectionTopRef); // вызываем наш хук useIsOnScreen(),куда передаем ссылку на html элемент(в данном случае на sectionTop),и этот хук возвращает объект состояний,который мы помещаем в переменную onScreen

    return(
        // делаем проверку в className,если onScreen.sectionTopIntersecting(если состояние sectionTopIntersecting true) true,то есть этот html элемент сейчас наблюдается обзервером,то указываем такие классы,в другом случае другие
        <section id="sectionTop" className={onScreen.sectionTopIntersecting ? "sectionTop sectionTop__active" : "sectionTop"} ref={sectionTopRef} >
            <div className="container">
                <div className="sectionTop__inner">
                    <div className="sectionTop__leftBlock">
                        <h4 className="sectionTop__leftBlock-subtitle">Healthy & Testy Food</h4>
                        <h2 className="sectionTop__leftBlock-title">Enjoy Healthy Life
                        & Testy Food.</h2>
                        <p className="sectionTop__leftBlock-text">Dolor sit amet, consectetur adipiscing elit.
                        Varius sed pharetra dictum neque massa congue</p>
                        <Link to="/catalog" className="sectionTop__leftBlock-link">Show more</Link>
                    </div>
                    <img src="/images/sectionTop/GroupFoodDish.png" alt="" className="sectionTop__rightBlockImg" />
                </div>
            </div>
        </section>
    )
}

export default SectionTop;