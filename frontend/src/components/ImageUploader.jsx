
import { handleAddImageHelper } from '../utils/helpers';

const ImageUploader = ({ images, setImages, setError, label }) => {
  const handleAddImage = (e) => {
    handleAddImageHelper(e, setImages, setError);
  };

  const handleRemoveImage = (index) => {
    const updatedImages = images.filter((_, i) => i !== index);
    setImages(updatedImages);
  };

  return (
    <div className="form-group">
      <label htmlFor="images">{label}</label>
      {images.length > 0 && images.map((image, index) => (
        <div key={index} className="card w-50 mb-1">
          <img src={image.url} alt="preview" style={{ width: "100px", objectFit: "cover" }} />
          <button
            type="button"
            className="btn btn-danger"
            onClick={() => handleRemoveImage(index)}
          >
            Remove
          </button>
        </div>
      ))}
      <input
        type="file"
        name="images"
        id="images"
        className="form-control"
        onChange={handleAddImage}
        multiple
      />
    </div>
  );
};

export default ImageUploader;
