import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import Swal from 'sweetalert2';
import { Producto } from 'src/app/Interfaces/producto';
import { DetalleVenta } from '../../../../Interfaces/detalle-venta';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductoService } from 'src/app/Services/producto.service';
import { VentaService } from 'src/app/Services/venta.service';
import { UtilidadService } from 'src/app/Reutilizable/utilidad.service';
import { Venta } from 'src/app/Interfaces/venta';

@Component({
  selector: 'app-venta',
  templateUrl: './venta.component.html',
  styleUrls: ['./venta.component.css'],
})
export class VentaComponent implements OnInit {
  listaProductos: Producto[] = [];
  listaProductosFiltro: Producto[] = [];
  listaProductosParaVenta: DetalleVenta[] = [];
  bloquearBotonRegistrar: boolean = false;
  productoSeleccionado!: Producto;
  tipodePagoPorDefecto: string = 'Efectivo';
  totalPagar: number = 0;
  formularioProductoVenta: FormGroup;
  columnaTabla: string[] = [
    'producto',
    'cantidad',
    'precio',
    'total',
    'accion',
  ];
  datosDetalleVenta = new MatTableDataSource(this.listaProductosParaVenta);

  //Metodo para realizar la busqueda por el nombre del producto
  retornarProductosPorFiltro(busqueda: any): Producto[] {
    const valorBuscado =
      typeof busqueda === 'string'
        ? busqueda.toLocaleLowerCase()
        : busqueda.nombre.toLocaleLowerCase();
    return this.listaProductos.filter((item) =>
      item.nombre.toLocaleLowerCase().includes(valorBuscado)
    );
  }
  constructor(
    private fb: FormBuilder,
    private _productoServicio: ProductoService,
    private _ventasServicio: VentaService,
    private _utilidadServicio: UtilidadService
  ) {
    this.formularioProductoVenta = this.fb.group({
      producto: ['', Validators.required],
      cantidad: ['', Validators.required,],
    });

    this._productoServicio.lista().subscribe({
      next: (data) => {
        if (data.status) {
          const lista = data.value as Producto[];
          this.listaProductos = lista.filter(
            (p) => p.esActivo == 1 && p.stock > 0
          );
        }
      },
      error: (e) => {},
    });

    this.formularioProductoVenta
      .get('producto')
      ?.valueChanges.subscribe((value) => {
        this.listaProductosFiltro = this.retornarProductosPorFiltro(value);
      });
  }

  ngOnInit(): void {
  }

  mostrarProducto(producto: Producto): string {
    return producto.nombre;
  }

  productoParaVenta(event: any) {
    this.productoSeleccionado = event.option.value;
  }

  //Registrar el producto elegido dentro de nuestra tabla para realizar la venta
  agregarProductoParaVenta() {
    const _cantidad: number = this.formularioProductoVenta.value.cantidad;
    const _precio: number = parseFloat(this.productoSeleccionado.precio);
    const _total: number = _cantidad * _precio;
    this.totalPagar = this.totalPagar + _total;

    this.listaProductosParaVenta.push({
      idProducto: this.productoSeleccionado.idProducto,
      descripcionProducto: this.productoSeleccionado.nombre,
      cantidad: _cantidad,
      precioTexto: String(_precio.toFixed(2)),
      totalTexto: String(_total.toFixed(2)),
    });

    this.datosDetalleVenta = new MatTableDataSource(
      this.listaProductosParaVenta
    );
    this.formularioProductoVenta.patchValue({
      producto: '',
      cantidad: '',
    });
  }

  //Eliminar un producto de la listaProductos para vender
  eliminarProducto(detalle: DetalleVenta) {
    (this.totalPagar = this.totalPagar - parseFloat(detalle.totalTexto)),
      (this.listaProductosParaVenta = this.listaProductosParaVenta.filter(
        (p) => p.idProducto != detalle.idProducto
      ));
    this.datosDetalleVenta = new MatTableDataSource(
      this.listaProductosParaVenta
    );
  }

  registrarVenta() {
    if (this.listaProductosParaVenta.length > 0) {
      this.bloquearBotonRegistrar = true;
      const ventaTotal = this.totalPagar; // Almacena el valor actual de totalPagar


      const request: Venta = {
        tipoPago: this.tipodePagoPorDefecto,
        totalTexto: String(this.totalPagar.toFixed(0)),
        detalleVenta: this.listaProductosParaVenta,
      }

      this._ventasServicio.registrar(request).subscribe({
        next: (response) => {
          if (response.status) {
            this.listaProductosParaVenta = [];
            this.datosDetalleVenta = new MatTableDataSource(
              this.listaProductosParaVenta
            )
            Swal.fire({
              icon: 'success',
              title: 'Venta Registrada!',
              text: `Numero de venta: ${response.value.numeroDocumento}\n Valor de la venta: $${ventaTotal.toFixed(0)}`,
            })
          } else
            this._utilidadServicio.mostrarAlerta(
              'No se pudo registrar la venta',
              'Opps'
            );
        },
        complete: () => {
          this.totalPagar = 0.00; // Reinicia totalPagar después de mostrar el mensaje
          this.bloquearBotonRegistrar = false;
        },
        error: (e) => {},
      });
    }
  }
}
