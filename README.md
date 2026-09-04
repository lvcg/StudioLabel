# StudioLabel

StudioLabel is a polished product label generator for independent skincare, candle, and soap makers. It replaces the original AI Decision Journal with a focused maker workflow and live, print-ready label preview.

## Features

- Dedicated candle, skincare, and soap templates
- Live label preview while editing
- Structured ingredient chips with INCI guidance
- Editable safety warnings and care instructions
- Real EAN-13 barcode generation, checksum validation, and SVG rendering
- Maker details, net contents, product variant, and description fields
- Saved label library backed by local storage for zero-setup demos
- Optional MongoDB product-label API
- Portrait/landscape preview, print mode, and portable text export
- Responsive editor for desktop and mobile

## Stack

Node.js, TypeScript, Express, MongoDB/Mongoose, HTML, CSS, and modern JavaScript.

## Run locally

```bash
npm install
npm run build
npm start
```

Open <http://localhost:5000>. No environment variables are required for demo mode; labels persist in the browser.

To enable the server persistence API, copy `.env.example` to `.env` and add a MongoDB connection string:

```env
MONGODB_URL=mongodb://localhost:27017/studiolabel
PORT=5000
```

## API

- `GET /api/health`
- `GET /api/products`
- `POST /api/products`
- `PATCH /api/products/:id`
- `DELETE /api/products/:id`

## Important

StudioLabel helps organize label content but does not provide legal or regulatory advice. Makers should verify labeling requirements for their product category and sales region before production.
