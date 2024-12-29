import { ChangeEvent, useEffect, useState } from "react";

const MealItemCart = () => {

    const [inputAmountValue, setInputAmountValue] = useState(1);


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

    return (
        <div className="sectionCart__table-mealItem">
            <div className="table__mealItem-leftBlock">
                <img src="/images/sectionMenu/Burger.png" alt="" className="mealItem__leftBlock-img" />
                <div className="mealItem__leftBlock-info">
                    <p className="mealItem__info-name">Burger</p>
                    <div className="products__item-stars">
                        <img src="/images/sectionCatalog/StarYellow.png" alt="" className="products__stars-imgYellow" />
                        <img src="/images/sectionCatalog/StarYellow.png" alt="" className="products__stars-imgYellow" />
                        <img src="/images/sectionCatalog/StarYellow.png" alt="" className="products__stars-imgYellow" />
                        <img src="/images/sectionCatalog/StarYellow.png" alt="" className="products__stars-imgYellow" />
                        <img src="/images/sectionCatalog/StarGrey.png" alt="" className="products__stars-imgGrey" />
                    </div>
                </div>
            </div>
            <p className="table__mealItem-price">$35.00</p>
            <div className="sectionProductItemPage__bottomBlock-inputBlock">
                <button className="sectionProductItemPage__inputBlock-minusBtn talbe__mealItem-inputBtn" onClick={handlerMinusAmountBtn}>
                    <img src="/images/sectionProductItemPage/Minus (1).png" alt="" className="sectionProductItemPage__inputBlock-minusImg" />
                </button>
                <input type="number" className="sectionProductItemPage__inputBlock-input table__mealItem-input" value={inputAmountValue} onChange={changeInputAmountValue} />
                <button className="sectionProductItemPage__inputBlock-plustBtn talbe__mealItem-inputPlusBtn" onClick={handlerPlusAmountBtn}>
                    <img src="/images/sectionProductItemPage/Plus.png" alt="" className="sectionProductItemPage__inputBlock-plusImg mealItem__plusBtn-plusImg" />
                </button>
            </div>
            <p className="table__mealItem-totalPrice">$221.00</p>
            <button className="table__mealItem-removeBtn">
                <img src="/images/cart/X.png" alt="" className="mealItem__removeBtn-img" />
            </button>
        </div>

    )
}

export default MealItemCart;