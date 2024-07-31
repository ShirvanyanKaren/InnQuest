import {useState, useEffect} from 'react';
import Loading from '../components/Loading';
import Search from '../components/Search';

const Home = () => {
    const [loading, setLoading] = useState(false);

    return loading ? (
        <Loading />
    ) : (
        <div className="container mt-3">
            <Search />

        </div>
    );
}

export default Home;