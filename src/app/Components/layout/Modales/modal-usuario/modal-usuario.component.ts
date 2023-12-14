import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
} from '@angular/material/dialog';

import { Component, Inject, OnInit, inject } from '@angular/core';
import { Rol } from 'src/app/Interfaces/rol';
import { Usuario } from 'src/app/Interfaces/usuario';
import { RolService } from 'src/app/Services/rol.service';
import { UsuarioService } from 'src/app/Services/usuario.service';
import { UtilidadService } from 'src/app/Reutilizable/utilidad.service';

@Component({
  selector: 'app-modal-usuario',
  templateUrl: './modal-usuario.component.html',
  styleUrls: ['./modal-usuario.component.css'],
})
export class ModalUsuarioComponent implements OnInit {
  formularioUsuario: FormGroup;
  ocultarPassword: boolean = true;
  tituloAccion: string = 'Agregar';
  botonAccion: string = 'Guardar';
  listaRoles: Rol[] = [];

  constructor(
    private modalActual: MatDialogRef<ModalUsuarioComponent>,
    @Inject(MAT_DIALOG_DATA) public datosUsuario: Usuario,
    private fb: FormBuilder,
    private _rolServicio: RolService,
    private _usuarioServicio: UsuarioService,
    private _utilidadServicio: UtilidadService
  ) {
    // Inicialización del formulario y configuración de validaciones
    this.formularioUsuario = this.fb.group({
      nombreCompleto: ['', Validators.required],
      correo: ['', Validators.required],
      idRol: ['', Validators.required],
      clave: ['', Validators.required],
      esActivo: ['1', Validators.required],
    });
    // Configuración inicial si se está editando un usuario existente
    if (this.datosUsuario != null) {
      this.tituloAccion = 'Editar';
      this.botonAccion = 'Actualizar';
    }
    // Obtener la lista de roles desde el servicio al iniciar el componente
    this._rolServicio.lista().subscribe({
      next: (data) => {
        if (data.status) this.listaRoles = data.value;
      },
      error: (e) => {},
    });
  }
  ngOnInit(): void {
    // Si se está editando, llenar el formulario con los datos existentes
    if (this.datosUsuario != null) {
      this.formularioUsuario.patchValue({
        nombreCompleto: this.datosUsuario.nombreCompleto,
        correo: this.datosUsuario.correo,
        idRol: this.datosUsuario.idRol,
        clave: this.datosUsuario.clave,
        esActivo: this.datosUsuario.esActivo.toString(),
      });
    }
  }

  guardarEditar_Usuario() {
    // Crear un objeto Usuario con los datos del formulario
    const _usuario: Usuario = {
      idUsuario: this.datosUsuario == null ? 0 : this.datosUsuario.idUsuario,
      nombreCompleto: this.formularioUsuario.value.nombreCompleto,
      correo: this.formularioUsuario.value.correo,
      idRol: this.formularioUsuario.value.idRol,
      rolDescripcion: '',
      clave: this.formularioUsuario.value.clave,
      esActivo: parseInt(this.formularioUsuario.value.esActivo),
    };
    //guardar o editar según el contexto
    if (this.datosUsuario == null) {
      this._usuarioServicio.guardar(_usuario).subscribe({
        next: (data) => {
          if (data.status) {
            this._utilidadServicio.mostrarAlerta(
              'El usuario fue registrado',
              'Exito'
            );
            this.modalActual.close('true');
          } else
            this._utilidadServicio.mostrarAlerta(
              'No se pudo registrar el usuario',
              'Error'
            );
        },
        error: (e) => {},
      });
    } else {
      // Editar un usuario existente
      this._usuarioServicio.editar(_usuario).subscribe({
        next: (data) => {
          if (data.status) {
            this._utilidadServicio.mostrarAlerta(
              'El usuario fue editado correctamente',
              'Exito'
            );
            this.modalActual.close('true');
          } else
            this._utilidadServicio.mostrarAlerta(
              'El usuario no se puede editar',
              'Error'
            );
        },
        error: (e) => {},
      });
    }
  }
}
