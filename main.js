const productoImg = document.getElementById('producto-img');
const productoNombre = document.getElementById('producto-nombre');
const productoCategoria = document.getElementById('producto-categoria');
const productoPrecio = document.getElementById('producto-precio');
const btnComprar = document.getElementById('btn-comprar');
const btnBuscar = document.getElementById('btn-buscar');
const btnAgregar = document.getElementById('btn-agregar');
const btnEliminar = document.getElementById('btn-eliminar');
const buscarInput = document.getElementById('buscar-id');

let currentProductId = null;

// Función para cargar un producto específico
async function loadProduct(productId) {
    productoNombre.textContent = 'Cargando producto...';
    productoCategoria.textContent = '';
    productoPrecio.textContent = '';
    productoImg.src = '';

    try {
        const response = await fetch(`/api/producto/${productId}`);
        const data = await response.json();

        if (response.ok) {
            productoNombre.textContent = data.nombre;
            productoPrecio.textContent = `$${data.precio.toFixed(2)}`;
            productoCategoria.textContent = data.categoria;
            productoImg.src = `image/${data.imagen_url}`;
            productoImg.alt = data.nombre;
            currentProductId = productId;
        } else {
            productoNombre.textContent = 'ERROR: Producto no encontrado';
            productoPrecio.textContent = '';
            productoCategoria.textContent = '';
            productoImg.src = '';
            currentProductId = null;
            console.error('Error:', data.error);
        }
    } catch (error) {
        productoNombre.textContent = 'ERROR: No se pudo conectar al servidor';
        productoPrecio.textContent = '';
        productoCategoria.textContent = '';
        productoImg.src = '';
        currentProductId = null;
        console.error('Error al cargar producto:', error);
    }
}

// Evento para buscar producto
btnBuscar.addEventListener('click', () => {
    const id = buscarInput.value.trim();
    if (id && id > 0) {
        loadProduct(id);
        buscarInput.focus();
    } else {
        alert('Por favor ingresa un ID válido');
    }
});

// Buscar al presionar Enter
buscarInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        btnBuscar.click();
    }
});

// Agregar producto
btnAgregar.addEventListener('click', () => {
    window.location.href = 'agregar.html';
});

// Comprar producto
btnComprar.addEventListener('click', () => {
    if (!currentProductId) {
        alert('Por favor busca un producto primero');
        return;
    }
    alert(`¡Producto "${productoNombre.textContent}" comprado exitosamente!\nID: ${currentProductId}\nPrecio: ${productoPrecio.textContent}`);
});

// Eliminar producto
btnEliminar.addEventListener('click', async () => {
    if (!currentProductId) {
        alert('Por favor busca un producto primero');
        return;
    }
    if (confirm('¿Está seguro de que desea eliminar este producto?')) {
        try {
            const response = await fetch(`/api/eliminar-producto/${currentProductId}`, {
                method: 'DELETE'
            });
            const data = await response.json();

            if (response.ok) {
                alert('Producto eliminado correctamente');
                productoNombre.textContent = 'Ingresa un ID para buscar';
                productoPrecio.textContent = '';
                productoCategoria.textContent = '';
                productoImg.src = '';
                currentProductId = null;
                buscarInput.value = '';
                buscarInput.focus();
            } else {
                alert('Error al eliminar: ' + data.error);
            }
        } catch (error) {
            alert('Error al conectar con el servidor');
            console.error('Error:', error);
        }
    }
});