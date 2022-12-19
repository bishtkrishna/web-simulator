import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminComponent } from './components/admin/admin.component';
import { CompareComponent } from './components/compare/compare.component';
import { HomeComponent } from './components/home/home.component';
import { MainComponent } from './components/main/main.component';
import { NewScenarioComponent } from './components/new-scenario/new-scenario.component';
import { ScenarioComponent } from './components/scenario/scenario.component';
import { SimulatorComponent } from './components/simulator/simulator.component';
import { TestComponent } from './components/test/test.component';
import { TopNavigationComponent } from './components/top-navigation/top-navigation.component';
import { WelcomeComponent } from './components/welcome/welcome.component';
// import { AuthGuard } from './helpers/auth.guard';

const routes: Routes = [
  { 
    path: 'login', 
    component: WelcomeComponent,
    // canActivate:[AuthGuard]
  },
  { 
    path: 'register', 
    component: WelcomeComponent, 
  },
  { 
    path: 'new_scenario', 
    component: NewScenarioComponent,
    // canActivate:[AuthGuard] 
  },
  { 
    path: 'scenario', 
    component: ScenarioComponent,
    // canActivate:[AuthGuard] 
  },
  { 
    path: 'input_constraint', 
    component: MainComponent,
    // canActivate:[AuthGuard] 
  },
  { 
    path: 'simulator', 
    component: SimulatorComponent,
    // canActivate:[AuthGuard] 
  },
  {
  path: 'compare', 
  component: CompareComponent,
  // canActivate:[AuthGuard] 
},
{
  path: 'test', 
  component: TestComponent,
  // canActivate:[AuthGuard] 
},
{
  path: 'top_nav', 
  component: TopNavigationComponent,
  // canActivate:[AuthGuard] 
},
{
  path: 'admin',
  component: AdminComponent
},
{ path: '', component: WelcomeComponent },
{ path: '**', component: WelcomeComponent }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
