import axios from "axios";
import React, { useEffect, useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";

export default function AddNationality(props) {
  const [nationality, setNationality] = useState("");
  const { handleModal, showModal, handleChangeNationality } = props;

  const [idEdit, setIdEdit] = useState("");
  const closeModal = () => {
    handleModal(false);
  };

  const handleAdd = async () => {
    // Ваш код для обработки добавления озера
    // Можете использовать значения из formData для создания нового озера
    await axios.post("http://localhost:8080/nationality", {
      name_nationality: nationality,
    });
    handleChangeNationality();

    // После обработки добавления озера, закройте модальное окно
    closeModal();
  };
  return (
    <div>
      <Modal show={showModal} onHide={closeModal}>
        <Modal.Header closeButton>
          <Modal.Title>Добавить</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="NationalityName">
              <Form.Label>Национальность</Form.Label>
              <Form.Control
                type="text"
                name="NationalityName"
                value={nationality}
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
          <Button variant="primary" onClick={handleAdd}>
            Добавить
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
} // чтобы при добавлении произошло обнолвение родительского элемента
