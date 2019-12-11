import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainComponent } from './containers/main/main.component';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { cMainComponent } from './components/main/main.component';
import { TabsModule } from 'ngx-bootstrap/tabs';

const profileRoutes: Routes = [
  { path: '', component: MainComponent }
];

@NgModule({
  declarations: [MainComponent, cMainComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(profileRoutes),
    SharedModule,
    TabsModule.forRoot()
  ]
})
export class ProfileModule { }
