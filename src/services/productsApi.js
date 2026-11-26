const BASE_URL = '/api/products';

async function handleResponse(response, defaultMessage) {
  if (!response.ok) {
    let errorDetail = defaultMessage;
    try {
      const errorData = await response.json();
      if (errorData?.message) {
        errorDetail = errorData.message;
      }
    } catch {
      // Si el cuerpo no es JSON, mantenemos el mensaje por defecto
    }
    const error = new Error(errorDetail);
    error.status = response.status;
    throw error;
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

export async function getProducts(params = {}) {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.set(key, String(value));
    }
  });

  const queryString = searchParams.toString();
  const url = queryString ? `${BASE_URL}?${queryString}` : BASE_URL;

  const response = await fetch(url);
  return handleResponse(response, 'No se pudieron cargar los productos.');
}

export async function getLatestProducts(limit = 3) {
  const response = await fetch(`${BASE_URL}?_sort=-createdAt&_limit=${limit}`);
  return handleResponse(response, 'No se pudieron cargar los productos recientes.');
}

export async function getProductById(id) {
  const response = await fetch(`${BASE_URL}/${id}`);
  return handleResponse(response, 'Producto no encontrado.');
}

export async function createProduct(productData) {
  const newProduct = {
    ...productData,
    favorite: false,
    createdAt: new Date().toISOString(),
  };

  const response = await fetch(BASE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newProduct),
  });

  return handleResponse(response, 'No se pudo crear el producto.');
}

export async function updateProduct(id, productData) {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(productData),
  });

  return handleResponse(response, 'No se pudo actualizar el producto.');
}

export async function toggleFavoriteProduct(id, favorite) {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ favorite }),
  });

  return handleResponse(response, 'No se pudo actualizar el estado de favorito.');
}

export async function deleteProduct(id) {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: 'DELETE',
  });

  return handleResponse(response, 'No se pudo eliminar el producto.');
}