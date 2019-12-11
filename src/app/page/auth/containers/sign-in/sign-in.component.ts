import { Component, OnInit } from "@angular/core";
import { AuthenticationService } from "src/app/shared/auth/auth.service";
import { Router } from "@angular/router";
import { JwtHelperService } from "@auth0/angular-jwt";

const helper = new JwtHelperService();

@Component({
  selector: "app-sign-in",
  templateUrl: "./sign-in.component.html",
  styleUrls: ["./sign-in.component.css"]
})
export class SignInComponent implements OnInit {
  constructor(
    private authService: AuthenticationService,
    private router: Router
  ) {
    if (this.authService.currentUserValue) {
      const isExpired = helper.isTokenExpired(
        this.authService.currentUserValue.token
      );
      if (!isExpired) {
        this.router.navigate(["dashboard"]);
      } else {
        this.authService.logout();
      }
    }
  }

  ngOnInit() {}
}
