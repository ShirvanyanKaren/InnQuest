import { useState, useEffect } from 'react';
import { getImage } from '../utils/s3';

const ImagesSlider = ({ images, style }) => {
    const [index, setIndex] = useState(0);
    const [resolvedImages, setResolvedImages] = useState([]);

    useEffect(() => {
        const resolveImageUrls = async () => {
            const urls = await Promise.all(
                images.map(async (img) => {
                    if (img.includes("aws")) {
                        return await getImage(img);
                    }
                    return img;
                })
            );
            setResolvedImages(urls);
        };

        resolveImageUrls();
    }, [images]);

    const handleSelect = (selectedIndex) => {
        if (selectedIndex < 0) {
            selectedIndex = resolvedImages.length - 1;
        }
        if (selectedIndex >= resolvedImages.length) {
            selectedIndex = 0;
        }
        setIndex(selectedIndex);
    };

    return (
        <div id="" className="carousel slide" data-bs-ride="carousel">
            <div className="carousel-inner">
                {resolvedImages.length > 0 && (
                    <div className={`carousel-item active`}>
                        <img
                            style={{
                                height: `${style?.height || "300px"}`,
                                objectFit: "cover",
                            }}
                            src={resolvedImages[index]}
                            className="d-block w-100"
                            alt="hotel"
                        />
                    </div>
                )}
            </div>
            <button
                onClick={() => handleSelect(index - 1)}
                className="carousel-control-prev"
                type="button"
                data-bs-target="#carouselExampleControls"
                data-bs-slide="prev"
            >
                <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                <span className="visually-hidden">Previous</span>
            </button>
            <button
                onClick={() => handleSelect(index + 1)}
                className="carousel-control-next"
                type="button"
                data-bs-target="#carouselExampleControls"
                data-bs-slide="next"
            >
                <span className="carousel-control-next-icon text-dark" aria-hidden="true"></span>
                <span className="visually-hidden">Next</span>
            </button>
        </div>
    );
};

export default ImagesSlider;
