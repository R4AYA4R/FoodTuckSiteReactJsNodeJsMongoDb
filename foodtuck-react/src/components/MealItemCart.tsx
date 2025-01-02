import { ChangeEvent, useEffect, useState } from "react";
import { IMealCart } from "../types/types";
import { useTypedSelector } from "../hooks/useTypedSelector";
import { useActions } from "../hooks/useActions";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { API_URL } from "../http/http";

interface IMealItemCart {

    mealCart: IMealCart;

    refetchMealsCart: () => {} // указываем полю refetchMealsCart что это стрелочная функция 

}

// берем пропс(параметр) refetchMealsCart из пропсов этого компонента,эту функцию refetchMealsCart передаем как пропс(параметр) в этот компонент в файле Cart.tsx,эта функция для переобновления(повторный запрос на получение массива товаров(блюд)) массива товаров(блюд) корзины
const MealItemCart = ({ mealCart, refetchMealsCart }: IMealItemCart) => {

    const [inputAmountValue, setInputAmountValue] = useState(mealCart.amount);

    const [subtotalMealPrice, setSubtotalMealPrice] = useState(mealCart.totalPrice);


    const { updateCartMeals } = useTypedSelector(state => state.cartSlice); // указываем наш слайс(редьюсер) под названием cartSlice и деструктуризируем у него поле состояния updateCartMeals,используя наш типизированный хук для useSelector

    const { setUpdateCartMeals } = useActions(); // берем actions для изменения состояния слайса(редьюсера) cartSlice у нашего хука useActions уже обернутые в диспатч,так как мы оборачивали это в самом хуке useActions


    const { mutate:mutateUpdateCartMeal } = useMutation({
        mutationKey: ['updateCartMeal'],
        mutationFn: async (mealCart: IMealCart) => {

            // делаем запрос на сервер для изменения данных товара(блюда) корзины,в данном случае указываем put запрос для изменения данных на сервере,и указываем тип данных,которые нужно изменить на сервере(то есть просто какие данные нужно передать на сервер в теле запроса),в данном случае это тип данных IMealCart),но здесь не обязательно указывать тип,передаем просто объект mealCart как тело запроса
            await axios.put<IMealCart>(`${API_URL}/updateCartMeal`, mealCart);

        },

        // при успешной мутации обновляем весь массив товаров(блюд) корзины с помощью функции refetchMealsCart,которую мы передали как пропс (параметр) этого компонента
        onSuccess() {
            refetchMealsCart();
        }

    })

    const { mutate:mutateDeleteCartMeal } = useMutation({
        mutationKey: ['deleteCartMeal'],
        mutationFn: async (mealCart: IMealCart) => {

            // делаем запрос на сервер для удаление товара(блюда) корзины,и указываем тип данных,которые вернет сервер(то есть в данном случае будем от сервера возвращать удаленный объект товара(блюда) в базе данных,то есть в данном случае тип IMealCart),но здесь не обязательно указывать тип
            await axios.delete<IMealCart>(`${API_URL}/deleteCartMeal/${mealCart._id}`);

        },

        // при успешной мутации обновляем весь массив товаров(блюд) корзины с помощью функции refetchMealsCart,которую мы передали как пропс (параметр) этого компонента
        onSuccess() {
            refetchMealsCart();
        }

    })


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
    useEffect(() => {

        setSubtotalMealPrice(inputAmountValue * mealCart.price); // умножаем inputAmountValue(выбранное количество блюд) на mealCart.price(цену блюда)

    }, [inputAmountValue])


    // при изменении поля updateCartMeals у состояния слайса(редьюсера) cartSlice делаем запрос на сервер на обновление данных о товаре(блюде) в корзине
    useEffect(()=>{

        console.log(updateCartMeals);

        // если updateCartMeals true и mealCart.amount не равно inputAmountValue(то есть количество товара(блюда) в корзине(которое мы получили из запроса на сервер на получения всех товаров корзины в компоненте Cart.tsx) не равно значению состояния inputAmountValue,то есть пользователь изменил количество товара(блюда) в корзине),то обновляем данные товара(блюда),делаем эту проверку,чтобы не циклился запрос на переобновление массива товаров(блюд) корзины ,который мы делаем при обновлении данных товара(блюда),если эту проверку не сделать,то будут циклиться запросы на сервер и не будет нормально работать сайт, и чтобы если пользователь нажал на кнопку обновить товары в корзине,но не изменил inputAmountValue(количество товара) на новое значение,то не делать запрос на обновление товара корзины,чтобы не шли запросы на сервер просто так
        if(updateCartMeals && mealCart.amount !== inputAmountValue){

            mutateUpdateCartMeal({...mealCart,amount:inputAmountValue,totalPrice:subtotalMealPrice}); // делаем запрос на обновление данных товара корзины,разворачиваем весь объект mealCart,то есть вместо mealCart будут подставлены все поля из объекта mealCart,в поля amount и totalPrice указываем значения состояний количества (inputAmountValue) и цены товара(блюда)(subtotalMealPrice) на этой странице

        }

        setUpdateCartMeals(false); // изменяем поле updateCartMeals у состояния слайса(редьюсера) cartSlice на false,чтобы указать,что данные товара обновились и потом можно было опять нажимать на кнопку обновления всех товаров корзины

    },[updateCartMeals])


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

            {/* в onClick этой кнопке указываем нашу функцию для удаления товара(блюда) из корзины(то есть в данном случае удаляем ее из базы данных у сущности(модели) корзины) */}
            <button className="table__mealItem-removeBtn" onClick={()=>mutateDeleteCartMeal(mealCart)}>
                <img src="/images/cart/X.png" alt="" className="mealItem__removeBtn-img" />
            </button>
        </div>

    )
}

export default MealItemCart;