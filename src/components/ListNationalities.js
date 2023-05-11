import React, { useEffect, useState } from "react";

export default function ListNationalities(props) {
  const [nationalities, setNationalities] = useState([]);

  useEffect(() => {
    enableCheck();
  }, []);

  function enableCheck() {
    let obj = [];
    // включает чекбоксы при редактировании записи
    if (!props.checks) return null;
    const idList = props.checks;
    const checkboxes = Array.from(document.querySelectorAll("#id_nationality"));
    checkboxes.forEach((element) => {
      //если id чекбокса совпадает с id стран выбранного элемента, то данные этих чекбоксов передаюся по дефолту на форму редактирования
      if (idList.includes(parseInt(element.value))) {
        element.checked = true;
        const nationality = JSON.parse(element.dataset.nationality);
        obj.push(nationality);
      }
    });
    setNationalities(obj);
    props.passCheckedNationalities(obj);
  }

  function handleChange(e) {
    // работа нажатия чекбоксов - передает на родительскую форму редактирования данные о выбранных чекбоксах
    const nationalityData = e.target.dataset.nationality;
    const nationality = JSON.parse(nationalityData);
    const isChecked = e.target.checked;

    const rowId = document.getElementById(`t${e.target.id[1]}`); // [1] чтобы второй символ (цифру) взять из e.target.id

    if (isChecked) {
      setNationalities([...nationalities, nationality]);
      props.passCheckedNationalities([...nationalities, nationality]);
      rowId.disabled = false;
    } else {
      setNationalities(
        nationalities.filter(
          (c) => c.id_nationality !== nationality.id_nationality
        )
      );

      props.passCheckedNationalities(
        nationalities.filter(
          (c) => c.id_nationality !== nationality.id_nationality
        )
      );
      rowId.disabled = true;
      rowId.value = 0;
    }
  }

  function handleText(e) {
    const checkbox = document.getElementById(`c${e.target.id[1]}`); // [1] чтобы второй символ (цифру) взять из e.target.id
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
                    onChange={handleText}
                    id={"t" + index}
                    value={0}
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
