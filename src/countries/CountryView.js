import axios from "axios";
import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

export default function CountryView() {
  const { id } = useParams();
  const [views, setViews] = useState({
    rivers: [],
    mountains: [],
    lakes: [],
    highestMountain: "",
    riversLength: "",
    lakesArea: "",
    country: "",
  });

  const [nationalities, setNationalities] = useState("");
  const [match, setMatch] = useState([]);

  useEffect(() => {
    loadCountryView(id);
  }, []); // одиначный вызов не выводит объект, почему то, поэтому работает постоянный

  useEffect(() => {
    loadNationalities(id);
  }, []);

  const loadCountryView = async (id) => {
    const result = await axios.get(`http://localhost:8080/getview/${id}`);
    setViews(result.data);
  };
  const loadNationalities = async (id) => {
    const result = await axios.get("http://localhost:8080/nationalities");
    setNationalities(result.data);
  };

  useEffect(() => {
    if (views && nationalities) {
      matchData(views.country, nationalities);
    }
  }, [views, nationalities]);

  //совмещаем объкты
  const matchData = (views, nationalities) => {
    console.log(views);
    const match = views.populations.map((obj) => {
      const object = nationalities.find(
        (o) => obj.id.idNationality == o.id_nationality
      );
      return {
        id: object.id_nationality,
        name: object.name_nationality,
        population: obj.population,
      };
    });
    setMatch(match);
  };
  if (match == []) return <div>Loading...</div>;
  return (
    <div className="container">
      <div>
        <h1 className="text-center">Страна {views.country.name_country}:</h1>
        <div className="mb-2">
          <span className="bg-success py-1 px-3 mx-2 text-light d-inline-block h5 rounded">
            Столица:
          </span>
          <span className="bg-success py-1 px-3 mx-2 text-light d-inline-block h5 rounded">
            {views.country.capital_country}
          </span>
        </div>
        <div className="mb-2">
          <span className="bg-success py-1 px-3 mx-2 text-light d-inline-block h5 rounded">
            Площадь:
          </span>
          <span className="bg-success py-1 px-3 mx-2 text-light d-inline-block h5 rounded">
            {views.country.area_country} км²
          </span>
        </div>
        <div className="mb-2">
          <span className="bg-primary py-1 px-3 mx-2 text-light d-inline-block h5 rounded">
            Реки:
          </span>
          {views.rivers.length ? (
            views.rivers.map((River) => (
              <span
                key={River.id_river}
                className="bg-primary py-1 px-2 mx-2 text-light d-inline-block h5 rounded"
              >
                {River.name_river}
              </span>
            ))
          ) : (
            <span className="bg-primary py-1 px-2 mx-2 text-light d-inline-block h5 rounded">
              Нет рек
            </span>
          )}
        </div>
        <div className="mb-2">
          <span className="bg-warning py-1 px-3 mx-2 text-light d-inline-block h5 rounded">
            Горы:
          </span>
          {views.mountains.length ? (
            views.mountains.map((Mountain) => (
              <span
                key={Mountain.id_mountain}
                className="bg-warning py-1 px-2 mx-2 text-light d-inline-block h5 rounded"
              >
                {Mountain.name_mountain}
              </span>
            ))
          ) : (
            <span className="bg-warning py-1 px-2 mx-2 text-light d-inline-block h5 rounded">
              Нет гор
            </span>
          )}
        </div>
        <div className="mb-2">
          <span className="bg-info py-1 px-3 mx-2 text-light d-inline-block h5 rounded">
            Озера:
          </span>
          {views.lakes.length ? (
            views.lakes.map((Lake) => (
              <span
                key={Lake.id_lake}
                className="bg-info py-1 px-2 mx-2 text-light d-inline-block h5 rounded"
              >
                {Lake.name_lake}
              </span>
            ))
          ) : (
            <span className="bg-info py-1 px-2 mx-2 text-light d-inline-block h5 rounded">
              Нет озер
            </span>
          )}
        </div>
        <div className="mb-2">
          <span className="bg-danger py-1 px-3 mx-2 text-light d-inline-block h5 rounded">
            Самая высокая горам:
          </span>
          <span className="bg-danger py-1 px-3 mx-2 text-light d-inline-block h5 rounded">
            {views.highestMountain} м
          </span>
        </div>
        <div className="mb-2">
          <span className="bg-danger py-1 px-3 mx-2 text-light d-inline-block h5 rounded">
            Протяженность всех рек:
          </span>
          <span className="bg-danger py-1 px-3 mx-2 text-light d-inline-block h5 rounded">
            {views.riversLength} км
          </span>
        </div>
        <div className="mb-2">
          <span className="bg-danger py-1 px-3 mx-2 text-light d-inline-block h5 rounded">
            Суммарная площадь озер:
          </span>
          <span className="bg-danger py-1 px-3 mx-2 text-light d-inline-block h5 rounded">
            {views.lakesArea} км²
          </span>
        </div>
        <div>
          <span className="bg-secondary py-1 px-3 mx-2 text-light d-inline-block h5 rounded">
            Население ( {views.country.population_country} тыс. чел) включает:
          </span>
          {match.map((obj) => (
            <span
              className="bg-secondary py-1 px-3 mx-2 text-light d-inline-block h5 rounded"
              key={obj.id}
            >
              {obj.name} : {obj.population}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
