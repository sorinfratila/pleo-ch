import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OverviewComponent } from './pages/overview/overview.component';

const routes: Routes = [
  { path: 'overview', component: OverviewComponent },
  { path: '**', redirectTo: '/overview' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
