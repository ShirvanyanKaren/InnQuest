import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import dayjs from "dayjs";

const Search = () => {



  return (
    <div className="search-bar mt-3">
      <div className="container">
        <div className="card search-card">
          <div className="card-header search-header text-center">
            <h3>Search for Hotels</h3>
          </div>
          <form>
              <div className="containe text-center">
                <div className="row search-contents">
                <div className="col-sm">
                  <label htmlFor="Number of Rooms">Location</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter a city"
                    id="query"
                  />
                </div>
                <div className="col-sm">
                  <label htmlFor="Number of Rooms">Dates</label>
                  <div className="d-flex">
                  <input
                    type="date"
                    className="form-control me-1"
                    min={new Date().toISOString().split("T")[0]}
                    id="check_in"
                  />
                    <input
                    type="date"
                    min={dayjs(new Date())
                        .add(1, "day")
                        .format("YYYY-MM-DD")}
                    className="form-control"
                    id="check_out"
                  />

                  </div>
                </div>
                <div className="col-2">
                  <label htmlFor="Number of Rooms"> Rooms</label>
                  <input
                    type="number"
                    className="form-control"
                    placeholder="Rooms"
                    min={1}
                    max={10}
                  />
                </div>
                <div className="col-2 mt-3">
                <button type="submit" className="btn btn-primary search-btn">
                  Search
                </button>
                </div>
                </div>
              </div>
            </form>
            </div>
            </div>
          </div>
    );
};

export default Search;
