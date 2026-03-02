import React, { useMemo, useState } from "react";

export default function ProductItem({ product, onEdit, onDelete }) {
  const [imgOk, setImgOk] = useState(true);

  const imgSrc = useMemo(() => {
    const v = (product?.image ?? "").trim();
    if (!v) return null;

    // Полный URL
    if (v.startsWith("http://") || v.startsWith("https://") || v.startsWith("data:image/")) return v;

    // Старый вариант: локальная картинка с бэка
    if (v.startsWith("/img/")) return `http://localhost:3000${v}`;

    return null;
  }, [product?.image]);

  return (
    <div className="row">
      {imgSrc && imgOk && (
        <img
          className="thumb"
          src={imgSrc}
          alt={product.name}
          loading="lazy"
          referrerPolicy="no-referrer"
          onError={() => setImgOk(false)}
        />
      )}

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