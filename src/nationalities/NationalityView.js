import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";
import React from "react";

export default function NationalityView() {
  const { id } = useParams();
  const [NationalityView, setNationalityView] = useState(null);

  useEffect(() => {
    loadNationalityView();
  }, []);

  const loadNationalityView = async () => {
    const result = await fetch(`http://localhost:8080/nationality/${id}`)
      .then((response) => response.json())
      .then((data) => {
        setNationalityView(data);
      })
      .catch((error) => console.error("Error in fetching nationality"));
  };

  return (
    <div className="container">
      {NationalityView ? (
        <div>{JSON.stringify(NationalityView)}</div>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
}
