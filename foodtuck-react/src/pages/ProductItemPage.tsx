import { useParams } from "react-router-dom";
import SectionProductItemTop from "../components/SectionProductItemTop";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { IMeal } from "../types/types";

const ProductItemPage = ()=>{

    const params = useParams(); // с помощью useParams получаем параметры из url (в данном случае id товара)

    const {data,refetch} = useQuery({
        queryKey:['getMealById'],
        queryFn:async () => {

            // делаем запрос на сервер по конкретному id(в данном случае указываем params.id, то есть id,который взяли из url),который достали из url,указываем тип данных,которые вернет сервер(в данном случае наш IMeal для товара(блюда))
            const response = await axios.get<IMeal>(`http://localhost:5000/api/getMealsCatalog/${params.id}`);

            return response;
        }
    })

    return(
        <main className="main">
            <SectionProductItemTop meal={data?.data}/>
            
        </main>
    )

}

export default ProductItemPage;