const express = require('express');
const sqlite = require('sqlite');
const path = require('path');
const sqliteDriver = require('sqlite3');

const app = express();
const PORT = 3000;
const DB_PATH = path.join(__dirname, 'The 3B-Llaks.db');

app.use(express.static(path.join(__dirname)));
app.use(express.json());

app.get('/api/producto/:id', async (req, res) => {
    let db;
    try {
        const productoId = req.params.id;

        db = await sqlite.open({
            filename: DB_PATH,
            driver: sqliteDriver.Database 
        });

        const producto = await db.get(
            `SELECT 
                p_name AS nombre, 
                price AS precio,
                category AS categoria, 
                image AS imagen_url 
             FROM Products 
             WHERE id_product = ?`, 
            [productoId]
        );

        if (producto) {
            res.json(producto);
        } else {
            res.status(404).json({ error: 'Producto no encontrado' });
        }
    } catch (err) {
        console.error('Error al obtener producto:', err);
        res.status(500).json({ error: 'Error interno del servidor' });
    } finally {
        if (db) {
            await db.close();
        }
    }
});

app.post('/api/agregar-producto', async (req, res) => {
    let db;
    try {
        const { nombre, precio, categoria, imagen } = req.body;

        db = await sqlite.open({
            filename: DB_PATH,
            driver: sqliteDriver.Database 
        });

        await db.run(
            `INSERT INTO Products (p_name, price, category, image) VALUES (?, ?, ?, ?)`,
            [nombre, precio, categoria, imagen]
        );

        res.status(201).json({ message: 'Producto agregado' });
    } catch (err) {
        console.error('Error al agregar producto:', err);
        res.status(500).json({ error: 'Error interno del servidor' });
    } finally {
        if (db) {
            await db.close();
        }
    }
});

app.delete('/api/eliminar-producto/:id', async (req, res) => {
    let db;
    try {
        const productoId = req.params.id;

        db = await sqlite.open({
            filename: DB_PATH,
            driver: sqliteDriver.Database 
        });

        const result = await db.run(
            `DELETE FROM Products WHERE id_product = ?`,
            [productoId]
        );

        if (result.changes > 0) {
            res.json({ message: 'Producto eliminado correctamente' });
        } else {
            res.status(404).json({ error: 'Producto no encontrado' });
        }
    } catch (err) {
        console.error('Error al eliminar producto:', err);
        res.status(500).json({ error: 'Error interno del servidor' });
    } finally {
        if (db) {
            await db.close();
        }
    }
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});