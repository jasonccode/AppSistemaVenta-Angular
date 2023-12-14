import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Categoria } from 'src/app/Interfaces/categoria';
import { Producto } from 'src/app/Interfaces/producto';
import { UtilidadService } from 'src/app/Reutilizable/utilidad.service';
import { CategoriaService } from 'src/app/Services/categoria.service';
import { ProductoService } from 'src/app/Services/producto.service';

@Component({
  selector: 'app-modal-producto',
  templateUrl: './modal-producto.component.html',
  styleUrls: ['./modal-producto.component.css'],
})
export class ModalProductoComponent implements OnInit {
  formularioProducto: FormGroup;
  tituloAccion: string = 'Agregar';
  botonAccion: string = 'Guardar';
  listaCategorias: Categoria[] = [];

  constructor(
    private modalActual: MatDialogRef<ModalProductoComponent>,
    @Inject(MAT_DIALOG_DATA) public datosProducto: Producto,
    private fb: FormBuilder,
    private _categoriaServicio: CategoriaService,
    private _productosServicio: ProductoService,
    private _utilidadServicio: UtilidadService
  ) {
    this.formularioProducto = this.fb.group({
      nombre: ['', Validators.required],
      idCategoria: ['', Validators.required],
      stock: ['', Validators.required],
      precio: ['', Validators.required],
      esActivo: ['1', Validators.required],
    });
    //Agregando los campos a formulario producto
    if (this.datosProducto != null) {
      this.tituloAccion = 'Editar';
      this.botonAccion = 'Actualizar';
    }
    //Obtener lista de categorias
    this._categoriaServicio.lista().subscribe({
      next: (data) => {
        if (data.status) this.listaCategorias = data.value;
      },
      error: (e) => {},
    });
  }

  ngOnInit(): void {
    if (this.datosProducto != null) {
      this.formularioProducto.patchValue({
        nombre: this.datosProducto.nombre,
        idCaegoria: this.datosProducto.idCategoria,
        stock: this.datosProducto.stock,
        precio: this.datosProducto.precio,
        esActivo: this.datosProducto.esActivo.toString(),
      });
    }
  }

  guardarEditar_Producto() {
    // Creando el objeto
    const _producto: Producto = {
      idProducto:
        this.datosProducto == null ? 0 : this.datosProducto.idProducto,
      nombre: this.formularioProducto.value.nombre,
      idCategoria: this.formularioProducto.value.idCategoria,
      descripcionCategoria: '',
      precio: this.formularioProducto.value.precio,
      stock: this.formularioProducto.value.stock,
      esActivo: parseInt(this.formularioProducto.value.esActivo),
    };
    //guardar o editar según el contexto
    if (this.datosProducto == null) {
      this._productosServicio.guardar(_producto).subscribe({
        next: (data) => {
          if (data.status) {
            this._utilidadServicio.mostrarAlerta(
              'El producto fue registrado',
              'Exito'
            );
            this.modalActual.close('true');
          } else
            this._utilidadServicio.mostrarAlerta(
              'No se pudo registrar el producto',
              'Error'
            );
        },
        error: (e) => {},
      });
    } else {
      // Editar un producto existente
      this._productosServicio.editar(_producto).subscribe({
        next: (data) => {
          if (data.status) {
            this._utilidadServicio.mostrarAlerta(
              'El producto fue editado correctamente',
              'Exito'
            );
            this.modalActual.close('true');
          } else
            this._utilidadServicio.mostrarAlerta(
              'No se pudo editar el producto',
              'Error'
            );
        },
        error: (e) => {},
      });
    }
  }
}
