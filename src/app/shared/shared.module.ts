import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { RouterModule } from '@angular/router';

@NgModule({
    declarations: [HeaderComponent],
    imports: [
        CommonModule,
        RouterModule,
        BsDropdownModule.forRoot()
    ],
    exports: [HeaderComponent]
})
export class SharedModule { }
