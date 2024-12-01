import { useRef, useState } from "react";
import SectionCatalogTop from "../components/SectionCatalogTop";
import { useIsOnCreen } from "../hooks/useIsOnScreen";

const Catalog = ()=>{

    const [filterCategories,setFilterCategories] = useState('');

    // в данном случае скопировали эти useRef из другого компонента,а html  элементу section дали такой же id и такие же классы(кроме одного класса нового sectionAboutCreate),так как анимация появления этой секции такая же,как и в другом компоненте,работает все нормально с одинаковыми id для IntersectionObserver(так как секции в разное время срабатывают,пока пользователь доскроллит(докрутит сайт) до определенной секции )
    const sectionImportantFoodRef = useRef(null); // создаем ссылку на html элемент и помещаем ее в переменную sectionTopRef, указываем в useRef null,так как используем typeScript

    const onScreen = useIsOnCreen(sectionImportantFoodRef); // вызываем наш хук useIsOnScreen(),куда передаем ссылку на html элемент(в данном случае на sectionTop),и этот хук возвращает объект состояний,который мы помещаем в переменную onScreen


    return(
        <main className="main" >
            <SectionCatalogTop/>
            <section id="sectionImportantFood" className={onScreen.sectionImportantFoodIntersecting ? "sectionImportantFood sectionImportantFood__active sectionCatalog" : "sectionImportantFood sectionCatalog"} ref={sectionImportantFoodRef}>
                <div className="container">
                    <div className="sectionCatalog__inner">
                        <div className="sectionCatalog__filterBar">
                            <div className="sectionCatalog__filterBar-filterBlock">
                                <h3 className="filterBar__filterBlock-title">Category</h3>
                                <label className="filterBar__filterBlock-label" onClick={()=>setFilterCategories('Burgers')}>
                                    <input type="radio" name="radio" className="filterBlock__label-input" />
                                    <span className={filterCategories === 'Burgers' ? "filterBlock__label-radioStyle filterBlock__label-radioStyle--active" : "filterBlock__label-radioStyle"}>
                                        <span className={filterCategories === 'Burgers' ? "label__radioStyle-before label__radioStyle-before--active" : "label__radioStyle-before"}></span>
                                    </span>
                                    <p className="filterBlock__label-text">Burgers</p>
                                </label>
                                <label className="filterBar__filterBlock-label" onClick={()=>setFilterCategories('Drinks')}>
                                    <input type="radio" name="radio" className="filterBlock__label-input" />
                                    <span className={filterCategories === 'Drinks' ? "filterBlock__label-radioStyle filterBlock__label-radioStyle--active" : "filterBlock__label-radioStyle"}>
                                        <span className={filterCategories === 'Drinks' ? "label__radioStyle-before label__radioStyle-before--active" : "label__radioStyle-before"}></span>
                                    </span>
                                    <p className="filterBlock__label-text">Drinks</p>
                                </label>
                                <label className="filterBar__filterBlock-label" onClick={()=>setFilterCategories('Pizza')}>
                                    <input type="radio" name="radio" className="filterBlock__label-input" />
                                    <span className={filterCategories === 'Pizza' ? "filterBlock__label-radioStyle filterBlock__label-radioStyle--active" : "filterBlock__label-radioStyle"}>
                                        <span className={filterCategories === 'Pizza' ? "label__radioStyle-before label__radioStyle-before--active" : "label__radioStyle-before"}></span>
                                    </span>
                                    <p className="filterBlock__label-text">Pizza</p>
                                </label>
                                <label className="filterBar__filterBlock-label" onClick={()=>setFilterCategories('Sandwiches')}>
                                    <input type="radio" name="radio" className="filterBlock__label-input" />
                                    <span className={filterCategories === 'Sandwiches' ? "filterBlock__label-radioStyle filterBlock__label-radioStyle--active" : "filterBlock__label-radioStyle"}>
                                        <span className={filterCategories === 'Sandwiches' ? "label__radioStyle-before label__radioStyle-before--active" : "label__radioStyle-before"}></span>
                                    </span>
                                    <p className="filterBlock__label-text">Sandwiches</p>
                                </label>
                            </div>
                        </div>
                        <div className="sectionCatalog__main">
                            catalog main
                        </div>
                    </div>
                </div>
            </section>
        </main>
    )
}

export default Catalog;