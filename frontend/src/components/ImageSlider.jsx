import { useState } from 'react';

const ImagesSlider = ({images, style}) => {
    const [index, setIndex] = useState(0);
    const handleSelect = (selectedIndex) => {
        console.log(selectedIndex);
        if(selectedIndex < 0) {
            selectedIndex = images.length - 1;
        }
        if(selectedIndex >= images.length) {
            selectedIndex = 0;
        }
        setIndex(selectedIndex);
    }
    return (
        <div id="" className="carousel slide" data-bs-ride="carousel">
            <div className="carousel-inner">
                    <div className={`carousel-item active`} >
                        <img 
                        style={{ height: `${style?.height || "300px"}`,
                        objectFit: "cover" }}
                        src={images[index]} className="d-block w-100" alt="hotel" />
                    </div>
            </div>
            <button 
            onClick={() => handleSelect(index - 1)}
            className="carousel-control-prev" type="button" data-bs-target="#carouselExampleControls" data-bs-slide="prev">
                <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                <span 
                className="visually-hidden">Previous</span>
            </button>
            <button 
            onClick={() => handleSelect(index + 1)}
            className="carousel-control-next" type="button" data-bs-target="#carouselExampleControls" data-bs-slide="next">
                <span className="carousel-control-next-icon text-dark" aria-hidden="true"></span>
                <span className="visually-hidden">Next</span>
            </button>
        </div>
    );
}

export default ImagesSlider;