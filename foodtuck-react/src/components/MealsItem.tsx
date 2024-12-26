import { useNavigate } from "react-router-dom";
import { IMeal } from "../types/types";

// создаем интерфейс(тип) для пропсов компонента MealsItem,указываем в нем поле meal с типом нашего интерфейса IMeal
interface IMealProp {
    meal: IMeal
}

const MealsItem = ({ meal }: IMealProp) => {

    const router = useNavigate();  // используем useNavigate чтобы перекидывать пользователя на определенную страницу

    return (
        <div className="meals__item" onClick={() => router(`/catalog/${meal._id}`)}>
            <div className="meals__item-leftBlock">
                <img src={`/images/sectionMenu/${meal.image}`} alt="" className="meals__item-img" />
                <div className="meals__item-info">
                    <h4 className="meals__info-title">{meal.name}</h4>

                    <div className="products__item-stars products__item-starsMeals">
                        <img src={meal.rating === 0 ? "/images/sectionCatalog/StarGrey.png" : "/images/sectionCatalog/StarYellow.png"} alt="" className="products__stars-imgYellow products__starsMealsItem-img" />
                        <img src={meal.rating >= 2 ? "/images/sectionCatalog/StarYellow.png" : "/images/sectionCatalog/StarGrey.png"} alt="" className="products__stars-imgYellow products__starsMealsItem-img" />
                        <img src={meal.rating >= 3 ? "/images/sectionCatalog/StarYellow.png" : "/images/sectionCatalog/StarGrey.png"} alt="" className="products__stars-imgYellow products__starsMealsItem-img" />
                        <img src={meal.rating >= 4 ? "/images/sectionCatalog/StarYellow.png" : "/images/sectionCatalog/StarGrey.png"} alt="" className="products__stars-imgYellow products__starsMealsItem-img" />
                        <img src={meal.rating >= 5 ? "/images/sectionCatalog/StarYellow.png" : "/images/sectionCatalog/StarGrey.png"} alt="" className="products__stars-imgGrey products__starsMealsItem-img" />
                    </div>

                    <p className="meals__info-subtitle">Toasted French bread topped with romano, cheddar</p>
                </div>
            </div>
            <p className="meals__info-price">{meal.price}$</p>
        </div>
    )
}

export default MealsItem;