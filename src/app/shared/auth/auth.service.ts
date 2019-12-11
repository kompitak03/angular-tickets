import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject, Observable } from "rxjs";
import { map } from "rxjs/operators";

import { environment } from "../../../environments/environment";
import { User } from "./auth.model";
import { Router } from "@angular/router";

import { JwtHelperService } from "@auth0/angular-jwt";

const helper = new JwtHelperService();

@Injectable({ providedIn: "root" })
export class AuthenticationService {
  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;

  constructor(private http: HttpClient, private router: Router) {
    this.currentUserSubject = new BehaviorSubject<User>(
      helper.decodeToken(localStorage.getItem("token"))
    );
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue() {
    return this.currentUserSubject.value;
  }

  login(email: string, password: string) {
    return this.http
      .post<any>(`${environment.apiUrl}user/login`, { email, password })
      .pipe(
        map(user => {
          if (user.success) {
            // store user details and jwt token in local storage to keep user logged in between page refreshes
            localStorage.setItem("token", user.token);
            this.currentUserSubject.next(user.userData);
            return { success: true };
          } else {
            return { success: false, err: user.err };
          }
        })
      );
  }

  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem("currentUser");
    this.currentUserSubject.next(null);
    this.router.navigate(["user"]);
  }

  refreshToken(data) {
    return this.http.post(`${environment.apiUrl}token/refresh`, data);
  }
}
