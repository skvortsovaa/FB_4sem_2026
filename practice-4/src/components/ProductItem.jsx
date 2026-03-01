import React from "react";

export default function ProductItem({ product, onEdit, onDelete }) {
  return (
    <div className="row">
      <div className="main">
        <div className="id">#{product.id}</div>
        <div className="name">{product.name}</div>

        <div className="meta">
          <span className="badge">{product.category}</span>
          <span className="muted">•</span>
          <span className="muted">{product.stock} шт.</span>
          <span className="muted">•</span>
          <span className="muted">⭐ {product.rating ?? "—"}</span>
        </div>

        <div className="desc">{product.description}</div>
      </div>

      <div className="right">
        <div className="price">{product.price} ₽</div>

        <div className="actions">
          <button className="btn" onClick={() => onEdit(product)}>
            Редактировать
          </button>
          <button className="btn btn--danger" onClick={() => onDelete(product.id)}>
            Удалить
          </button>
        </div>
      </div>
    </div>
  );
}