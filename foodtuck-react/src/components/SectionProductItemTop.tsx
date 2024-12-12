import { useRef } from "react";
import { useIsOnCreen } from "../hooks/useIsOnScreen";
import { IMeal } from "../types/types";

interface ISectionProductItemTop{

    meal:IMeal | undefined; // указываем тип пропсу meal для этого компонента SectionProductItemTop как тип на основе нашего интерфейса IMeal или undefined(указываем или undefined,так как показывает ошибку,что meal может быть undefined)

}

const SectionProductItemTop = ({meal}:ISectionProductItemTop)=>{

    const sectionCatalogTopRef = useRef(null); // создаем ссылку на html элемент и помещаем ее в переменную sectionTopRef, указываем в useRef null,так как используем typeScript

    const onScreen = useIsOnCreen(sectionCatalogTopRef); // вызываем наш хук useIsOnScreen(),куда передаем ссылку на html элемент(в данном случае на sectionTop),и этот хук возвращает объект состояний,который мы помещаем в переменную onScreen

    return (
        <section id="sectionCatalogTop" className={onScreen.sectionCatalogTopIntersecting ? "sectionImportantFood sectionImportantFood__active sectionCatalogTop" : "sectionImportantFood sectionCatalogTop"} ref={sectionCatalogTopRef}>
            <div className="container">
                <div className="sectionCatalogTop__inner">
                    <h2 className="sectionCatalogTop__title">Our Catalog</h2>
                    <div className="sectionCatalogTop__info">
                        <p className="sectionCatalogTop__text">Catalog</p>
                        <img src="/images/sectionCatalog/CaretRight (1).png" alt="" className="sectionCatalogTop__img" />
                        <p className="sectionCatalogTop__textActive">{meal?.name}</p>
                    </div>
                </div>
            </div>
        </section>
    )

}

export default SectionProductItemTop;