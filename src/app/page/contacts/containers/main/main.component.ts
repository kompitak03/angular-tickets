import { Component, OnInit, TemplateRef, ViewChild } from "@angular/core";
import {
  BsModalService,
  BsModalRef,
  ModalDirective
} from "ngx-bootstrap/modal";

import {
  FormGroup,
  FormControl,
  FormBuilder,
  Validators
} from "@angular/forms";
import { ContractsService } from "../../services/contracts.service";
import { AuthenticationService } from "src/app/shared/auth/auth.service";
import { User } from "src/app/shared/auth/auth.model";

@Component({
  selector: "app-main",
  templateUrl: "./main.component.html",
  styleUrls: ["./main.component.css"]
})
export class MainComponent implements OnInit {
  actionStatus = "none";

  delId = "";

  isCollapsed = true;

  selections = [
    {
      name: "contract No."
    },
    {
      name: "type"
    },
    {
      name: "sub type"
    },
    {
      name: "circuit ID"
    },
    {
      name: "provider"
    },
    {
      name: "start date"
    },
    {
      name: "exp date"
    }
  ];

  searchSelect = "";

  txtSearch = "";

  allData = [];

  fromDate = new Date();
  toDate = new Date();

  searchContracts: any = {
    scontractno: "",
    sType: "",
    subtype: "",
    circuitId: "",
    provider: "",
    startContract: "",
    expireContract: ""
  };

  addContracts: any = {};

  currentUser: User;

  get type(): any {
    return this.addContracts.get("type");
  }

  @ViewChild("contractModal", { static: true }) private modalContract;
  @ViewChild("confirmDelete", { static: true }) private modalConfirmDelete;

  contracts;
  modalRef: BsModalRef;
  filter;

  updateById = "";

  constructor(
    private modalService: BsModalService,
    private fb: FormBuilder,
    private contractService: ContractsService,
    private authService: AuthenticationService
  ) {
    this.setFormAddContracts();
    this.currentUser = this.authService.currentUserValue;
    this.fetchData();
  }

  ngOnInit() {}

  fetchData() {
    this.contractService.listDataActive().subscribe(output => {
      this.allData = [...output];
    });
  }

  onSelectContract(content) {
    this.openModal(this.modalContract);
    this.actionStatus = "update";
    this.updateById = content.id;
    this.addContracts.patchValue({
      contractno: content.contractno,
      type: content.type,
      subtype: content.subtype,
      circuitid: content.circuitid,
      circuitname: content.circuitname,
      provider: content.provider,
      description: content.description,
      start: new Date(content.start),
      end: new Date(content.end)
    });
  }

  setFormAddContracts() {
    this.addContracts = this.fb.group({
      contractno: ["", Validators.required],
      type: ["", Validators.required],
      subtype: [""],
      circuitid: ["", Validators.required],
      circuitname: ["", Validators.required],
      provider: ["", Validators.required],
      description: ["", Validators.required],
      start: [new Date(), Validators.required],
      end: [new Date(), Validators.required]
    });
  }

  openModal(template: TemplateRef<any>) {
    this.updateById = "";
    this.actionStatus = "add";
    this.setFormAddContracts();
    this.modalRef = this.modalService.show(
      template,
      Object.assign(
        {},
        {
          class: "modal-lg",
          backdrop: true,
          ignoreBackdropClick: true,
          keyboard: false
        }
      )
    );
  }

  addContract() {
    if (this.addContracts.valid) {
      let input = this.addContracts.getRawValue();
      let bfSend = {
        contractno: input.contractno,
        type: input.type,
        subtype: input.subtype,
        circuitid: input.circuitid,
        circuitname: input.circuitname,
        provider: input.provider,
        description: input.description,
        start: input.start,
        end: input.end,
        user: this.currentUser.name
      };

      if (bfSend.type === "sp") {
        bfSend.subtype = "";
      }

      this.contractService
        .addContract(bfSend)
        .toPromise()
        .then(res => {
          this.fetchData();
        });

      this.modalRef.hide();
      this.setFormAddContracts();
    } else {
      console.error("Please fill full it");
    }
  }

  updateContract() {
    if (this.addContracts.valid) {
      let input = this.addContracts.getRawValue();
      let bfSend = {
        contractno: input.contractno,
        type: input.type,
        subtype: input.subtype,
        circuitid: input.circuitid,
        circuitname: input.circuitname,
        provider: input.provider,
        description: input.description,
        start: input.start,
        end: input.end,
        user: this.currentUser.name
      };

      if (bfSend.type === "sp") {
        bfSend.subtype = "";
      }

      this.contractService
        .updateContract(bfSend, this.updateById)
        .toPromise()
        .then(res => {
          this.fetchData();
        });

      this.modalRef.hide();
      this.setFormAddContracts();
    } else {
      console.error("Please fill full it");
    }
  }

  onDeleteContract(event) {
    this.delId = event;
    this.openModal(this.modalConfirmDelete);
  }

  delConfirm() {
    let id = this.delId;
    this.contractService
      .deleteContract({ user: this.currentUser.name }, id)
      .toPromise()
      .then(res => {
        this.fetchData();
      });
    this.modalRef.hide();
  }

  updateFilter(event) {
    let val = event.target.value;
    console.log(val);
    let fromDate = this.fromDate;
    let toDate = this.toDate;

    if (this.searchSelect == "start date" || this.searchSelect == "exp date") {
      val = "";
    }

    this.filter = {
      val: val,
      type: this.searchSelect,
      fromDate: fromDate,
      toDate: toDate
    };
  }

  onSearchContract() {}
}
