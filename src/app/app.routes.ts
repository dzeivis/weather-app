import { Routes } from '@angular/router';
import { WeatherComponent } from './components/weather/weather.component';
import { MapComponent } from './components/map/map.component';
import { CitiesComponent } from './components/cities/cities.component';

export const routes: Routes = [
    {
        path: '',
        component: WeatherComponent
    },
    {
        path: 'cities',
        component: CitiesComponent
    },
    {
        path: 'map',
        component: MapComponent
    },
];
