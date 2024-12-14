import { useParams } from "react-router-dom";
import SectionProductItemTop from "../components/SectionProductItemTop";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { IMeal } from "../types/types";
import { ChangeEvent, useEffect, useState } from "react";

const ProductItemPage = () => {

    const [tab, setTab] = useState('Desc');

    const [inputAmountValue, setInputAmountValue] = useState(1);

    const params = useParams(); // с помощью useParams получаем параметры из url (в данном случае id товара)

    const { data, refetch } = useQuery({
        queryKey: ['getMealById'],
        queryFn: async () => {

            // делаем запрос на сервер по конкретному id(в данном случае указываем params.id, то есть id,который взяли из url),который достали из url,указываем тип данных,которые вернет сервер(в данном случае наш IMeal для товара(блюда))
            const response = await axios.get<IMeal>(`http://localhost:5000/api/getMealsCatalog/${params.id}`);

            return response;
        }
    })

    const [totalPriceProduct, setTotalPriceProduct] = useState(data?.data.price);



    const changeInputAmountValue = (e: ChangeEvent<HTMLInputElement>) => {

        // если текущее значение инпута > 99,то изменяем состояние инпута цены на 99,указываем + перед e.target.value,чтобы перевести текущее значение инпута из строки в число
        if (+e.target.value > 99) {

            setInputAmountValue(99);

        } else if (+e.target.value <= 0) {

            // если текущее значение инпута < или равно 0,то ставим значение инпуту 0,чтобы меньше 0 не уменьшалось
            setInputAmountValue(0);

        } else {

            setInputAmountValue(+e.target.value);  // изменяем состояние инпута цены на текущее значение инпута,указываем + перед e.target.value,чтобы перевести текущее значение инпута из строки в число

        }

    }

    const handlerMinusAmountBtn = () => {

        // если значение инпута количества товара больше 1,то изменяем это значение на - 1,в другом случае указываем ему значение 1,чтобы после нуля не отнимало - 1
        if (inputAmountValue > 1) {

            setInputAmountValue((prev) => prev - 1);

        } else {

            setInputAmountValue(1);

        }

    }

    const handlerPlusAmountBtn = () => {

        // если значение инпута количества товара меньше 99 и больше или равно 0,то изменяем это значение на + 1,в другом случае указываем ему значение 99,чтобы больше 99 не увеличивалось
        if (inputAmountValue < 99 && inputAmountValue >= 0) {

            setInputAmountValue((prev) => prev + 1);

        } else {

            setInputAmountValue(99);

        }

    }

    // при изменении inputAmountValue и data?.data(в данном случае данные товара на этой странице,полученные с сервера,чтобы при запуске страницы сайта уже было значение в totalPriceProduct,без этого стартовое значение totalPriceProduct не становится на data?.data.price) изменяем состояние totalPriceProduct
    useEffect(() => {

        // если data?.data.price true(то есть она есть),то меняем значение totalPriceProduct,в данном случае делаем эту проверку,так как выдает ошибку,что data?.data.price может быть undefined(то есть ее может не быть)
        if (data?.data) {

            setTotalPriceProduct(data?.data.price * inputAmountValue);

        }

    }, [inputAmountValue, data?.data])

    return (
        <main className="main">
            <SectionProductItemTop meal={data?.data} />
            <section className="sectionProductItemPage">
                <div className="container">
                    <div className="sectionProductItemPage__inner">
                        <div className="sectionProductItemPage__top">
                            <div className="sectionProductItemPage__top-leftBlock">
                                <img src={`/images/sectionMenu/${data?.data.image}`} alt="" className="sectionProductItemPage__leftBlock-img" />
                            </div>
                            <div className="sectionProductItemPage__top-rightBlock">
                                <h2 className="sectionProductItemPage__rightBlock-title">{data?.data.name}</h2>
                                <p className="sectionProductItemPage__rightBlock__text">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque diam pellentesque bibendum non dui volutpat fringilla bibendum. Urna, urna, vitae feugiat pretium donec id elementum. Ultrices mattis sed vitae mus risus. Lacus nisi, et ac dapibus sit eu velit in consequat.</p>
                                <p className="sectionProductItemPage__rightBlock-price">{totalPriceProduct}$</p>
                                <div className="sectionProductItemPage__rightBlock__stars">
                                    <img src="/images/sectionCatalog/StarYellow.png" alt="" className="sectionProductItemPage__stars-img" />
                                    <img src="/images/sectionCatalog/StarYellow.png" alt="" className="sectionProductItemPage__stars-img" />
                                    <img src="/images/sectionCatalog/StarYellow.png" alt="" className="sectionProductItemPage__stars-img" />
                                    <img src="/images/sectionCatalog/StarYellow.png" alt="" className="sectionProductItemPage__stars-img" />
                                    <img src="/images/sectionCatalog/StarGrey.png" alt="" className="sectionProductItemPage__stars-GreyImg" />
                                </div>
                                <div className="sectionProductItemPage__rightBlock-bottomBlock">
                                    <div className="sectionProductItemPage__bottomBlock-inputBlock">
                                        <button className="sectionProductItemPage__inputBlock-minusBtn" onClick={handlerMinusAmountBtn}>
                                            <img src="/images/sectionProductItemPage/Minus (1).png" alt="" className="sectionProductItemPage__inputBlock-minusImg" />
                                        </button>
                                        <input type="number" className="sectionProductItemPage__inputBlock-input" value={inputAmountValue} onChange={changeInputAmountValue} />
                                        <button className="sectionProductItemPage__inputBlock-plustBtn" onClick={handlerPlusAmountBtn}>
                                            <img src="/images/sectionProductItemPage/Plus.png" alt="" className="sectionProductItemPage__inputBlock-plusImg" />
                                        </button>
                                    </div>
                                    <button className="sectionProductItemPage__bottomBlock-btn">
                                        <img src="/images/sectionProductItemPage/Bag.png" alt="" className="sectionProductItemPage__btn-img" />
                                        <p className="sectionProductItemPage__btn-text">Add to cart</p>
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="sectionProductItemPage__descBlock">
                            <div className="descBlock__tabs">
                                <button className={tab === 'Desc' ? "descBlock__tabs-btn descBlock__tabs-btn--active" : "descBlock__tabs-btn"} onClick={() => setTab('Desc')}>Description</button>
                                <button className={tab === 'Reviews' ? "descBlock__tabs-btn descBlock__tabs-btn--active" : "descBlock__tabs-btn"} onClick={() => setTab('Reviews')}>Reviews (0)</button>
                            </div>
                            <div className="descBlock__desc">

                                {tab === 'Desc' &&
                                    <div className="descBlock__descInner">
                                        <p className="descBlock__desc-text">Nam tristique porta ligula, vel viverra sem eleifend nec. Nulla sed purus augue, eu euismod tellus. Nam mattis eros nec mi sagittis sagittis. Vestibulum suscipit cursus bibendum. Integer at justo eget sem auctor auctor eget vitae arcu. Nam tempor malesuada porttitor. Nulla quis dignissim ipsum. Aliquam pulvinar iaculis justo, sit amet interdum sem hendrerit vitae. Vivamus vel erat tortor. Nulla facilisi. In nulla quam, lacinia eu aliquam ac, aliquam in nisl.</p>
                                        <p className="descBlock__desc-text">Suspendisse cursus sodales placerat. Morbi eu lacinia ex. Curabitur blandit justo urna, id porttitor est dignissim nec. Pellentesque scelerisque hendrerit posuere. Sed at dolor quis nisi rutrum accumsan et sagittis massa. Aliquam aliquam accumsan lectus quis auctor. Curabitur rutrum massa at volutpat placerat. Duis sagittis vehicula fermentum. Integer eu vulputate justo. Aenean pretium odio vel tempor sodales. Suspendisse eu fringilla leo, non aliquet sem.</p>
                                        <div className="descBlock__desc-benefitsBlock">
                                            <p className="benefitsBlock__title">Key Benefits</p>
                                            <ul className="benefitsBlock__list">
                                                <li className="benefitsBlock__list-item">
                                                    <img src="/images/sectionAboutCreate/Check (1).png" alt="" className="benefitsBlock__item-img" />
                                                    <p className="benefitsBlock__item-text">Sit amet, consectetur adipiscing elit.
                                                    </p>
                                                </li>
                                                <li className="benefitsBlock__list-item">
                                                    <img src="/images/sectionAboutCreate/Check (1).png" alt="" className="benefitsBlock__item-img" />
                                                    <p className="benefitsBlock__item-text">Maecenas ullamcorper est et massa mattis condimentum.
                                                    </p>
                                                </li>
                                                <li className="benefitsBlock__list-item">
                                                    <img src="/images/sectionAboutCreate/Check (1).png" alt="" className="benefitsBlock__item-img" />
                                                    <p className="benefitsBlock__item-text">Vestibulum sed massa vel ipsum imperdiet malesuada id tempus nisl.
                                                    </p>
                                                </li>
                                                <li className="benefitsBlock__list-item">
                                                    <img src="/images/sectionAboutCreate/Check (1).png" alt="" className="benefitsBlock__item-img" />
                                                    <p className="benefitsBlock__item-text">Etiam nec massa et lectus faucibus ornare congue in nunc.
                                                    </p>
                                                </li>
                                                <li className="benefitsBlock__list-item">
                                                    <img src="/images/sectionAboutCreate/Check (1).png" alt="" className="benefitsBlock__item-img" />
                                                    <p className="benefitsBlock__item-text">Mauris eget diam magna, in blandit turpis.
                                                    </p>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                }

                                {tab === 'Reviews' && 

                                    <div className="descBlock__descInner">
                                        <p>Reviews</p>
                                    </div>
                                    
                                }

                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    )

}

export default ProductItemPage;