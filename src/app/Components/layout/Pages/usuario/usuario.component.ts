import { Component, AfterViewInit, ViewChild, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
//import Swal from 'sweetalert2';
import { Usuario } from 'src/app/Interfaces/usuario';
import { UsuarioService } from 'src/app/Services/usuario.service';
import { UtilidadService } from 'src/app/Reutilizable/utilidad.service';
@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.css'],
})
export class UsuarioComponent implements OnInit, AfterViewInit {
  columnasTabla: string[] = [
    'nombreCompleto',
    'correo',
    'rolDescripcion',
    'estado',
    'acciones',
  ];
  dataInicio: Usuario[] = [];
  dataListaUsuario = new MatTableDataSource(this.dataInicio);
  @ViewChild(MatPaginator) paginacionTabla!: MatPaginator;

  constructor(
    private dialog: MatDialog,
    private _usuarioServicio: UsuarioService,
    private _utilidadServicio: UtilidadService
  ) {}

  obtenerUsuarios(){


    this._usuarioServicio.lista().subscribe({
      next: (data) => {
        if (data.status)
        this.dataListaUsuario.data=data.value;
      else
      this._utilidadServicio.mostrarAlerta("No se encontraron datos" ,"Oops!")
      },
      error: (e) => {},
    });
  }
  }


  ngAfterViewInit(): void {
    throw new Error('Method not implemented.');
  }

  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }
}
