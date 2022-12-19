import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { HighchartsChartModule } from 'highcharts-angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { SimulatorComponent } from './components/simulator/simulator.component';
import { MainComponent } from './components/main/main.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { NewScenarioComponent } from './components/new-scenario/new-scenario.component';
import { ScenarioComponent } from './components/scenario/scenario.component';
import { WelcomeComponent } from './components/welcome/welcome.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {MatInputModule} from '@angular/material/input';
import {MatIconModule} from '@angular/material/icon';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import {FormsModule, ReactiveFormsModule } from '@angular/forms';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {MatButtonModule} from '@angular/material/button';
import {MatTableModule} from '@angular/material/table';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatDialogModule} from '@angular/material/dialog';
import { OpenDialogComponent } from './components/open-dialog/open-dialog.component';
import {MatMenuModule} from '@angular/material/menu';
import { AlertBoxComponent } from './components/alert-box/alert-box.component';
import { CompareComponent } from './components/compare/compare.component';
import { TopNavigationComponent } from './components/top-navigation/top-navigation.component';
import {MatRadioModule} from '@angular/material/radio';
import { LoaderComponent } from './components/loader/loader.component';
import { LoaderInterceptor } from './interceptors/loader.interceptor';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { LoaderService } from './services/loader.service';
import { ToastrModule } from 'ngx-toastr';
import { TestComponent } from './components/test/test.component';
import { AdminComponent } from './components/admin/admin.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { ModalPopupComponent } from './components/modal-popup/modal-popup.component';
import { NgChartsModule } from 'ng2-charts';
import { CompareDialogComponent } from './components/compare/compare-dialog/compare-dialog.component';
import { GrowthDialogComponent } from './components/simulator/growth-dialog/growth-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    SimulatorComponent,
    MainComponent,
    SidebarComponent,
    NewScenarioComponent,
    ScenarioComponent,
    WelcomeComponent,
    OpenDialogComponent,
    AlertBoxComponent,
    CompareComponent,
    TopNavigationComponent,
    LoaderComponent,
    TestComponent,
    AdminComponent,
    ModalPopupComponent,
    CompareDialogComponent,
    GrowthDialogComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    NgbModule,
    HttpClientModule,
    MatInputModule,
    MatIconModule,
    MatSelectModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonToggleModule,
    MatButtonModule,
    MatTableModule,
    MatCheckboxModule,
    MatSlideToggleModule,
    MatDialogModule,
    HighchartsChartModule,
    MatMenuModule,
    MatRadioModule,
    MatProgressSpinnerModule,
    ToastrModule.forRoot(),
    MatPaginatorModule,
    MatSortModule,
    NgChartsModule
    
  ],
  providers: [ LoaderService,
    { provide: HTTP_INTERCEPTORS, useClass: LoaderInterceptor, multi: true },],
  bootstrap: [AppComponent],
  entryComponents:[OpenDialogComponent, AlertBoxComponent],
})
export class AppModule { 
  
}
