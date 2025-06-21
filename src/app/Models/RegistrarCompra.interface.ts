export interface DetalleVentaCommpra {
  id_Producto: number;
  cantidad: number;
  precio: number;
}

export interface CompraRequest {
  detalles: DetalleVentaCommpra[];
}

export interface CompraResponseR {
  success: boolean;
  message: string;
  data: string[];
}
