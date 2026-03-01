import React, { useEffect, useState } from "react";

export default function ProductModal({ open, mode, initialProduct, onClose, onSubmit }) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [rating, setRating] = useState("");

  useEffect(() => {
    if (!open) return;

    setName(initialProduct?.name ?? "");
    setCategory(initialProduct?.category ?? "");
    setDescription(initialProduct?.description ?? "");
    setPrice(initialProduct?.price != null ? String(initialProduct.price) : "");
    setStock(initialProduct?.stock != null ? String(initialProduct.stock) : "");
    setRating(initialProduct?.rating != null ? String(initialProduct.rating) : "");
  }, [open, initialProduct]);

  if (!open) return null;

  const title = mode === "edit" ? "Редактирование товара" : "Создание товара";

  const handleSubmit = (e) => {
    e.preventDefault();

    const trimmedName = name.trim();
    const trimmedCat = category.trim();
    const trimmedDesc = description.trim();

    const parsedPrice = Number(price);
    const parsedStock = Number(stock);
    const parsedRating = rating === "" ? null : Number(rating);

    if (!trimmedName) return alert("Введите название");
    if (!trimmedCat) return alert("Введите категорию");
    if (!trimmedDesc) return alert("Введите описание");

    if (!Number.isFinite(parsedPrice) || parsedPrice < 0) return alert("Цена должна быть числом >= 0");
    if (!Number.isInteger(parsedStock) || parsedStock < 0) return alert("Количество на складе должно быть целым числом >= 0");

    if (parsedRating !== null) {
      if (!Number.isFinite(parsedRating) || parsedRating < 0 || parsedRating > 5) {
        return alert("Рейтинг должен быть числом от 0 до 5");
      }
    }

    onSubmit({
      id: initialProduct?.id,
      name: trimmedName,
      category: trimmedCat,
      description: trimmedDesc,
      price: parsedPrice,
      stock: parsedStock,
      rating: parsedRating,
    });
  };

  return (
    <div className="backdrop" onMouseDown={onClose}>
      <div className="modal" onMouseDown={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        <div className="modal__header">
          <div className="modal__title">{title}</div>
          <button className="iconBtn" onClick={onClose} aria-label="Закрыть">
            ✕
          </button>
        </div>

        <form className="form" onSubmit={handleSubmit}>
          <label className="label">
            Название
            <input className="input" value={name} onChange={(e) => setName(e.target.value)} />
          </label>

          <label className="label">
            Категория
            <input className="input" value={category} onChange={(e) => setCategory(e.target.value)} />
          </label>

          <label className="label">
            Описание
            <textarea
              className="input input--textarea"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </label>

          <div className="grid2">
            <label className="label">
              Цена (₽)
              <input className="input" inputMode="decimal" value={price} onChange={(e) => setPrice(e.target.value)} />
            </label>

            <label className="label">
              На складе (шт.)
              <input className="input" inputMode="numeric" value={stock} onChange={(e) => setStock(e.target.value)} />
            </label>
          </div>

          <label className="label">
            Рейтинг (0–5, можно пусто)
            <input className="input" inputMode="decimal" value={rating} onChange={(e) => setRating(e.target.value)} />
          </label>

          <div className="modal__footer">
            <button type="button" className="btn" onClick={onClose}>
              Отмена
            </button>
            <button type="submit" className="btn btn--primary">
              {mode === "edit" ? "Сохранить" : "Создать"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}