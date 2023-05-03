import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function AddCountry() {
  let navigate = useNavigate();

  const [country, setCountry] = useState({
    name_country: "",
    capital_country: "",
    area_country: "",
    population_country: "",
  });

  const { name_country, capital_country, area_country, population_country } =
    country;

  const onInputChange = (e) => {
    setCountry({ ...country, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    await axios.post("http://localhost:8080/country", country);
    navigate("/country");
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-6 offset-md-3 border rounded p-4 mt-2 shadow">
          <h2 className="text-center m-4">Adding Country</h2>
          <form onSubmit={(e) => onSubmit(e)}>
            <div className="mb-3">
              <label htmlFor="name_country" className="form-label">
                Название страны
              </label>
              <input
                type={"text"}
                className="form-control"
                placeholder="Введите название страны"
                name="name_country"
                value={name_country}
                onChange={(e) => onInputChange(e)}
              ></input>
            </div>

            <div className="mb-3">
              <label htmlFor="capital_country" className="form-label">
                Столица
              </label>
              <input
                type={"text"}
                className="form-control"
                placeholder="Введите столицу"
                name="capital_country"
                value={capital_country}
                onChange={(e) => onInputChange(e)}
              ></input>
            </div>

            <div className="mb-3">
              <label htmlFor="area_country" className="form-label">
                Площадь
              </label>
              <input
                type={"text"}
                className="form-control"
                placeholder="Введите площадь"
                name="area_country"
                value={area_country}
                onChange={(e) => onInputChange(e)}
              ></input>
            </div>

            <div className="mb-3">
              <label htmlFor="population_country" className="form-label">
                Население
              </label>
              <input
                type={"text"}
                className="form-control"
                placeholder="Введите население"
                name="population_country"
                value={population_country}
                onChange={(e) => onInputChange(e)}
              ></input>
            </div>
            <button type="submit" className="btn btn-outline-primary">
              Подтвердить
            </button>
            <Link className="btn btn-outline-danger mx-2" to="/country">
              Отменить
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
}
