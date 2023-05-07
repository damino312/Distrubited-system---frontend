import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";
import ListCountries from "../components/ListCountries";

export default function EditMountain() {
  let navigate = useNavigate();

  const { id } = useParams();

  const [mountain, setMountain] = useState({
    name_mountain: "",
    height_mountain: "",
    countries_mountain: [],
  });

  const [countries, setCountries] = useState([]);

  const { name_mountain, height_mountain } = mountain;

  useEffect(() => {
    loadMountain(id);
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
    setMountain({ ...mountain, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const updatedMountain = {
      ...mountain,
      countries_mountain: checkedCountries, // обновленное значение countries_river с данными из дочернего элемента, выбранными чекбоксами
    };
    await axios.put(`http://localhost:8080/mountain/${id}`, updatedMountain);
    navigate("/mountain");
    console.log(mountain);
  };

  const loadMountain = async () => {
    const result = await axios.get(`http://localhost:8080/mountain/${id}`);
    setMountain(result.data);
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-6 offset-md-3 border rounded p-4 mt-2 shadow">
          <h2 className="text-center m-4">Изменить гору</h2>
          <form onSubmit={(e) => onSubmit(e)}>
            <div className="mb-3">
              <label htmlFor="name_mountain" className="form-label">
                Название горы
              </label>
              <input
                type={"text"}
                className="form-control"
                placeholder="Введите название горы"
                name="name_mountain"
                value={name_mountain}
                onChange={(e) => onInputChange(e)}
              ></input>
            </div>
            <div className="mb-3">
              <label htmlFor="height_mountain" className="form-label">
                Длина реки
              </label>
              <input
                type={"number"}
                className="form-control"
                placeholder="Введите высоту, м"
                name="height_mountain"
                value={height_mountain}
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
                  checks={mountain.countries_mountain.map(
                    (elem) => elem.id_country
                  )} // чтобы выставить чекбоксы при редактировании автоматически
                />
              )}
            </div>
            <button type="submit" className="btn btn-outline-primary">
              Подтвердить
            </button>
            <Link className="btn btn-outline-danger mx-2" to="/mountain">
              Отменить
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
}
