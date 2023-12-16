import { MAT_DIALOG_DATA } from '@angular/material/dialog';

import { Component, Inject } from '@angular/core';
import { DetalleVenta } from '../../../../Interfaces/detalle-venta';
import { Venta } from 'src/app/Interfaces/venta';


@Component({
  selector: 'app-modal-detalle-venta',
  templateUrl: './modal-detalle-venta.component.html',
  styleUrls: ['./modal-detalle-venta.component.css'],
})
export class ModalDetalleVentaComponent {
  fechaRegistro: string = '';
  numeroDocumento: string = '';
  tipoPago: string = '';
  total: string = '';
  DetalleVenta: DetalleVenta[] = [];
  columnasTabla: string[] = ['producto', 'cantidad', 'precio', 'total'];

  constructor(@Inject(MAT_DIALOG_DATA) public _venta: Venta) {
    this.fechaRegistro = _venta.fechaRegistro!;
    this.numeroDocumento = _venta.numeroDocumento!;
    this.tipoPago = _venta.tipoPago;
    this.total = _venta.totalTexto;
    this.DetalleVenta = _venta.detalleVenta;
  }
}
