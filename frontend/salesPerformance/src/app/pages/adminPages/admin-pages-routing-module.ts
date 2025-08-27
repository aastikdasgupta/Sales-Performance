import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AscUser } from './asc-user/asc-user';
import { ControlLog} from './control-log/control-log';
import { Distributor } from './distributor/distributor';
import { Promoter } from './promoter/promoter';
import { UploadData } from './upload-data/upload-data';

const routes: Routes = [
  {
    path:'asc',
    component:AscUser
  },
  {
    path:'log',
    component:ControlLog
  },
  {
    path:'distributor',
    component:Distributor
  },
  {
    path:'promoter',
    component: Promoter
  },
  {
    path: 'upload',
    component:UploadData
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminPagesRoutingModule { }
