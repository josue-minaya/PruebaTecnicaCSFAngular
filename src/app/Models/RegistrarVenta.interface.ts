export interface DetalleVentaCommpra {
  id_Producto: number;
  cantidad: number;
  precio: number;
}

export interface VentaRequest {
  detalles: DetalleVentaCommpra[];
}

export interface VentaResponseR {
  success: boolean;
  message: string;
  data: string[];
}
export interface ProductoConStock {
  id_producto: number;
  nombre_producto: string;
  precioVenta: number;
  stock: number;
  costo: number;
}
export interface Producto {
  id_producto: number;
  nombre_producto: string;
  precioVenta: number;
  costo: number;
}
