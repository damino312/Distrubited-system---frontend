import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";
import ListCountries from "../components/ListCountries";

export default function EditLake() {
  let navigate = useNavigate();

  const { id } = useParams();

  const [lake, setLake] = useState({
    name_lake: "",
    height_lake: "",
    countries_lake: [],
  });

  const [countries, setCountries] = useState([]);

  const { name_lake, area_lake } = lake;

  useEffect(() => {
    loadLake(id);
  }, []);

  useEffect(() => {
    loadCountries();
  }, []);

  const loadCountries = async () => {
    const result = await axios.get("http://localhost:8080/counties");
    setCountries(result.data);
  };

  const [checkedCountries, setCheckedCountries] = useState(""); // для передачи выбранных чекбоксом стран из дочернего элемента
  function passCheckedCountries(msg) {
    setCheckedCountries(msg);
  }

  const onInputChange = (e) => {
    setLake({ ...lake, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const updatedLake = {
      ...lake,
      countries_lake: checkedCountries, // обновленное значение countries_river с данными из дочернего элемента, выбранными чекбоксами
    };
    await axios.put(`http://localhost:8080/lake/${id}`, updatedLake);
    navigate("/lake");
  };

  const loadLake = async () => {
    const result = await axios.get(`http://localhost:8080/lake/${id}`);
    setLake(result.data);
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-6 offset-md-3 border rounded p-4 mt-2 shadow">
          <h2 className="text-center m-4">Изменить озеро</h2>
          <form onSubmit={(e) => onSubmit(e)}>
            <div className="mb-3">
              <label htmlFor="name_lake" className="form-label">
                Название Озера
              </label>
              <input
                type={"text"}
                className="form-control"
                placeholder="Введите название озера"
                name="name_lake"
                value={name_lake}
                onChange={(e) => onInputChange(e)}
              ></input>
            </div>
            <div className="mb-3">
              <label htmlFor="height_lake" className="form-label">
                Площадь озера
              </label>
              <input
                type={"number"}
                className="form-control"
                placeholder="Введите площадь озера, км²"
                name="area_lake"
                value={area_lake}
                onChange={(e) => {
                  e.target.value = e.target.value.slice(0, 6);
                  onInputChange(e);
                }}
              ></input>
            </div>
            <div className="mb-3">
              <label htmlFor="countries" className="form-label">
                Страны
              </label>
              {countries.length && ( // чтобы ListCountries рендерилась один раз
                <ListCountries
                  countries={countries}
                  passCheckedCountries={passCheckedCountries}
                  checks={lake.countries_lake.map((elem) => elem.id_country)} // чтобы выставить чекбоксы при редактировании автоматически
                />
              )}
            </div>
            <button type="submit" className="btn btn-outline-primary">
              Подтвердить
            </button>
            <Link className="btn btn-outline-danger mx-2" to="/lake">
              Отменить
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
}
