import { useEffect, useState } from "react";
import { getHotelsByCity, deleteHotel } from "../services/hotel";
import { useParams } from "react-router-dom";
import { Modal } from "react-bootstrap";
import CreateHotel from "../components/CreateHotel";
import ImagesSlider from "../components/ImageSlider";

const HotelsAdmin = () => {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [showRoomsModal, setShowRoomsModal] = useState(false);   
  const [search, setSearch] = useState({
    query: "",
  });
  const [deleteModal, setDeleteModal] = useState(false);

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const response = await getHotelsByCity(search);
        console.log(response);
        setHotels(response.data);
        setLoading(false);
      } catch (error) {
        setError("Unable to fetch hotels");
      }
    };
    fetchHotels();
  }, [search]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!search.query) {
      setError("Please enter a location");
      return;
    }
    window.location.replace(`/admin/hotels?query=${search.query}`);
  };

  const handleSelectHotel = (hotel) => {
    setSelectedHotel(hotel);
    setShowRoomsModal(true);
  }

  const handleOpenDeleteModal = (hotel) => {
    console.log(hotel);
    setDeleteModal(true);
    setSelectedHotel(hotel);
  }

  const handleDeleteHotel = async () => {
    try {
      await deleteHotel(selectedHotel.id);
      setHotels(hotels.filter((hotel) => hotel.id !== selectedHotel.id));
      setDeleteModal(false);
    } catch (error) {
      console.log(error);
    }
  }





  return (
    <div className="container">
      <div className=" search-bar mt-3">
        <div className="container">
          <div className="card search-card">
            <div className="card-header search-header text-center">
              <h3>Search for Hotels</h3>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="containe text-center">
                  <div className="row search-contents">
                    <div className="col-sm">
                      <label htmlFor="Number of Rooms">Location</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Enter location or name"
                        value={search.query}
                        id="query"
                        onChange={(e) =>
                          setSearch({ ...search, query: e.target.value })
                        }
                      />
                    </div>
                  </div>
                  <div className="row mt-3">
                    <div className="col-sm">
                      <button type="submit" className="btn btn-primary">
                        Search
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <div className="row mt-5">
        {hotels.map((hotel) => (
          <div className="col-4 mb-3" key={hotel.id}>
            <div className="card h-100">
              <ImagesSlider images={hotel.image_urls} />
              <div className="card-body d-flex flex-column">
                <h5 className="card-title">{hotel.name}</h5>
                <div className="flex-grow-1">
                  <p className="card-text">{hotel.description}</p>
                </div>
                <div className="mt-2 p-3">
                  <button 
                  onClick={() => handleOpenDeleteModal(hotel)}
                  type="button" className="btn btn-danger me-2">
                    Delete
                  </button>
                  <button
                    onClick={() => handleSelectHotel(hotel)}
                  type="button" className="btn btn-primary">
                    Edit
                    </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <CreateHotel
        edit={true}
        show={showRoomsModal}
        handleClose={() => setShowRoomsModal(false)}
        currHotel={selectedHotel}
        />
    <Modal show={deleteModal} onHide={() => setDeleteModal(false)}>
        <Modal.Header closeButton>
            <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <p>Are you sure you want to delete this hotel?</p>
        </Modal.Body>
        <Modal.Footer>
            <button
            className="btn btn-danger"
            onClick={() => setDeleteModal(false)}
            >
            Cancel
            </button>
            <button
            className="btn btn-primary"
            onClick={handleDeleteHotel}
            >
            Confirm
            </button>
        </Modal.Footer>
    </Modal>
    </div>


  );
};

export default HotelsAdmin;
