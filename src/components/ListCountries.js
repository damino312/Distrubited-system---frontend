import React, { useEffect, useState } from "react";

export default function ListCountries(props) {
  const [countries, setCountries] = useState([]);
  // const [sorted, setSorted] = useState(props.countries);

  useEffect(() => {
    enableCheck();
  }, []);

  function enableCheck() {
    let obj = [];
    // включает чекбоксы при редактировании записи
    if (!props.checks) return null;
    const idList = props.checks;
    const checkboxes = Array.from(document.querySelectorAll("#id_country"));
    checkboxes.forEach((element) => {
      //если id чекбокса совпадает с id стран выбранного элемента, то данные этих чекбоксов передаюся по дефолту на форму редактирования
      if (idList.includes(parseInt(element.value))) {
        element.checked = true;
        const country = JSON.parse(element.dataset.country);
        obj.push(country);
      }
    });
    setCountries(obj);
    props.passCheckedCountries(obj);
  }
  // const handleFilter = (value) => {
  //   if (value === "") return setSorted(props.countries);

  //   let result = props.countries.filter((country) =>
  //     country.name_country.toLowerCase().includes(value.toLowerCase())
  //   );

  //   console.log(props.countries);
  //   setSorted(result);
  // }; // убирает чек боксы при редактировании

  function handleChange(e) {
    // работа нажатия чекбоксов - передает на родительскую форму редактирования данные о выбранных чекбоксах
    const countryData = e.target.dataset.country;
    const country = JSON.parse(countryData);
    const isChecked = e.target.checked;
    if (isChecked) {
      setCountries([...countries, country]);
      props.passCheckedCountries([...countries, country]);
    } else {
      setCountries(
        countries.filter((c) => c.id_country !== country.id_country)
      );
      props.passCheckedCountries(
        countries.filter((c) => c.id_country !== country.id_country)
      );
    }
  }
  return (
    <div>
      {/* <input
        type="text"
        className="form-control mb-4 "
        placeholder="Поиск по названию"
        onChange={(e) => handleFilter(e.target.value)}
      /> */}
      <div className="accordion" id="accordionExample">
        <div className="accordion-item">
          <h2 className="accordion-header">
            <button
              className="accordion-button"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#collapseOne"
              aria-expanded="true"
              aria-controls="collapseOne"
            >
              Выберите страну
            </button>
          </h2>
          <div
            id="collapseOne"
            className="accordion-collapse collapse show"
            data-bs-parent="#accordionExample"
          >
            <div className="accordion-body">
              {props.countries
                .sort((a, b) => a.name_country.localeCompare(b.name_country))
                .map((country) => (
                  <div className="form-check" key={country.id_country}>
                    <input
                      className="form-check-input"
                      type="checkbox"
                      value={country.id_country}
                      onChange={handleChange}
                      id="id_country"
                      data-country={JSON.stringify(country)}
                    ></input>
                    <label
                      className="form-check-label"
                      htmlFor={country.id_country}
                    >
                      {country.name_country}
                    </label>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
