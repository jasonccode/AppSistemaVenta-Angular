import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Login } from 'src/app/Interfaces/login';
import { UtilidadService } from 'src/app/Reutilizable/utilidad.service';
import { UsuarioService } from 'src/app/Services/usuario.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  // Formulario para recopilar información de inicio de sesión.
  formularioLogin: FormGroup;

  // Bandera para controlar la visibilidad de la contraseña.
  ocultarPassword: boolean = true;

  // Bandera para mostrar/ocultar el indicador de carga.
  mostrarLoading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private _usuarioServicio: UsuarioService,
    private _utilidadServicio: UtilidadService
  ) {
    this.formularioLogin = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  iniciarSesion() {
    // Mostrar el indicador de carga.
    this.mostrarLoading = true;

    // Crear una solicitud de inicio de sesión con los datos del formulario.
    const request: Login = {
      correo: this.formularioLogin.value.email,
      clave: this.formularioLogin.value.password,
    };

    // Invocar el servicio para iniciar sesión.
    this._usuarioServicio.iniciarSesion(request).subscribe({
      next: (data) => {
        // Verificar si la respuesta del servicio indica un inicio de sesión exitoso.
        if (data.status) {
          // Almacenar la sesión del usuario y redirigir a la página principal.
          this._utilidadServicio.guardarSesionUsuario(data.value);
          this.router.navigate(["pages"]);
        } else {
          // Mostrar alerta en caso de credenciales incorrectas.
          this._utilidadServicio.mostrarAlerta(
            'No se encontraron coincidencias ',
            'Opps!'
          );
        }
        // Manejar el evento de completado para ocultar el indicador de carga.
        complete: () => {
          this.mostrarLoading = false;
        };
        // Manejar errores y mostrar alerta en caso de un problema.
        error: () => {
          this._utilidadServicio.mostrarAlerta('Hubo un error', 'Opps!');
        };
      },
    });
  }
}
