export interface ProductoResponse {
  success: boolean;
  message: string;
  data: Producto[];
}

export interface Producto {
  id_producto: number;
  nombre_producto: string;
  nroLote: string;
  costo: number;
  precioVenta: number;
}
