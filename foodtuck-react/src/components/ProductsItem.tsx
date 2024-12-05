import { useNavigate } from "react-router-dom";
import { IMeal } from "../types/types";

interface IProductsItemProps{
    meal:IMeal
}

const ProductsItem = ({meal}:IProductsItemProps) => {

    const router = useNavigate(); // useNavigate может перемещатьтся на другую страницу вместо ссылок

    return (
        // этому диву в onClick указываем router() и указываем url,по которому нужно будет перекинуть пользователя,в данном случае указываем url для страницы блюда,через / после /catalog указываем id у блюда,чтобы перекинуть на страницу с его id(мы этот динамический параметр id указывали при создании Routes(маршрутов) в файле App.tsx,поэтому указываем тут id блюда,чтобы сработал маршрут показа страницы для отдельного блюда)
        <div className="products__item" onClick={()=>router(`/catalog/${meal._id}`)}>
            <img src={`/images/sectionMenu/${meal.image}`} alt="" className="products__item-img" />
            <div className="products__item-stars">
                <img src="/images/sectionCatalog/StarYellow.png" alt="" className="products__stars-imgYellow" />
                <img src="/images/sectionCatalog/StarYellow.png" alt="" className="products__stars-imgYellow" />
                <img src="/images/sectionCatalog/StarYellow.png" alt="" className="products__stars-imgYellow" />
                <img src="/images/sectionCatalog/StarYellow.png" alt="" className="products__stars-imgYellow" />
                <img src="/images/sectionCatalog/StarGrey.png" alt="" className="products__stars-imgGrey" />
            </div>
            <p className="products__item-text">{meal.name}</p>
            <p className="products__item-price">${meal.price}.00</p>
        </div>
    )
}

export default ProductsItem;