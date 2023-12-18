import { Component, AfterViewInit, ViewChild, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import * as moment from 'moment';
import { VentaService } from 'src/app/Services/venta.service';
import { UtilidadService } from 'src/app/Reutilizable/utilidad.service';
import * as XLSX from 'xlsx';
import { Reporte } from 'src/app/Interfaces/reporte';

export const MY_DATA_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMMM YYYY',
  },
};
@Component({
  selector: 'app-reporte',
  templateUrl: './reporte.component.html',
  styleUrls: ['./reporte.component.css'],
  providers: [{ provide: MAT_DATE_FORMATS, useValue: MY_DATA_FORMATS }],
})
export class ReporteComponent implements AfterViewInit, OnInit {
  formularioFiltro: FormGroup;
  listaVentaReporte: Reporte[] = [];
  columnasTabla: string[] = [
    'fechaRegistro',
    'numeroDocumento',
    'tipoPago',
    'total',
    'producto',
    'cantidad',
    'precio',
    'totalProducto',
  ];
  dataVentaReporte = new MatTableDataSource(this.listaVentaReporte);
  @ViewChild(MatPaginator) paginacionTabla!: MatPaginator;

  constructor(
    private fb: FormBuilder,
    private _ventaServicio: VentaService,
    private _utilidadServicio: UtilidadService
  ) {
    this.formularioFiltro = this.fb.group({
      fechaInicio: ['', Validators.required],
      fechaFin: ['', Validators.required],
    });
  }

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.dataVentaReporte.paginator = this.paginacionTabla;
  }

  buscarVentas() {
    const _fechaInicio = moment(this.formularioFiltro.value.fechaInicio).format(
      'DD/MM/YYYY'
    );
    const _fechaFin = moment(this.formularioFiltro.value.fechaFin).format(
      'DD/MM/YYYY'
    );

    if (_fechaInicio === 'Invalid date' || _fechaFin === 'Invalid date') {
      this._utilidadServicio.mostrarAlerta(
        'Debe ingresar ambas fechas',
        'Oops!'
      );
      return;
    }

    this._ventaServicio.reporte(_fechaInicio, _fechaFin).subscribe({
      next: (data) => {
        if (data.status) {
          this.listaVentaReporte = data.value;
          this.dataVentaReporte.data = data.value;
        } else {
          this.listaVentaReporte = [];
          this.dataVentaReporte.data = [];
          this._utilidadServicio.mostrarAlerta(
            'No se encontraron datos',
            'Oops!'
          );
        }
      },
      error: (e) => {},
    });
  }

  exportarExcel() {
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(this.listaVentaReporte);

    XLSX.utils.book_append_sheet(wb, ws, 'Reporte');
    XLSX.writeFile(wb, 'Reporte Ventas.xlsx');
  }
}
