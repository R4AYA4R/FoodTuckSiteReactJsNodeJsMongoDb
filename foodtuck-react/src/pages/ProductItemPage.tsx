import { useParams } from "react-router-dom";
import SectionProductItemTop from "../components/SectionProductItemTop";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { IMeal } from "../types/types";

const ProductItemPage = () => {

    const params = useParams(); // с помощью useParams получаем параметры из url (в данном случае id товара)

    const { data, refetch } = useQuery({
        queryKey: ['getMealById'],
        queryFn: async () => {

            // делаем запрос на сервер по конкретному id(в данном случае указываем params.id, то есть id,который взяли из url),который достали из url,указываем тип данных,которые вернет сервер(в данном случае наш IMeal для товара(блюда))
            const response = await axios.get<IMeal>(`http://localhost:5000/api/getMealsCatalog/${params.id}`);

            return response;
        }
    })

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
                                <p className="sectionProductItemPage__rightBlock-price">{data?.data.price}$</p>
                                <div className="sectionProductItemPage__rightBlock__stars">
                                    <img src="/images/sectionCatalog/StarYellow.png" alt="" className="sectionProductItemPage__stars-img" />
                                    <img src="/images/sectionCatalog/StarYellow.png" alt="" className="sectionProductItemPage__stars-img" />
                                    <img src="/images/sectionCatalog/StarYellow.png" alt="" className="sectionProductItemPage__stars-img" />
                                    <img src="/images/sectionCatalog/StarYellow.png" alt="" className="sectionProductItemPage__stars-img" />
                                    <img src="/images/sectionCatalog/StarGrey.png" alt="" className="sectionProductItemPage__stars-GreyImg" />
                                </div>
                                <div className="sectionProductItemPage__rightBlock-bottomBlock">
                                    <div className="sectionProductItemPage__bottomBlock-inputBlock">
                                        <button className="sectionProductItemPage__inputBlock-minusBtn">
                                            <img src="/images/sectionProductItemPage/Minus (1).png" alt="" className="sectionProductItemPage__inputBlock-minusImg" />
                                        </button>
                                        <input type="number" className="sectionProductItemPage__inputBlock-input" />
                                        <button className="sectionProductItemPage__inputBlock-plustBtn">
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
                    </div>
                </div>
            </section>
        </main>
    )

}

export default ProductItemPage;