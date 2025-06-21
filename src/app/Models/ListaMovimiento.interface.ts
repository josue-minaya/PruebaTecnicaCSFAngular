export interface MovimientoResponse {
  success: boolean;
  message: string;
  data: MovimientoCab[];
}

export interface MovimientoCab {
  id_MovimientoCab: number;
  fec_Registro: string;
  id_TipoMovimiento: 'ENTRADA' | 'SALIDA';
  id_DocumentoOrigen: number;
  detalles: MovimientoDet[];
}

export interface MovimientoDet {
  id_MovimientoDet: number;
  id_Movimientocab: number;
  id_Producto: number;
  cantidad: number;
}
