import axios from "axios";
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import ListNationalities from "../components/ListNationalities";
import { data } from "jquery";

export default function AddCountry() {
  let navigate = useNavigate();

  const [nationalities, setNationalities] = useState([]); // для передачи всех национальностей на доч. форму

  const [currentData, setCurrentData] = useState({
    nationalities: [],
    population: [],
  });

  function passData(msg) {
    // для передачи выбранных чекбоксом национальностей из дочернего элемента
    setCurrentData(msg);
  }

  const loadNationalities = async () => {
    const result = await axios.get("http://localhost:8080/nationalities");
    setNationalities(result.data);
  };

  useEffect(() => {
    loadNationalities();
  }, []);

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
    // если не добавиться страна, а алгоритм дальше пойдет, то привяжется к другому или ошибка вылетит - потом поставить условие
    e.preventDefault();

    let populationSum = currentData.population.reduce(
      (accumulator, current) => accumulator + Number(current.populationText),
      0
    );

    await axios.post("http://localhost:8080/country", {
      ...country,
      population_country: populationSum,
    }); // добавляем страну

    let addedCountry = await axios.get(
      // получаем последнюю добавленную страну (строка выше)
      "http://localhost:8080/counties/last-record"
    );

    for (let i = 0; i < currentData.nationalities.length; i++) {
      // постим каждую countryNationality, которую выбрали чекбоксом на дочерней форме
      let populationObj = currentData.population.find(
        // делаем совпадение по id, чтобы совместить национальность и строку с количеством народа
        (obj) =>
          obj.id_population === currentData.nationalities[i].id_nationality
      );

      let countryNationality = {
        country_link: { ...country, id_country: addedCountry.data.id_country },
        nationality_link: currentData.nationalities[i],
        population: Number(
          populationObj ? populationObj.populationText : "100" // если поле напротив чекбокса пустое, то стандартное значение - 100
        ),
      };
      delete countryNationality.country_link.populations;
      delete countryNationality.nationality_link.populations;
      console.log(countryNationality);
      await axios.post(
        "http://localhost:8080/country-nationality",
        countryNationality
      );
    }

    navigate("/country");
  };
  function validateLetterInput(event) {
    const input = event.target;
    const inputValue = input.value;
    const onlyLetters = /^[A-Za-zА-Яа-я]+$/;

    if (!onlyLetters.test(inputValue)) {
      // Remove non-letter characters from the input value
      input.value = inputValue.replace(/[^A-Za-zА-Яа-я]/g, "");
    }
  }

  function validateDigitInput(event) {
    const input = event.target;
    const inputValue = input.value;
    const onlyDigits = /^\d+$/;

    if (!onlyDigits.test(inputValue)) {
      // Remove non-digit characters from the input value
      input.value = inputValue.replace(/\D/g, "");
    }
  }

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-6 offset-md-3 border rounded p-4 mt-2 shadow">
          <h2 className="text-center m-4">Добавление страны</h2>
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
                onChange={(e) => {
                  onInputChange(e);
                }}
                onInput={(e) => validateLetterInput(e)}
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
                onInput={(e) => validateLetterInput(e)}
              ></input>
            </div>

            <div className="mb-3">
              <label htmlFor="area_country" className="form-label">
                Площадь, км²
              </label>
              <input
                type={"text"}
                className="form-control"
                placeholder="Введите площадь"
                name="area_country"
                value={area_country}
                onChange={(e) => onInputChange(e)}
                onInput={(e) => validateDigitInput(e)}
              ></input>
            </div>

            <div className="mb-3">
              <label htmlFor="population_country" className="form-label">
                Население, тысяч. чел
              </label>
              {nationalities.length && ( // чтобы ListCountries рендерилась один раз
                <ListNationalities
                  nationalities={nationalities}
                  passData={passData}
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
