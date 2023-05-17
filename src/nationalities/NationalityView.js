import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";
import React from "react";

export default function NationalityView() {
  const { id } = useParams();
  const [nationality, setNationality] = useState(null);
  const [countries, setCounties] = useState(null);
  const [countryView, setCountryView] = useState(null);

  useEffect(() => {
    loadNationality();
    console.log(nationality);
  }, []);

  useEffect(() => {
    loadCountries();
  }, []);

  useEffect(() => {
    if (countries && nationality) {
      let arrPopulations = []; // содержит массив объектов, каждый объект содержит страну в которой данная нациольность находится и количество людей данной национальности
      let arrCountries = countries.map((obj) => ({
        id_country: obj.id_country,
        name_country: obj.name_country,
      })); // содержит массив объектов стран состоящий из id и имени
      nationality.populations.forEach((element) => {
        arrPopulations.push({
          id_country: element.id.idCountry,
          name_country: arrCountries.find(
            (obj) => obj.id_country === element.id.idCountry
          ).name_country, // ищем по id страну, и присваеваем имя нашей страны к полю name_country
          population: element.population,
        });
      });
      setCountryView(arrPopulations);
    }
  }, [countries, nationality]);

  const loadNationality = async () => {
    const result = await fetch(`http://localhost:8080/nationality/${id}`)
      .then((response) => response.json())
      .then((data) => {
        setNationality(data);
      })
      .catch((error) => console.error("Error in fetching nationality"));
  };
  const loadCountries = async () => {
    const result = await fetch(`http://localhost:8080/counties`)
      .then((response) => response.json())
      .then((data) => {
        setCounties(data);
      })
      .catch((error) => console.error("Error in fetching counties"));
  };

  return (
    <div className="container w-50">
      {countryView ? (
        <div>
          {console.log(countryView)}
          <div className="h1 my-3 text-center">
            Страны, в которых проживают {nationality.name_nationality}
          </div>
          <div>
            <table class="table border shadow">
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Название страны</th>
                  <th scope="col">Численность народа</th>
                </tr>
              </thead>
              <tbody>
                {countryView.map((obj, index) => (
                  <tr key={obj.id_country}>
                    <th scope="row">{index + 1}</th>
                    <td>{obj.name_country}</td>
                    <td>{obj.population}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <Link className="btn btn-outline-primary mx-2" to="/nationality">
              Назад
            </Link>
          </div>
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
}
