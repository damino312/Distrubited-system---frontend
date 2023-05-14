import React, { useEffect, useState } from "react";

export default function ListNationalities(props) {
  const [currentData, setCurrentData] = useState({
    nationalities: [],
    population: [],
  });

  const [nationalities, setNationalities] = useState([]);
  const [checkboxes, setCheckboxes] = useState([]);
  const [textinputs, setTextinputs] = useState([]);

  useEffect(() => {
    enableCheck();
  }, []);

  function enableCheck() {
    let obj = {
      nationalities: [],
      population: [],
    };
    const populations = props.populations;

    if (populations === undefined) return null;
    const idPopulations = populations.map((obj) => obj.id);
    const checkboxes = Array.from(
      document.querySelectorAll('[data-input="checkbox"]')
    );
    setCheckboxes(checkboxes);
    const textinputs = Array.from(
      document.querySelectorAll('[data-input="text"]')
    );
    setTextinputs(textinputs);

    checkboxes.forEach((element) => {
      //если id чекбокса совпадает с id стран выбранного элемента, то данные этих чекбоксов передаюся по дефолту на форму редактирования
      if (idPopulations.includes(parseInt(element.value))) {
        element.checked = true;

        const textInputId = element.id.slice(1); // получаем textinput определенного checkbox

        const textinput = textinputs.find(
          (obj) => obj.id === "t" + textInputId
        );
        textinput.disabled = false;

        const populationNumber = populations.find(
          (obj) => obj.id === parseInt(element.value)
        ).population; //количество людей для определенного textinput
        textinput.value = populationNumber;
        //
        const nationality = JSON.parse(element.dataset.nationality);

        obj.nationalities.push(nationality);
        obj.population.push({
          id_population: Number(element.value),
          populationText: populationNumber,
        });
      }
    });
    setCurrentData(obj);
    props.passData(obj);
  }

  function handleChange(e) {
    setCurrentData((currentData) => ({ ...currentData }));
    const element = e.currentTarget ? e.currentTarget : e;
    // работа нажатия чекбоксов - передает на родительскую форму редактирования данные о выбранных чекбоксах
    const nationalityData = element.dataset.nationality;
    const nationality = JSON.parse(nationalityData);
    const isChecked = element.checked;

    const rowId = document.getElementById(`t${element.id.slice(1)}`); // [1] чтобы второй символ (цифру) взять из e.target.id
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
    } else {
      console.log(currentData);
      console.log(currentData.nationalities);
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
    setCurrentData((currentData) => ({ ...currentData }));
    const element = e.currentTarget ? e.currentTarget : e;
    const checkbox = document.getElementById(`c${element.id.slice(1)}`);

    const id_population = Number(checkbox.value);

    const populationIndex = currentData.population.findIndex(
      (p) => p.id_population === id_population
    );

    if (populationIndex !== -1) {
      setCurrentData({
        ...currentData,
        population: currentData.population.map((p, i) =>
          i === populationIndex ? { ...p, populationText: element.value } : p
        ),
      });
      props.passData({
        ...currentData,
        population: currentData.population.map((p, i) =>
          i === populationIndex ? { ...p, populationText: element.value } : p
        ),
      });
    } else {
      setCurrentData({
        ...currentData,
        population: [
          ...currentData.population,
          {
            id_population: id_population,
            populationText: element.value,
          },
        ],
      });
      props.passData({
        ...currentData,
        population: [
          ...currentData.population,
          {
            id_population: id_population,
            populationText: element.value,
          },
        ],
      });
    }
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
                    onInput={handleText.bind(this)}
                    onChange={(e) =>
                      (e.target.value = e.target.value.slice(0, 7))
                    }
                    id={"t" + index}
                    data-input="text"
                  ></input>
                </div>

                <input
                  className="form-check-input m-0  p-2 d-block"
                  type="checkbox"
                  value={nationality.id_nationality}
                  onChange={handleChange.bind(this)}
                  id={"c" + index}
                  data-nationality={JSON.stringify(nationality)}
                  data-input="checkbox"
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
