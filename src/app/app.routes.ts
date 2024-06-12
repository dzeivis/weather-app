import { Routes } from '@angular/router';
import { WeatherComponent } from './components/weather/weather.component';
import { CitiesComponent } from './components/cities/cities.component';

export const routes: Routes = [
  {
    path: '',
    component: WeatherComponent
  },
  {
    path: 'cities/:city',
    component: CitiesComponent,
  }
];
