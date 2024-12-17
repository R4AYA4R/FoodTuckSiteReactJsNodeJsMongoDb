
import { useRef } from "react";
import { useIsOnCreen } from "../hooks/useIsOnScreen";

const SectionSignUpTop = () => {

    const sectionCatalogTopRef = useRef(null); // создаем ссылку на html элемент и помещаем ее в переменную sectionTopRef, указываем в useRef null,так как используем typeScript

    const onScreen = useIsOnCreen(sectionCatalogTopRef); // вызываем наш хук useIsOnScreen(),куда передаем ссылку на html элемент(в данном случае на sectionTop),и этот хук возвращает объект состояний,который мы помещаем в переменную onScreen

    return (
        <section id="sectionCatalogTop" className={onScreen.sectionCatalogTopIntersecting ? "sectionImportantFood sectionImportantFood__active sectionCatalogTop" : "sectionImportantFood sectionCatalogTop"} ref={sectionCatalogTopRef}>
            <div className="container">
                <div className="sectionCatalogTop__inner">
                    <h2 className="sectionCatalogTop__title">Sign In</h2>
                    <div className="sectionCatalogTop__info">
                        <p className="sectionCatalogTop__text">Home</p>
                        <img src="/images/sectionCatalog/CaretRight (1).png" alt="" className="sectionCatalogTop__img" />
                        <p className="sectionCatalogTop__textActive">Sign In</p>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default SectionSignUpTop;