import {useState, useEffect} from 'react';
import { getHotelsByCity } from '../../services/hotels';
import Loading from '../components/Loading';
import Search from '../components/Search';

const Home = () => {
    const [loading, setLoading] = useState(false);


    useEffect(() => {
        setLoading(true);
        getHotelsByCity({query: "San Francisco"})
            .then((response) => {
                console.log(response);
                setLoading(false);
            })
            .catch((error) => {
                console.log(error);
                setLoading(false);
            });
    }
    , []);

    return loading ? (
        <Loading />
    ) : (
        <div className="container mt-3">
            <Search />

        </div>
    );
}

export default Home;