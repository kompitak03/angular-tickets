import { Component, OnInit, TemplateRef, OnDestroy } from "@angular/core";
import { BsModalService, BsModalRef } from "ngx-bootstrap/modal";
import { AuthenticationService } from "../../auth/auth.service";
import { Subscription } from "rxjs";

@Component({
  selector: "shared-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.css"]
})
export class HeaderComponent implements OnInit, OnDestroy {
  faCoffee = "faCoffee";
  signType = "none";
  modalRef: BsModalRef;
  currentUserSub: Subscription;
  currentUser;
  constructor(
    private modalService: BsModalService,
    private authService: AuthenticationService
  ) {
    this.currentUserSub = this.authService.currentUser.subscribe(
      (currentUser: any) => {
        this.currentUser = currentUser;
      }
    );
  }

  openModal(template: TemplateRef<any>, type) {
    if (type === "signin") {
      this.signType = type;
    } else if (type === "signup") {
      this.signType = type;
    } else {
      this.signType = "none";
    }
    this.modalRef = this.modalService.show(template);
  }

  ngOnInit() {}

  ngOnDestroy() {
    this.currentUserSub.unsubscribe();
  }

  signOut() {
    this.authService.logout();
  }
}
