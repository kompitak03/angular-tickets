import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject, Observable } from "rxjs";
import { map } from "rxjs/operators";

import { environment } from "../../../../environments/environment";
import { Router } from "@angular/router";

@Injectable({ providedIn: "root" })
export class DashboardService {
  constructor(private http: HttpClient) {}

  listData(type) {
    return this.http.get<any>(`${environment.apiUrl}tickets/list/${type}`).pipe(
      map(output => {
        if (output.success) {
          return output.data;
        } else {
          return [];
        }
      })
    );
  }

  addTicket(data) {
    return this.http.post<any>(`${environment.apiUrl}tickets/add`, data);
  }

  updateTicket(data, id) {
    return this.http.put<any>(
      `${environment.apiUrl}tickets/update/${id}`,
      data
    );
  }

  deleteTicket(data, id) {
    return this.http.put<any>(
      `${environment.apiUrl}tickets/delete/${id}`,
      data
    );
  }
}
