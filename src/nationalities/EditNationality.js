import axios from "axios";
import React, { useEffect, useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";

export default function EditNationality(props) {
  const [nationality, setNationality] = useState({ name_nationality: "" });
  const { handleModal, showModal, handleChangeNationality, idEdit } = props;

  const closeModal = () => {
    handleModal(false);
  };
  const loadNationality = async () => {
    let result = await axios.get(`http://localhost:8080/nationality/${idEdit}`);
    setNationality(result.data);
  };

  useEffect(() => {
    if (idEdit) {
      loadNationality();
    }
  }, [idEdit]);

  const handleEdit = async () => {
    console.log(idEdit);
    await axios.put(`http://localhost:8080/nationality/${idEdit}`, {
      ...nationality,
      name_nationality: nationality,
    });
    handleChangeNationality();

    closeModal();
  };
  return (
    <div>
      <Modal show={showModal} onHide={closeModal}>
        <Modal.Header closeButton>
          <Modal.Title>Изменить</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="NationalityName">
              <Form.Label>Национальность</Form.Label>
              <Form.Control
                type="text"
                name="NationalityName"
                value={nationality.name_nationality}
                onChange={(event) => setNationality(event.target.value)}
                placeholder="Введите национальность"
              />
            </Form.Group>
            {/* Добавьте другие поля ввода здесь */}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeModal}>
            Закрыть
          </Button>
          <Button variant="primary" onClick={handleEdit}>
            Добавить
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
} // чтобы при добавлении произошло обнолвение родительского элемента
