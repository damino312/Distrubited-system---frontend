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

    let populationSum = currentData.population.reduce(
      (accumulator, current) => accumulator + Number(current.populationText),
      0
    );

    const countryPopulations = country.populations.map(
      (obj) => obj.id.idNationality
    );

    // чтобы потом понять какой запрос делать delete или save
    const addedElements = currentData.nationalities
      .map((element) => element.id_nationality)
      .filter((element) => !countryPopulations.includes(element));
    // чтобы потом понять какой запрос делать delete или save
    const removedElements = countryPopulations.filter(
      (element) =>
        !currentData.nationalities
          .map((obj) => obj.id_nationality)
          .includes(element)
    );

    //совместить  currentData.nationalities и countryPopulations и пустить for по их длине
    let fullArray = [
      ...new Set(
        currentData.nationalities
          .map((obj) => obj.id_nationality)
          .concat(countryPopulations)
      ),
    ];

    await axios.put(`http://localhost:8080/country/${id}`, {
      ...country,
      population_country: populationSum,
    }); // изменяем страну

    for (let i = 0; i < fullArray.length; i++) {
      //пропускаем удаленные объекты (по идеи можно просто fullArray.length поставить другую и пойдет, а может не пойдет, можно чекнуть )
      if (currentData.nationalities[i] === undefined) {
        console.log("removed value");
        continue;
      }

      // делаем совпадение по id, чтобы совместить национальность и строку с количеством людей данной национальности в стране
      let populationObj = currentData.population.find(
        (obj) =>
          obj.id_population === currentData.nationalities[i].id_nationality
      );

      //создаем объект для post или put
      let countryNationality = {
        country_link: country,
        nationality_link: currentData.nationalities[i],
        population: Number(
          populationObj ? populationObj.populationText : "100" // если поле напротив чекбокса пустое, то стандартное значение - 100
        ),
      };
      // удаляю эти поля, чтобы избежать ошибки (мб еще появляется, мб нет, лень проверять)
      delete countryNationality.country_link.populations;
      delete countryNationality.nationality_link.populations;

      if (
        countryPopulations.includes(
          countryNationality.nationality_link.id_nationality
        )
      ) {
        await axios.put(
          `http://localhost:8080/country-nationality/${country.id_country}/${currentData.nationalities[i].id_nationality}`,
          countryNationality
        );
        console.log("changed value");
      } else if (
        addedElements.includes(
          countryNationality.nationality_link.id_nationality
        )
      ) {
        await axios.post(
          "http://localhost:8080/country-nationality",
          countryNationality
        );
        console.log("added value");
      }
      navigate("/country");
    }

    // removedElements содержит элементы из countryPopulations, которые были удалены (чекбокс убран)
    for (let i = 0; i < removedElements.length; i++) {
      await axios.delete(
        `http://localhost:8080/country-nationality/${country.id_country}/${removedElements[i]}`
      );
    }
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-6 offset-md-3 border rounded p-4 mt-2 shadow">
          <h2 className="text-center m-4">Изменение страны</h2>
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
