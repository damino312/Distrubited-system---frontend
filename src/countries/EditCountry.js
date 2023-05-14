import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";
import ListNationalities from "../components/ListNationalities";

export default function EditCountry() {
  let navigate = useNavigate();
  const { id } = useParams();
  const [nationalities, setNationalities] = useState([]); // для передачи всех национальностей на доч. форму
  const [currentData, setCurrentData] = useState({
    nationalities: [],
    population: [],
  });
  const [country, setCountry] = useState({
    name_country: "",
    capital_country: "",
    area_country: "",
    population_country: "",
  });
  const { name_country, capital_country, area_country, population_country } =
    country;

  function passData(msg) {
    // для передачи выбранных чекбоксом национальностей из дочернего элемента
    setCurrentData(msg);
    // console.log(msg);
  }

  const loadCountry = useCallback(async () => {
    const result = await axios.get(`http://localhost:8080/country/${id}`);
    setCountry(result.data);
  }, [id]);

  useEffect(() => {
    loadCountry();
  }, [loadCountry]);
  const loadNationalities = async () => {
    const result = await axios.get("http://localhost:8080/nationalities");
    setNationalities(result.data);
  };

  useEffect(() => {
    loadNationalities();
  }, []);

  const onInputChange = (e) => {
    setCountry({ ...country, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    // await axios.put("http://localhost:8080/country", country); // изменяем страну
    console.log(country);

    for (let i = 0; i < currentData.nationalities.length; i++) {
      // изменяем каждую countryNationality, которую выбрали чекбоксом на дочерней форме
      let populationObj = currentData.population.find(
        // делаем совпадение по id, чтобы совместить национальность и строку с количеством народа
        (obj) =>
          obj.id_population === currentData.nationalities[i].id_nationality
      );

      let countryNationality = {
        country_link: { ...country, id_country: country.id_country },
        nationality_link: currentData.nationalities[i],
        population: Number(populationObj.populationText),
      };
      console.log(countryNationality);
      // await axios.post(
      //   "http://localhost:8080/country-nationality",
      //   countryNationality
      // );
    }
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
            <div className="mb-3">
              <label htmlFor="population_country" className="form-label">
                Население
              </label>
              {nationalities.length && ( // чтобы ListCountries рендерилась один раз
                <ListNationalities
                  nationalities={nationalities}
                  passData={passData}
                  populations={country.populations.map((obj) => ({
                    id: obj.id.idNationality,
                    population: obj.population,
                  }))}
                />
              )}
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
