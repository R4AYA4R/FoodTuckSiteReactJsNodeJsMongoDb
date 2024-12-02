import { ChangeEvent, useEffect, useRef, useState } from "react";
import SectionCatalogTop from "../components/SectionCatalogTop";
import { useIsOnCreen } from "../hooks/useIsOnScreen";

const Catalog = () => {

    const [inputRightRangeValue, setInputRightRangeValue] = useState(124); // состояние для значения правого инпута с типом range,указываем начальное значение 124 в данном случае,чтобы изначально была заполнена вся полоска до ползунка у инпута с типом range

    const [inputRightRangeTrackWidth, setInputRightRangeTrackWidth] = useState(124); // состояние для ширины полоски до ползунка у инпута с типом range,указываем начальное значение 124 в данном случае,чтобы изначально была заполнена вся полоска до ползунка у инпута с типом range

    const inputRightRangeRef = useRef<HTMLDivElement>(null); // переменная для ссылки на html элемент полоски до ползунка у инпута с типом range


    const [inputLeftRangeValue, setInputLeftRangeValue] = useState(124); // состояние для значения левого инпута с типом range,указываем начальное значение 124 в данном случае,чтобы изначально была заполнена вся полоска до ползунка у инпута с типом range

    const inputLeftRangeRef = useRef<HTMLDivElement>(null); // переменная для ссылки на html элемент полоски до ползунка у левого инпута с типом range

    const [inputLeftRangeTrackWidth, setInputLeftRangeTrackWidth] = useState(124); // состояние для ширины полоски до ползунка у левого инпута с типом range,указываем начальное значение 124 в данном случае,чтобы изначально была заполнена вся полоска до ползунка у инпута с типом range



    const [filterCategories, setFilterCategories] = useState('');

    // в данном случае скопировали эти useRef из другого компонента,а html  элементу section дали такой же id и такие же классы(кроме одного класса нового sectionAboutCreate),так как анимация появления этой секции такая же,как и в другом компоненте,работает все нормально с одинаковыми id для IntersectionObserver(так как секции в разное время срабатывают,пока пользователь доскроллит(докрутит сайт) до определенной секции )
    const sectionImportantFoodRef = useRef(null); // создаем ссылку на html элемент и помещаем ее в переменную sectionTopRef, указываем в useRef null,так как используем typeScript

    const onScreen = useIsOnCreen(sectionImportantFoodRef); // вызываем наш хук useIsOnScreen(),куда передаем ссылку на html элемент(в данном случае на sectionTop),и этот хук возвращает объект состояний,который мы помещаем в переменную onScreen


    const OnChangeRangeLeft = (e: ChangeEvent<HTMLInputElement>) => {

        // если текущее значение ипнута с типом range больше,чем состояние для этого инпута с типом range(inputRightRangeValue),то есть больше,чем предыдущее состояние этого инпута(так как в inputRightRangeValue еще не записали значение e.target.value,поэтому inputRightRangeValue еще предыдущее),то изменяем размер(ширину) полоски до ползунка(кружочка у инпута с типом range),указываем + перед e.target.value,чтобы перевести значение этого инпута с типом range из строки(оно по дефолту идет строкой) в числовой тип данных
        if (+e.target.value > inputLeftRangeValue) {


            const widthOffset = +e.target.value - inputLeftRangeValue; // считаем,на какое расстояние увеличить ширину полоски до ползунка у инпута с типом range,текущее значение инпута с типом range(e.target.value) - состояние для этого инпута с типом range(то есть предыдущее значение состояния для этого инпута с типом range (inputRightRangeValue))

            console.log(inputLeftRangeRef.current?.offsetWidth);

            // если inputRightRangeRef.current true,то есть ссылка на всю полоску до ползунка у инпута с типом range true(то есть этот элемент есть),делаем эту проверку,иначе выдает ошибку,что inputRightRangeRef может быть undefined
            if (inputLeftRangeRef.current) {
                // изменяем состояние InputRangeTrackWidth(состояние ширины полоски до ползунка у инпута с типом range) на значение inputRightRangeRef.current?.offsetWidth(ширину полоски до ползунка у инпута с типом range) + widthOffset(разницу,на которую увеличилось значение в инпуте с типом range,то есть на сколько пользователь потянул ползунок)
                setInputLeftRangeTrackWidth(inputLeftRangeRef.current?.offsetWidth + widthOffset);

            }

            // e.target.style.width = `${inputRightRangeRef.current && inputRightRangeRef.current?.offsetWidth + widthOffset}px`;


            setInputLeftRangeValue(+e.target.value); // изменяем состояние inputRightRangeValue(значение состояния инпута с типом range) на e.target.value, указываем + перед e.target.value,чтобы перевести значение этого инпута с типом range из строки(оно по дефолту идет строкой) в числовой тип данных

        }


        // если текущее значение ипнута с типом range меньше,чем состояние для этого инпута с типом range(inputRightRangeValue),то есть меньше,чем предыдущее состояние этого инпута(так как в inputRightRangeValue еще не записали значение e.target.value, то изменяем размер(ширину) полоски до ползунка(кружочка у инпута с типом range),указываем + перед e.target.value,чтобы перевести значение этого инпута с типом range из строки(оно по дефолту идет строкой) в числовой тип данных
        if (+e.target.value < inputLeftRangeValue) {


            const widthOffset = inputLeftRangeValue - +e.target.value; // считаем,на какое расстояние уменьшить ширину полоски до ползунка у инпута с типом range,состояние для этого инпута с типом range(то есть предыдущее значение состояния для этого инпута с типом range (inputRightRangeValue)) - текущее значение инпута с типом range (e.target.value)


            // если inputRightRangeRef.current true,то есть ссылка на всю полоску до ползунка у инпута с типом range true(то есть этот элемент есть),делаем эту проверку,иначе выдает ошибку,что inputRightRangeRef может быть undefined
            if (inputLeftRangeRef.current) {
                // изменяем состояние InputRangeTrackWidth(состояние ширины полоски до ползунка у инпута с типом range) на значение inputRightRangeRef.current?.offsetWidth(ширину полоски до ползунка у инпута с типом range) - widthOffset(разницу,на которую увеличилось значение в инпуте с типом range,то есть на сколько пользователь потянул ползунок)
                setInputLeftRangeTrackWidth(inputLeftRangeRef.current?.offsetWidth - widthOffset);
            }

            // e.target.style.width = `${inputRightRangeRef.current && inputRightRangeRef.current?.offsetWidth - widthOffset}px`;


            setInputLeftRangeValue(+e.target.value); // изменяем состояние inputRightRangeValue(значение состояния инпута с типом range) на e.target.value, указываем + перед e.target.value,чтобы перевести значение этого инпута с типом range из строки(оно по дефолту идет строкой) в числовой тип данных
        }

        console.log(inputRightRangeValue);



    }


    const OnChangeRangeRight = (e: ChangeEvent<HTMLInputElement>) => {

        // если текущее значение ипнута с типом range больше,чем состояние для этого инпута с типом range(inputRightRangeValue),то есть больше,чем предыдущее состояние этого инпута(так как в inputRightRangeValue еще не записали значение e.target.value,поэтому inputRightRangeValue еще предыдущее),то изменяем размер(ширину) полоски до ползунка(кружочка у инпута с типом range),указываем + перед e.target.value,чтобы перевести значение этого инпута с типом range из строки(оно по дефолту идет строкой) в числовой тип данных
        if (+e.target.value > inputRightRangeValue) {


            const widthOffset = +e.target.value - inputRightRangeValue; // считаем,на какое расстояние увеличить ширину полоски до ползунка у инпута с типом range,текущее значение инпута с типом range(e.target.value) - состояние для этого инпута с типом range(то есть предыдущее значение состояния для этого инпута с типом range (inputRightRangeValue))

            console.log(inputRightRangeRef.current?.offsetWidth);

            // если inputRightRangeRef.current true,то есть ссылка на всю полоску до ползунка у инпута с типом range true(то есть этот элемент есть),делаем эту проверку,иначе выдает ошибку,что inputRightRangeRef может быть undefined
            if (inputRightRangeRef.current) {
                // изменяем состояние InputRangeTrackWidth(состояние ширины полоски до ползунка у инпута с типом range) на значение inputRightRangeRef.current?.offsetWidth(ширину полоски до ползунка у инпута с типом range) + widthOffset(разницу,на которую увеличилось значение в инпуте с типом range,то есть на сколько пользователь потянул ползунок)
                setInputRightRangeTrackWidth(inputRightRangeRef.current?.offsetWidth + widthOffset);

            }

            // e.target.style.width = `${inputRightRangeRef.current && inputRightRangeRef.current?.offsetWidth + widthOffset}px`;


            setInputRightRangeValue(+e.target.value); // изменяем состояние inputRightRangeValue(значение состояния инпута с типом range) на e.target.value, указываем + перед e.target.value,чтобы перевести значение этого инпута с типом range из строки(оно по дефолту идет строкой) в числовой тип данных

        }


        // если текущее значение ипнута с типом range меньше,чем состояние для этого инпута с типом range(inputRightRangeValue),то есть меньше,чем предыдущее состояние этого инпута(так как в inputRightRangeValue еще не записали значение e.target.value, то изменяем размер(ширину) полоски до ползунка(кружочка у инпута с типом range),указываем + перед e.target.value,чтобы перевести значение этого инпута с типом range из строки(оно по дефолту идет строкой) в числовой тип данных
        if (+e.target.value < inputRightRangeValue) {


            const widthOffset = inputRightRangeValue - +e.target.value; // считаем,на какое расстояние уменьшить ширину полоски до ползунка у инпута с типом range,состояние для этого инпута с типом range(то есть предыдущее значение состояния для этого инпута с типом range (inputRightRangeValue)) - текущее значение инпута с типом range (e.target.value)


            // если inputRightRangeRef.current true,то есть ссылка на всю полоску до ползунка у инпута с типом range true(то есть этот элемент есть),делаем эту проверку,иначе выдает ошибку,что inputRightRangeRef может быть undefined
            if (inputRightRangeRef.current) {
                // изменяем состояние InputRangeTrackWidth(состояние ширины полоски до ползунка у инпута с типом range) на значение inputRightRangeRef.current?.offsetWidth(ширину полоски до ползунка у инпута с типом range) - widthOffset(разницу,на которую увеличилось значение в инпуте с типом range,то есть на сколько пользователь потянул ползунок)
                setInputRightRangeTrackWidth(inputRightRangeRef.current?.offsetWidth - widthOffset);
            }

            // e.target.style.width = `${inputRightRangeRef.current && inputRightRangeRef.current?.offsetWidth - widthOffset}px`;


            setInputRightRangeValue(+e.target.value); // изменяем состояние inputRightRangeValue(значение состояния инпута с типом range) на e.target.value, указываем + перед e.target.value,чтобы перевести значение этого инпута с типом range из строки(оно по дефолту идет строкой) в числовой тип данных
        }

        console.log(inputRightRangeValue);



    }


    return (
        <main className="main" >
            <SectionCatalogTop />
            <section id="sectionImportantFood" className={onScreen.sectionImportantFoodIntersecting ? "sectionImportantFood sectionImportantFood__active sectionCatalog" : "sectionImportantFood sectionCatalog"} ref={sectionImportantFoodRef}>
                <div className="container">
                    <div className="sectionCatalog__inner">
                        <div className="sectionCatalog__filterBar">
                            <div className="sectionCatalog__filterBar-filterBlock">
                                <h3 className="filterBar__filterBlock-title">Category</h3>
                                <label className="filterBar__filterBlock-label" onClick={() => setFilterCategories('Burgers')}>
                                    <input type="radio" name="radio" className="filterBlock__label-input" />
                                    <span className={filterCategories === 'Burgers' ? "filterBlock__label-radioStyle filterBlock__label-radioStyle--active" : "filterBlock__label-radioStyle"}>
                                        <span className={filterCategories === 'Burgers' ? "label__radioStyle-before label__radioStyle-before--active" : "label__radioStyle-before"}></span>
                                    </span>
                                    <p className="filterBlock__label-text">Burgers</p>
                                </label>
                                <label className="filterBar__filterBlock-label" onClick={() => setFilterCategories('Drinks')}>
                                    <input type="radio" name="radio" className="filterBlock__label-input" />
                                    <span className={filterCategories === 'Drinks' ? "filterBlock__label-radioStyle filterBlock__label-radioStyle--active" : "filterBlock__label-radioStyle"}>
                                        <span className={filterCategories === 'Drinks' ? "label__radioStyle-before label__radioStyle-before--active" : "label__radioStyle-before"}></span>
                                    </span>
                                    <p className="filterBlock__label-text">Drinks</p>
                                </label>
                                <label className="filterBar__filterBlock-label" onClick={() => setFilterCategories('Pizza')}>
                                    <input type="radio" name="radio" className="filterBlock__label-input" />
                                    <span className={filterCategories === 'Pizza' ? "filterBlock__label-radioStyle filterBlock__label-radioStyle--active" : "filterBlock__label-radioStyle"}>
                                        <span className={filterCategories === 'Pizza' ? "label__radioStyle-before label__radioStyle-before--active" : "label__radioStyle-before"}></span>
                                    </span>
                                    <p className="filterBlock__label-text">Pizza</p>
                                </label>
                                <label className="filterBar__filterBlock-label" onClick={() => setFilterCategories('Sandwiches')}>
                                    <input type="radio" name="radio" className="filterBlock__label-input" />
                                    <span className={filterCategories === 'Sandwiches' ? "filterBlock__label-radioStyle filterBlock__label-radioStyle--active" : "filterBlock__label-radioStyle"}>
                                        <span className={filterCategories === 'Sandwiches' ? "label__radioStyle-before label__radioStyle-before--active" : "label__radioStyle-before"}></span>
                                    </span>
                                    <p className="filterBlock__label-text">Sandwiches</p>
                                </label>
                            </div>

                            <div className="sectionCatalog__filterBar-filterBlockPrice">
                                <h3 className="filterBar__filterBlock-title">Price Filter</h3>

                                <div className="filterBlock__priceInputs">

                                    <div className="filterBlock__priceInputs-blockInput">
                                        <input type="range" className="filterBlock__priceInputs-priceInput filterBlock__priceInputs-priceInputLeft" min="0" max="124" value={inputLeftRangeValue} onChange={OnChangeRangeLeft} />

                                        {/* указываем этому диву в style в width значение как у состояния inputRangeTrackWidth(то есть состояние для полоски до ползунка у инпута с типом range),потом в коде выше изменяем это значение,соответственно и изменяем ширину этого div элемента(полоски до ползунка у инпута с типом range) */}
                                        <div className="priceInputs__blockInput-trackInput priceInputs__blockInput-trackInputLeft" style={{ "width": `${inputLeftRangeTrackWidth}px` }} ref={inputLeftRangeRef} ></div>
                                    </div>

                                    <div className="filterBlock__priceInputs-blockInput filterBlock__priceInputs-blockInputRight">
                                        <input type="range" className="filterBlock__priceInputs-priceInput filterBlock__priceInputs-priceInputRight" min="0" max="124" value={inputRightRangeValue} onChange={OnChangeRangeRight}/>

                                        {/* указываем этому диву в style в width значение как у состояния inputLeftRangeTrackWidth(то есть состояние для полоски до ползунка у левого инпута с типом range),потом в коде выше изменяем это значение,соответственно и изменяем ширину этого div элемента(полоски до ползунка у инпута с типом range) */}
                                        <div className="priceInputs__blockInput-trackInput priceInputs__blockInput-trackInputRight" style={{ "width": `${inputRightRangeTrackWidth}px` }} ref={inputRightRangeRef} ></div>
                                    </div>


                                </div>

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