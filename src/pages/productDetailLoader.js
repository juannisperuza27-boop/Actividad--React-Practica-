import { getProductById } from '../services/productsApi';

export async function productLoader({ params }) {
  return getProductById(params.id);
}