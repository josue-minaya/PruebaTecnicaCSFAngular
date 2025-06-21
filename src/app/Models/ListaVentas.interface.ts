export interface VentaResponse {
  success: boolean;
  message: string;
  data: Venta[];
}

export interface Venta {
  id: number;
  fecha: string; // o Date si lo vas a parsear
  subTotal: number;
  igv: number;
  total: number;
  detalles: VentaDetalle[];
}

export interface VentaDetalle {
  id_VentaDet: number;
  id_VentaCab: number;
  id_Producto: number;
  cantidad: number;
  precio: number;
  sub_Total: number;
  igv: number;
  total: number;
}
