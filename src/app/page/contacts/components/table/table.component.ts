import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  Input,
  OnChanges
} from "@angular/core";
import { Observable } from "rxjs";

import * as moment from "moment";
import { ContractsService } from "../../services/contracts.service";

@Component({
  selector: "contacts-table",
  templateUrl: "./table.component.html",
  styleUrls: ["./table.component.css"]
})
export class TableComponent implements OnInit, OnChanges {
  rows = [];
  defaultRow = [];
  mainContract;
  typeOfFilter = "none";

  @Input() filter;
  @Input() allData;
  @Output() getContentById = new EventEmitter<string>();
  @Output() delById = new EventEmitter<string>();

  columns = [
    { name: "Contract No.", prop: "contractno" },
    { name: "Type", prop: "type" },
    { name: "Sub Type", prop: "subtype" },
    { name: "CircuitID", prop: "circuitid" },
    { name: "Provider", prop: "provider" }
  ];

  constructor() {}

  ngOnInit() {}

  ngOnChanges(changes) {
    if (changes.filter) {
      this.onFilter(changes.filter.currentValue);
      if (
        changes.filter.type == "start date" ||
        changes.filter.type == "exp date"
      ) {
        console.log(changes.filter);
      }
    }
    if (changes.allData) {
      this.rows = [];
      this.defaultRow = [];
      changes.allData.currentValue.forEach((element: any) => {
        let data;
        data = element;
        data.id = element.id;
        data.startDate = moment(data.start).format("DD-MMM-YYYY");
        data.endDate = moment(data.end).format("DD-MMM-YYYY");
        data.start = data.start;
        data.end = data.end;
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
    this.delById.emit(id);
  }

  onFilter(filter) {
    if (filter && filter.val != "") {
      const temp = this.rows.filter(function(d) {
        switch (filter.type) {
          case "contract No.":
            return (
              d.contractno.toLowerCase().indexOf(filter.val) !== -1 ||
              !filter.val
            );
            break;
          case "type":
            return (
              d.type.toLowerCase().indexOf(filter.val) !== -1 || !filter.val
            );
            break;
          case "sub type":
            return (
              d.subtype.toLowerCase().indexOf(filter.val) !== -1 || !filter.val
            );
            break;
          case "circuit ID":
            return (
              d.circuitid.toLowerCase().indexOf(filter.val) !== -1 ||
              !filter.val
            );
            break;
          case "provider":
            return (
              d.provider.toLowerCase().indexOf(filter.val) !== -1 || !filter.val
            );
            break;
        }
      });
      // // update the rows
      this.rows = temp;
    } else {
      this.rows = this.defaultRow;
    }
  }
}
