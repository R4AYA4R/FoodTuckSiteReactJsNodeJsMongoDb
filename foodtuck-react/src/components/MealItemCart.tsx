import { ChangeEvent, useEffect, useState } from "react";
import { IMealCart } from "../types/types";

interface IMealItemCart {

    mealCart: IMealCart;

}

const MealItemCart = ({ mealCart }: IMealItemCart) => {

    const [inputAmountValue, setInputAmountValue] = useState(mealCart.amount);

    const [subtotalMealPrice,setSubtotalMealPrice] = useState(mealCart.totalPrice);


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

    // при изменении inputAmountValue изменяем состояние subtotalMealPrice
    useEffect(()=>{

        setSubtotalMealPrice(inputAmountValue * mealCart.price); // умножаем inputAmountValue(выбранное количество блюд) на mealCart.price(цену блюда)

    },[inputAmountValue])

    return (
        <div className="sectionCart__table-mealItem">
            <div className="table__mealItem-leftBlock">
                <img src={`/images/sectionMenu/${mealCart.image}`} alt="" className="mealItem__leftBlock-img" />
                <div className="mealItem__leftBlock-info">
                    <p className="mealItem__info-name">{mealCart.name}</p>
                    <div className="products__item-stars">
                        <img src={mealCart.rating === 0 ? "/images/sectionCatalog/StarGrey.png" : "/images/sectionCatalog/StarYellow.png"} alt="" className="products__stars-imgYellow products__starsMealsItem-img" />
                        <img src={mealCart.rating >= 2 ? "/images/sectionCatalog/StarYellow.png" : "/images/sectionCatalog/StarGrey.png"} alt="" className="products__stars-imgYellow products__starsMealsItem-img" />
                        <img src={mealCart.rating >= 3 ? "/images/sectionCatalog/StarYellow.png" : "/images/sectionCatalog/StarGrey.png"} alt="" className="products__stars-imgYellow products__starsMealsItem-img" />
                        <img src={mealCart.rating >= 4 ? "/images/sectionCatalog/StarYellow.png" : "/images/sectionCatalog/StarGrey.png"} alt="" className="products__stars-imgYellow products__starsMealsItem-img" />
                        <img src={mealCart.rating >= 5 ? "/images/sectionCatalog/StarYellow.png" : "/images/sectionCatalog/StarGrey.png"} alt="" className="products__stars-imgGrey products__starsMealsItem-img" />
                    </div>
                </div>
            </div>
            <p className="table__mealItem-price">${mealCart.price}</p>
            <div className="sectionProductItemPage__bottomBlock-inputBlock">
                <button className="sectionProductItemPage__inputBlock-minusBtn talbe__mealItem-inputBtn" onClick={handlerMinusAmountBtn}>
                    <img src="/images/sectionProductItemPage/Minus (1).png" alt="" className="sectionProductItemPage__inputBlock-minusImg" />
                </button>
                <input type="number" className="sectionProductItemPage__inputBlock-input table__mealItem-input" value={inputAmountValue} onChange={changeInputAmountValue} />
                <button className="sectionProductItemPage__inputBlock-plustBtn talbe__mealItem-inputPlusBtn" onClick={handlerPlusAmountBtn}>
                    <img src="/images/sectionProductItemPage/Plus.png" alt="" className="sectionProductItemPage__inputBlock-plusImg mealItem__plusBtn-plusImg" />
                </button>
            </div>
            <p className="table__mealItem-totalPrice">${subtotalMealPrice}</p>
            <button className="table__mealItem-removeBtn">
                <img src="/images/cart/X.png" alt="" className="mealItem__removeBtn-img" />
            </button>
        </div>

    )
}

export default MealItemCart;