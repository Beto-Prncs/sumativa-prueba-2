import { Routes } from '@angular/router';
import { CameraComponent } from './camera/camera.component';
import { ReportComponent } from './report/report.component';

export const routes: Routes = [
  { path: '', redirectTo: 'reports', pathMatch: 'full' },
  { path: 'camera', component: CameraComponent },
  { path: 'reports', component: ReportComponent },
];