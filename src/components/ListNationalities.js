import React, { useEffect, useState } from "react";

export default function ListNationalities(props) {
  const [currentData, setCurrentData] = useState({
    nationalities: [],
    population: [],
  });

  function handleChange(e) {
    // работа нажатия чекбоксов - передает на родительскую форму редактирования данные о выбранных чекбоксах
    const nationalityData = e.target.dataset.nationality;
    const nationality = JSON.parse(nationalityData);
    const isChecked = e.target.checked;

    const rowId = document.getElementById(`t${e.target.id.slice(1)}`); // [1] чтобы второй символ (цифру) взять из e.target.id
    if (isChecked) {
      setCurrentData({
        ...currentData, // распыляем текущие значения из currentData
        nationalities: [...currentData.nationalities, nationality], // создаем новый массив nationalities
      });
      props.passData({
        //для родителя
        ...currentData, // распыляем текущие значения из currentData
        nationalities: [...currentData.nationalities, nationality], // создаем новый массив nationalities
      });

      rowId.disabled = false;
      // console.log(currentData);
    } else {
      // галку убираем
      const updatedNationalities = currentData.nationalities.filter(
        // удаляем народ под убранной галкой
        (n) => n.id_nationality !== nationality.id_nationality
      );
      const updatedPopulation = currentData.population.filter(
        // удаляем строку с количеством народа под убранной галкой
        (e) => e.id_population !== nationality.id_nationality
      );
      setCurrentData({
        //обновляем инфу
        population: updatedPopulation,
        nationalities: updatedNationalities,
      });
      props.passData({
        //для родителя
        //обновляем инфу
        population: updatedPopulation,
        nationalities: updatedNationalities,
      });

      rowId.disabled = true; //вырубаем текстовое поле около отключенной галки
      rowId.value = ""; // очищаем текстовое поле
    }
  }

  function handleText(e) {
    const checkbox = document.getElementById(`c${e.target.id.slice(1)}`);

    const id_population = Number(checkbox.value);

    const populationIndex = currentData.population.findIndex(
      (p) => p.id_population === id_population
    );

    if (populationIndex !== -1) {
      setCurrentData({
        ...currentData,
        population: currentData.population.map((p, i) =>
          i === populationIndex ? { ...p, populationText: e.target.value } : p
        ),
      });
    } else {
      setCurrentData({
        ...currentData,
        population: [
          ...currentData.population,
          { id_population: id_population, populationText: e.target.value },
        ],
      });
    }
    console.log(currentData);
  }
  return (
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
            Выберите национальности
          </button>
        </h2>
        <div
          id="collapseOne"
          className="accordion-collapse collapse show"
          data-bs-parent="#accordionExample"
        >
          <div className="accordion-body">
            {props.nationalities.map((nationality, index) => (
              <div
                className="form-check d-flex flex-row mb-3 align-items-center"
                key={nationality.id_nationality}
              >
                <div className="p-2 d-block">
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    aria-label="Sizing example input"
                    aria-describedby="inputGroup-sizing-sm"
                    disabled={true}
                    onChange={(e) => {
                      e.target.value = e.target.value.slice(0, 7);
                      handleText(e);
                    }}
                    id={"t" + index}
                  ></input>
                </div>

                <input
                  className="form-check-input m-0  p-2 d-block"
                  type="checkbox"
                  value={nationality.id_nationality}
                  onChange={handleChange}
                  id={"c" + index}
                  data-nationality={JSON.stringify(nationality)}
                ></input>

                <label
                  className="form-check-label p-2 d-block"
                  htmlFor={nationality.id_nationality}
                >
                  {nationality.name_nationality}
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
