import { Component, HostListener } from "@angular/core";
import { Subject } from "rxjs";
import { JwtHelperService } from "@auth0/angular-jwt";

import * as moment from "moment";
import { AuthenticationService } from "./shared/auth/auth.service";
const helper = new JwtHelperService();

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent {
  userActivity;
  currentUser;
  userInactive: Subject<any> = new Subject();
  expirationDate = moment(
    helper.getTokenExpirationDate(localStorage.getItem("token"))
  );
  now = moment(new Date());
  constructor(private authService: AuthenticationService) {
    this.currentUser = this.authService.currentUserValue;
    this.setTimeout();
  }

  setTimeout() {
    this.userActivity = setTimeout(() => {
      this.userInactive.next(undefined);
    }, 6000);
  }

  @HostListener("window:mousemove") refreshUserState() {
    clearTimeout(this.userActivity);
    if (this.now.diff(this.expirationDate, "minutes") < 5) {
      this.authService.refreshToken({ email: this.currentUser.email });
    }
    this.setTimeout();
  }
}
