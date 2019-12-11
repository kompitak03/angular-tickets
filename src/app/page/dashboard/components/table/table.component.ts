import {
  Component,
  OnInit,
  Input,
  OnChanges,
  Output,
  EventEmitter
} from "@angular/core";

import { Observable } from "rxjs";
import { map } from "rxjs/operators";

import * as moment from "moment";
import { AuthenticationService } from "src/app/shared/auth/auth.service";

@Component({
  selector: "dashboard-table",
  templateUrl: "./table.component.html",
  styleUrls: ["./table.component.css"]
})
export class TableComponent implements OnInit, OnChanges {
  items: Observable<any[]>;

  @Input() allTickets = [];

  @Output() getContentById = new EventEmitter<string>();
  @Output() delById = new EventEmitter<string>();

  rows = [];
  defaultRow = [];

  columns = [
    { prop: "status", name: "Status" },
    { prop: "ticketid", name: "Ticket id" },
    { prop: "date", name: "Create date (m/d/y)" },
    { prop: "provider", name: "Provider" }
  ];

  constructor() {}

  ngOnInit() {}

  ngOnChanges(changes) {
    if (changes.allTickets) {
      this.rows = [];
      this.defaultRow = [];
      changes.allTickets.currentValue.forEach((element: any) => {
        let data = element;
        this.rows.push(data);
      });
      this.rows = [...this.rows];
      this.defaultRow = [...this.rows];
    }
  }

  getById(id: string) {
    this.rows.forEach(e => {
      if (id === e.id) {
        this.getContentById.emit(e);
      }
    });
  }

  onDelete(id: string) {
    this.rows.forEach(e => {
      if (id === e.id) {
        this.delById.emit(e.ticketid);
      }
    });
  }
}
