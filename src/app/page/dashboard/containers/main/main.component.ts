import { Component, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { BsModalService, BsModalRef } from "ngx-bootstrap/modal";

import { FormBuilder, FormGroup, FormArray, Validators } from "@angular/forms";

import * as moment from "moment";
import { Subject, of } from "rxjs";
import { take, distinct } from "rxjs/operators";
import { ContractsService } from "src/app/page/contacts/services/contracts.service";
import { AuthenticationService } from "src/app/shared/auth/auth.service";
import { DashboardService } from "../../services/dashboard.service";
import { User } from "src/app/shared/auth/auth.model";

@Component({
  selector: "app-main",
  templateUrl: "./main.component.html",
  styleUrls: ["./main.component.css"]
})
export class MainComponent implements OnInit {
  private ticketsDoc;
  currentUser: User;

  allTickets = [];

  ticketId = "";

  addTicketsForm: FormGroup;
  modalRef: BsModalRef;
  circuitItems: {
    id: string;
  }[] = [];

  mainContracts: any;
  providers = [];
  contractNo = [];
  contracts = [];
  DB;
  actionStatus = "none";

  updateById = "";
  delId = "";

  @ViewChild("addTicket", { static: true }) private modalTicket;
  @ViewChild("confirmDelete", { static: true }) private modalConfirmDelete;

  get circuitArrays() {
    return this.addTicketsForm.get("circuitArray") as FormArray;
  }

  constructor(
    private modalService: BsModalService,
    private _formBuilder: FormBuilder,
    private contractService: ContractsService,
    private authService: AuthenticationService,
    private dashboardService: DashboardService
  ) {
    this.currentUser = this.authService.currentUserValue;

    this.contractService.listDataActive().subscribe(output => {
      if (output.length) {
        let data = output;
        this.contracts = output;
        let arr = [];
        data.forEach(element => {
          if (arr.indexOf(element.provider) == -1) arr.push(element.provider);
        });
        this.providers = arr;
      } else {
        this.providers = [];
      }
    });

    this.fetchData();

    this.setFormTickets();
  }

  ngOnInit() {}

  closeModal() {
    this.modalRef.hide();
    this.setFormTickets();
  }

  setFormTickets() {
    this.actionStatus = "none";

    this.addTicketsForm = this._formBuilder.group({
      status: ["On process"],
      provider: ["", Validators.required],
      contractno: ["", Validators.required],
      circuitArray: this._formBuilder.array([
        this._formBuilder.group({
          circuitId: ""
        })
      ]),
      problem: [""],
      cause: [""],
      effect: [""],
      repairing: [""],
      problemDate: [new Date()],
      problemTime: [moment(new Date()).format("HH:mm")],
      fixedDate: [new Date()],
      fixedTime: [moment(new Date()).format("HH:mm")],
      remark: [""]
    });
  }

  addCircuit() {
    const circuit = this._formBuilder.group({
      circuitId: ["", Validators.required]
    });

    this.circuitArrays.push(circuit);
  }

  delCircuit(i) {
    this.circuitArrays.removeAt(i);
  }

  onChangeProvider(provider) {
    this.contractNo = [];
    this.circuitItems = [];
    let contractno = [];
    let circuit = [];
    this.contracts.forEach(element => {
      if (provider == element.provider) {
        if (contractno.indexOf(element.contractno) == -1)
          contractno.push(element.contractno);
        circuit.push({
          id: element.circuitid,
          name: element.circuitname
        });
      }
    });
    this.contractNo = contractno;
    this.circuitItems = circuit;
  }

  onChangeContractNo(event) {
    let data = event;
    console.log(data);
  }

  fetchData() {
    this.dashboardService.listData("all").subscribe(res => {
      this.allTickets = res;
    });
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(
      template,
      Object.assign(
        {},
        { class: "modal-lg" },
        { ignoreBackdropClick: true, backdrop: true, keyboard: false }
      )
    );
  }

  onSelectContract(content) {
    this.openModal(this.modalTicket);
    this.actionStatus = "update";
    this.updateById = content.id;
    this.ticketId = content.ticketid;
    this.onChangeProvider(content.provider);
    this.addTicketsForm.patchValue({
      status: content.status,
      provider: content.provider,
      contractno: content.contractNo,
      problem: content.problem,
      cause: content.cause,
      effect: content.effect,
      repairing: content.repairing,
      problemDate: new Date(content.problemDate),
      problemTime: content.problemTime,
      fixedDate: new Date(content.fixedDate),
      fixedTime: content.fixedTime,
      remark: content.description
    });
    let subStr = content.circuitId.split(",");
    let arrCircuit = this._formBuilder.array([]);
    for (let index = 0; index < subStr.length; index++) {
      const element = subStr[index];
      if (element != "") {
        if (index == 0) {
          let arr = this.addTicketsForm.controls["circuitArray"] as FormArray;
          arr.at(0).patchValue({
            circuitId: element
          });
          this.circuitArrays[0] = this._formBuilder.group(element);
        } else {
          this.circuitArrays.push(
            this._formBuilder.group({ circuitId: element })
          );
          arrCircuit.push(this._formBuilder.group({ circuitId: element }));
        }
      }
    }
  }

  addTickets() {
    let addTicketsForm = this.addTicketsForm.getRawValue();

    let problemDate = moment(addTicketsForm.problemDate).format("MM/DD/YYYY");
    let problemTime = moment(
      new Date("1/1/2019 " + addTicketsForm.problemTime)
    ).format("HH:mm");
    let fixedDate = moment(addTicketsForm.fixedDate).format("MM/DD/YYYY");
    let fixedTime = moment(
      new Date("1/1/2019 " + addTicketsForm.problemTime)
    ).format("HH:mm");

    let circuitArray = addTicketsForm.circuitArray;
    let circuit = "";
    circuitArray.forEach(res => {
      circuit += res.circuitId + ",";
    });

    let data = {
      status: addTicketsForm.status,
      date: problemDate,
      problemDate: problemDate,
      problemTime: problemTime,
      fixedDate: fixedDate,
      fixedTime: fixedTime,
      cause: addTicketsForm.cause,
      contractno: addTicketsForm.contractno,
      effect: addTicketsForm.effect,
      problem: addTicketsForm.problem,
      provider: addTicketsForm.provider,
      repairing: addTicketsForm.repairing,
      circuitId: circuit,
      remark: addTicketsForm.remark,
      user: this.currentUser.name
    };
    console.log(data);
    this.dashboardService
      .addTicket(data)
      .toPromise()
      .then(res => {
        if (res.success) {
          this.modalRef.hide();
          this.fetchData();
        }
      });
  }

  updateTicket(event) {
    if (this.addTicketsForm.valid) {
      let addTicketsForm = this.addTicketsForm.getRawValue();
      let problemDate = moment(addTicketsForm.problemDate).format("MM/DD/YYYY");
      let problemTime = moment(
        new Date("1/1/2019 " + addTicketsForm.problemTime)
      ).format("HH:mm");
      let fixedDate = moment(addTicketsForm.fixedDate).format("MM/DD/YYYY");
      let fixedTime = moment(
        new Date("1/1/2019 " + addTicketsForm.fixedTime)
      ).format("HH:mm");

      let circuitArray = addTicketsForm.circuitArray;
      let circuit = "";
      circuitArray.forEach(res => {
        circuit += res.circuitId + ",";
      });

      let data = {
        status: event,
        date: problemDate,
        problemDate: problemDate,
        problemTime: problemTime,
        fixedDate: fixedDate,
        fixedTime: fixedTime,
        cause: addTicketsForm.cause,
        contractNo: addTicketsForm.contractno,
        effect: addTicketsForm.effect,
        problem: addTicketsForm.problem,
        provider: addTicketsForm.provider,
        repairing: addTicketsForm.repairing,
        circuitId: circuit,
        remark: addTicketsForm.remark,
        user: this.currentUser.name
      };

      this.dashboardService
        .updateTicket(data, this.ticketId)
        .toPromise()
        .then(res => {
          if (res.success) {
            this.modalRef.hide();
            this.addTicketsForm.reset();
            this.setFormTickets();
            this.fetchData();
          }
        });
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
    this.dashboardService
      .deleteTicket({ user: this.currentUser.name }, id)
      .toPromise()
      .then(res => {
        if (res.success) {
          this.modalRef.hide();
        }
      });
  }

  autoIncrement(i) {
    if (i < 10) {
      return "00" + i;
    } else if (i < 100) {
      return "0" + i;
    } else {
      return i;
    }
  }

  onComplete() {
    if (this.addTicketsForm.valid) {
      let addTicketsForm = this.addTicketsForm.getRawValue();
      let problemDate = moment(addTicketsForm.problemDate).format("MM/DD/YYYY");
      let problemTime = moment(
        new Date("1/1/2019 " + addTicketsForm.problemTime)
      ).format("HH:mm");
      let fixedDate = moment(addTicketsForm.fixedDate).format("MM/DD/YYYY");
      let fixedTime = moment(
        new Date("1/1/2019 " + addTicketsForm.fixedTime)
      ).format("HH:mm");

      let circuitArray = addTicketsForm.circuitArray;
      let circuit = "";
      circuitArray.forEach(res => {
        circuit += res.circuitId + ",";
      });

      let data = {
        status: event,
        date: problemDate,
        problemDate: problemDate,
        problemTime: problemTime,
        fixedDate: fixedDate,
        fixedTime: fixedTime,
        cause: addTicketsForm.cause,
        contractNo: addTicketsForm.contractno,
        effect: addTicketsForm.effect,
        problem: addTicketsForm.problem,
        provider: addTicketsForm.provider,
        repairing: addTicketsForm.repairing,
        circuitId: circuit,
        remark: addTicketsForm.remark,
        user: this.currentUser.name
      };

      this.dashboardService
        .updateTicket(data, this.ticketId)
        .toPromise()
        .then(res => {
          if (res.success) {
            this.modalRef.hide();
            this.addTicketsForm.reset();
            this.setFormTickets();
            this.fetchData();
          }
        });
    } else {
      console.error("Please fill full it");
    }
  }
}
