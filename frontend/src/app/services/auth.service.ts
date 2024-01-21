import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {environment} from "../../environments/environment";
import {HttpClient, HttpHeaders} from "@angular/common/http";

const TOKEN_KEY = 'auth-token';
const IS_ADMIN = 'is-admin';
const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json',
    'Authorization': 'Basic ' + btoa('username:password')
  })
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseURL = environment.API_BASE_URL;

  constructor(private http: HttpClient) {
  }

  login(username: string, password: string): Observable<any> {
    return this.http.post(this.baseURL + '/login', {
      username,
      password
    }, httpOptions);
  }

  public saveToken(token: string, admin: boolean): void {
    window.sessionStorage.removeItem(TOKEN_KEY);
    window.sessionStorage.setItem(TOKEN_KEY, token);
    if (admin) {
      window.sessionStorage.removeItem(IS_ADMIN);
      window.sessionStorage.setItem(IS_ADMIN, "true");
    }
  }

  public getToken(): string | null {
    return window.sessionStorage.getItem(TOKEN_KEY);
  }

  public isAdminFromToken(): boolean {
    let isAdmin = false;
    if (window.sessionStorage.getItem(IS_ADMIN) && window.sessionStorage.getItem(IS_ADMIN) == "true") {
      isAdmin = true;
    }
    return isAdmin;
  }

  signOut(): void {
    window.sessionStorage.clear();
  }
}
