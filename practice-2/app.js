const express = require("express");
const cors = require("cors");
const { nanoid } = require("nanoid");
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const app = express();
const port = 3000;

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API интернет-магазина (Products)",
      version: "1.0.0",
      description: "CRUD API для управления товарами",
    },
    servers: [
      {
        url: `http://localhost:${port}`,
        description: "Локальный сервер",
      },
    ],
  },
  apis: ["./app.js"],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// JSON
app.use(express.json());

// CORS (React обычно на 3001, если backend на 3000)
app.use(
  cors({
    origin: "http://localhost:3001",
    methods: ["GET", "POST", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type"],
  })
);

// Логирование (как в методичке)
app.use((req, res, next) => {
  res.on("finish", () => {
    console.log(`[${new Date().toISOString()}] [${req.method}] ${res.statusCode} ${req.path}`);
    if (["POST", "PUT", "PATCH"].includes(req.method)) {
      console.log("Body:", req.body);
    }
  });
  next();
});

// ===== "База" в памяти: 10 товаров =====
let products = [
  {
    id: nanoid(6),
    name: "Компьютерная мышь",
    category: "Периферия",
    description: "Эргономичная форма, точный сенсор.",
    price: 1490,
    stock: 34,
    rating: 4.6,
  },
  {
    id: nanoid(6),
    name: "Клавиатура механическая",
    category: "Периферия",
    description: "Переключатели Blue, подсветка, anti-ghosting.",
    price: 4990,
    stock: 12,
    rating: 4.7,
  },
  {
    id: nanoid(6),
    name: "Наушники",
    category: "Аудио",
    description: "Закрытые, чистый звук, микрофон.",
    price: 3590,
    stock: 18,
    rating: 4.4,
  },
  {
    id: nanoid(6),
    name: "Монитор 24\" IPS",
    category: "Мониторы",
    description: "1920x1080, 75Hz, IPS матрица.",
    price: 12990,
    stock: 9,
    rating: 4.5,
  },
  {
    id: nanoid(6),
    name: "SSD 1TB",
    category: "Накопители",
    description: "NVMe, высокая скорость чтения/записи.",
    price: 8990,
    stock: 22,
    rating: 4.8,
  },
  {
    id: nanoid(6),
    name: "Видеокарта",
    category: "Комплектующие",
    description: "Подходит для игр 1080p, 8GB VRAM.",
    price: 28990,
    stock: 6,
    rating: 4.3,
  },
  {
    id: nanoid(6),
    name: "Оперативная память 16GB",
    category: "Комплектующие",
    description: "DDR4, 3200MHz, 2x8GB.",
    price: 4590,
    stock: 40,
    rating: 4.7,
  },
  {
    id: nanoid(6),
    name: "Блок питания 650W",
    category: "Комплектующие",
    description: "80+ Bronze, тихий вентилятор.",
    price: 5990,
    stock: 15,
    rating: 4.5,
  },
  {
    id: nanoid(6),
    name: "Web-камера",
    category: "Аксессуары",
    description: "Full HD, автофокус, встроенный микрофон.",
    price: 2790,
    stock: 25,
    rating: 4.2,
  },
  {
    id: nanoid(6),
    name: "Коврик для мыши",
    category: "Аксессуары",
    description: "Большой размер, нескользящая основа.",
    price: 790,
    stock: 60,
    rating: 4.6,
  },
];

function findProductOr404(id, res) {
  const product = products.find((p) => p.id === id);
  if (!product) {
    res.status(404).json({ error: "Product not found" });
    return null;
  }
  return product;
}

function validateProductPayload(payload, { partial = false } = {}) {
  const errors = [];

  const has = (k) => payload[k] !== undefined;

  if (!partial || has("name")) {
    if (typeof payload.name !== "string" || !payload.name.trim()) errors.push("name must be a non-empty string");
  }
  if (!partial || has("category")) {
    if (typeof payload.category !== "string" || !payload.category.trim()) errors.push("category must be a non-empty string");
  }
  if (!partial || has("description")) {
    if (typeof payload.description !== "string" || !payload.description.trim())
      errors.push("description must be a non-empty string");
  }
  if (!partial || has("price")) {
    if (typeof payload.price !== "number" || payload.price < 0) errors.push("price must be a number >= 0");
  }
  if (!partial || has("stock")) {
    if (!Number.isInteger(payload.stock) || payload.stock < 0) errors.push("stock must be an integer >= 0");
  }
  if (has("rating")) {
    if (typeof payload.rating !== "number" || payload.rating < 0 || payload.rating > 5) errors.push("rating must be 0..5");
  }

  return errors;
}

/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       required:
 *         - name
 *         - category
 *         - description
 *         - price
 *         - stock
 *       properties:
 *         id:
 *           type: string
 *           description: Уникальный ID товара
 *         name:
 *           type: string
 *           description: Название товара
 *         category:
 *           type: string
 *           description: Категория товара
 *         description:
 *           type: string
 *           description: Описание товара
 *         price:
 *           type: number
 *           description: Цена товара
 *         stock:
 *           type: integer
 *           description: Остаток на складе
 *         rating:
 *           type: number
 *           nullable: true
 *           description: Рейтинг 0..5
 *       example:
 *         id: "a1b2c3"
 *         name: "SSD 1TB"
 *         category: "Накопители"
 *         description: "NVMe, высокая скорость чтения/записи."
 *         price: 8990
 *         stock: 22
 *         rating: 4.8
 */

// ===== Routes =====

// health
app.get("/", (req, res) => {
  res.json({ message: "Practice 4 backend is running", productsCount: products.length });
});

// CRUD: /api/products
/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Получить список всех товаров
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: Список товаров
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/Product"
 */
app.get("/api/products", (req, res) => {
  res.json(products);
});

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Получить товар по ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID товара
 *     responses:
 *       200:
 *         description: Товар найден
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Product"
 *       404:
 *         description: Товар не найден
 */
app.get("/api/products/:id", (req, res) => {
  const product = findProductOr404(req.params.id, res);
  if (!product) return;
  res.json(product);
});

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Создать новый товар
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/Product"
 *     responses:
 *       201:
 *         description: Товар создан
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Product"
 *       400:
 *         description: Ошибка валидации
 */
app.post("/api/products", (req, res) => {
  const errors = validateProductPayload(req.body, { partial: false });
  if (errors.length) return res.status(400).json({ error: "Validation error", details: errors });

  const newProduct = {
    id: nanoid(6),
    name: req.body.name.trim(),
    category: req.body.category.trim(),
    description: req.body.description.trim(),
    price: req.body.price,
    stock: req.body.stock,
    rating: req.body.rating ?? null,
  };

  products.push(newProduct);
  res.status(201).json(newProduct);
});

/**
 * @swagger
 * /api/products/{id}:
 *   patch:
 *     summary: Частично обновить товар
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID товара
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               category:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               stock:
 *                 type: integer
 *               rating:
 *                 type: number
 *                 nullable: true
 *     responses:
 *       200:
 *         description: Товар обновлён
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Product"
 *       400:
 *         description: Ошибка валидации или нечего обновлять
 *       404:
 *         description: Товар не найден
 */
app.patch("/api/products/:id", (req, res) => {
  const product = findProductOr404(req.params.id, res);
  if (!product) return;

  if (
    req.body?.name === undefined &&
    req.body?.category === undefined &&
    req.body?.description === undefined &&
    req.body?.price === undefined &&
    req.body?.stock === undefined &&
    req.body?.rating === undefined
  ) {
    return res.status(400).json({ error: "Nothing to update" });
  }

  const errors = validateProductPayload(req.body, { partial: true });
  if (errors.length) return res.status(400).json({ error: "Validation error", details: errors });

  if (req.body.name !== undefined) product.name = req.body.name.trim();
  if (req.body.category !== undefined) product.category = req.body.category.trim();
  if (req.body.description !== undefined) product.description = req.body.description.trim();
  if (req.body.price !== undefined) product.price = req.body.price;
  if (req.body.stock !== undefined) product.stock = req.body.stock;
  if (req.body.rating !== undefined) product.rating = req.body.rating;

  res.json(product);
});

/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Удалить товар
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID товара
 *     responses:
 *       204:
 *         description: Товар удалён (нет тела ответа)
 *       404:
 *         description: Товар не найден
 */
app.delete("/api/products/:id", (req, res) => {
  const id = req.params.id;
  const exists = products.some((p) => p.id === id);
  if (!exists) return res.status(404).json({ error: "Product not found" });

  products = products.filter((p) => p.id !== id);
  res.status(204).send();
});

// 404
app.use((req, res) => {
  res.status(404).json({ error: "Not found" });
});

// errors
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: "Internal server error" });
});

app.listen(port, () => {
  console.log(`Backend started: http://localhost:${port}`);
});