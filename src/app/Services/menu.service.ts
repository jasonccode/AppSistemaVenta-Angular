import { ResponseApi } from './../Interfaces/response-api';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class MenuService {
  private urlApi: string = environment.endpoint + 'Menu/';

  constructor(private http: HttpClient) {}

  lista(idUsuario: number): Observable<ResponseApi> {
    return this.http.get<ResponseApi>(
      `${this.urlApi}Lista?idUsuario=${idUsuario}`
    );
  }
}
