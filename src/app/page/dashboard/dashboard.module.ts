import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { Routes, RouterModule } from "@angular/router";

import { BsDatepickerModule } from "ngx-bootstrap/datepicker";
import { TimepickerModule } from "ngx-bootstrap/timepicker";
import { MainComponent } from "./containers/main/main.component";
import { TableComponent } from "./components/table/table.component";

import { NgxDatatableModule } from "@swimlane/ngx-datatable";

import { ReactiveFormsModule } from "@angular/forms";

import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { SharedModule } from "src/app/shared/shared.module";
import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { JwtInterceptor } from "src/app/shared/auth/jwt.interceptor";

const routes: Routes = [
  {
    path: "",
    component: MainComponent
  }
];

@NgModule({
  declarations: [MainComponent, TableComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    RouterModule.forChild(routes),
    BsDatepickerModule.forRoot(),
    TimepickerModule.forRoot(),
    NgxDatatableModule,
    SharedModule
  ],
  exports: [RouterModule],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true }
  ]
})
export class DashboardModule {}
