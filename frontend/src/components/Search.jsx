import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import dayjs from "dayjs";

const Search = () => {
  const [params, setSearchParams] = useSearchParams();
  const [error, setError] = useState("");

  const [search, setSearch] = useState({
    query: params.get("query") || "",
    check_in: params.get("check_in") || "",
    check_out: params.get("check_out") || "",
    rooms: params.get("rooms") || 1,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!search.query || !search.check_in || !search.check_out) {
      setError("Please fill out all fields");
      return;
    }
    window.location.replace(`/search?query=${search.query}&check_in=${search.check_in}&check_out=${search.check_out}&rooms=${search.rooms}`);
  };

  return (
    <div className="search-bar mt-3">
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
                    placeholder="Enter a city"
                    value={search.query}
                    id="query"
                    onChange={(e) =>
                      setSearch({ ...search, query: e.target.value })
                    }
                  />
                </div>
                <div className="col-sm">
                  <label htmlFor="Number of Rooms">Dates</label>
                  <div className="d-flex">
                  <input
                    type="date"
                    className="form-control me-1"
                    min={new Date().toISOString().split("T")[0]}
                    value={search.check_in}
                    id="check_in"
                    onChange={(e) =>
                      setSearch({ ...search, check_in: e.target.value })
                    }
                  />
                    <input
                    type="date"
                    min={dayjs(search.check_in || new Date())
                        .add(1, "day")
                        .format("YYYY-MM-DD")}
                    className="form-control"
                    value={search.check_out}
                    id="check_out"
                    onChange={(e) =>
                      setSearch({ ...search, check_out: e.target.value })
                    }
                  />
                  </div>
                </div>
                <div className="col-2 room-number-search">
                  <label htmlFor="Number of Rooms"> Rooms</label>
                  <input
                    type="number"
                    className="form-control"
                    placeholder="Rooms"
                    min={1}
                    value={search.rooms}
                    max={10}
                    onChange={(e) =>
                      setSearch({ ...search, rooms: e.target.value })
                    }
                  />
                </div>
                <div className="col-2 mt-3 search-btn-box">
                <button type="submit" className="btn btn-primary search-btn">
                  Search
                </button>
                </div>

                </div>

              </div>
              {error && <div className="alert alert-danger mt-3">{error}</div>}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Search;
