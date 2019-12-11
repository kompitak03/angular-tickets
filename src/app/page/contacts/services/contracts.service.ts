import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject, Observable } from "rxjs";
import { map } from "rxjs/operators";

import { environment } from "../../../../environments/environment";
import { Router } from "@angular/router";

@Injectable({ providedIn: "root" })
export class ContractsService {
  constructor(private http: HttpClient) {}

  listDataActive() {
    return this.http
      .get<any>(`${environment.apiUrl}contracts/list/active`)
      .pipe(
        map(output => {
          if (output.success) {
            return output.data;
          } else {
            return [];
          }
        })
      );
  }

  addContract(data) {
    return this.http.post<any>(`${environment.apiUrl}contracts/add`, data);
  }

  updateContract(data, id) {
    return this.http.put<any>(
      `${environment.apiUrl}contracts/update/${id}`,
      data
    );
  }

  deleteContract(data, id) {
    return this.http.put<any>(
      `${environment.apiUrl}contracts/delete/${id}`,
      data
    );
  }
}
