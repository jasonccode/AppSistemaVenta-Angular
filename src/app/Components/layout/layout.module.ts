import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/Reutilizable/shared/shared.module';

import { LayoutRoutingModule } from './layout-routing.module';
import { DashBoardComponent } from './Pages/dash-board/dash-board.component';
import { UsuarioComponent } from './Pages/usuario/usuario.component';
import { ProductoComponent } from './Pages/producto/producto.component';
import { VentaComponent } from './Pages/venta/venta.component';
import { HistorialVentaComponent } from './Pages/historial-venta/historial-venta.component';
import { ReporteComponent } from './Pages/reporte/reporte.component';
import { ModalUsuarioComponent } from './Modales/modal-usuario/modal-usuario.component';
import { ModalProductoComponent } from './Modales/modal-producto/modal-producto.component';
import { MatSortModule } from '@angular/material/sort';
import { ModalDetalleVentaComponent } from './Modales/modal-detalle-venta/modal-detalle-venta.component';

@NgModule({
  declarations: [
    DashBoardComponent,
    UsuarioComponent,
    ProductoComponent,
    VentaComponent,
    HistorialVentaComponent,
    ReporteComponent,
    ModalUsuarioComponent,
    ModalProductoComponent,
    ModalDetalleVentaComponent,
  ],
  imports: [CommonModule, LayoutRoutingModule, SharedModule,MatSortModule],
})
export class LayoutModule {}
