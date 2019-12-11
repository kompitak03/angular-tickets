import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainComponent } from './containers/main/main.component';
import { RouterModule, Routes } from '@angular/router';
import { TableComponent } from './components/table/table.component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { ModalModule } from 'ngx-bootstrap/modal';

import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';

const contactsRoutes: Routes = [
  { path: '', component: MainComponent }
];


@NgModule({
  declarations: [MainComponent, TableComponent],
  imports: [
    CommonModule,
    SharedModule,
    NgxDatatableModule,
    BsDatepickerModule.forRoot(),
    CollapseModule.forRoot(),
    ReactiveFormsModule,
    FormsModule,
    RouterModule.forChild(contactsRoutes),
    ModalModule.forRoot()
  ]
})
export class ContactsModule { }
