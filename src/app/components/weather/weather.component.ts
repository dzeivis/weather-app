import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterLink, RouterModule, RouterOutlet } from '@angular/router';
import { switchMap } from 'rxjs';
import {
  faEye,
  faEyeSlash,
  faSpinner,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-weather',
  standalone: true,
  imports: [RouterOutlet, HttpClientModule, RouterLink, RouterModule, FontAwesomeModule],
  templateUrl: './weather.component.html',
  styleUrl: './weather.component.css'
})
export class WeatherComponent {
  faEye = faEye;
  faEyeSlash = faEyeSlash;
  faSpinner = faSpinner;
  isLoading = false;

  city: any;
  temperature: any;
  weather: any;
  
  realFeel: any;
  wind: any;
  rain: any;
  uvIndex: any;

  todaysForecast: any = [];
  sevenDaysForecast: any = [];

  constructor(private http: HttpClient, private router: Router, private activeRoute: ActivatedRoute) {}

  ngOnInit() {
    this.isLoading = true;
    this.http.get<any>('https://geocoding-api.open-meteo.com/v1/search?name=Vilnius').pipe(
      switchMap((data) => {
        this.city = data.results[0].timezone;
        return this.http.get<any>('https://api.open-meteo.com/v1/forecast?latitude='+data.results[0].latitude+'&longitude='+data.results[0].longitude+'&current=temperature_2m,precipitation,apparent_temperature,rain,weather_code,wind_speed_10m&hourly=weather_code,temperature_2m,precipitation&daily=weather_code,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,uv_index_max&timezone=auto');
      })
    ).subscribe(
      (data) => {
        this.getTodaysForecast(data.hourly);
        this.getSevenDaysForecast(data.daily);
        this.weather = this.getWeatherByCode(data.current.weather_code);
        this.temperature = data.current.temperature_2m + data.current_units.temperature_2m;
        this.wind = data.current.wind_speed_10m + data.current_units.wind_speed_10m;
        this.uvIndex = data.daily.uv_index_max[0];
        this.rain = data.current.rain + data.current_units.rain;
        this.realFeel = data.current.apparent_temperature + data.current_units.apparent_temperature;
        this.isLoading = false;
      },
      (error) => {
        console.error(error);
      }
    );
  }

  getWeatherByCode(code: number) {
    if(code >= 0 && code <= 2) {
      return 'sunny';
    } else if(code >= 3 && code <= 57) {
      return 'cloudy';
    } else {
      return 'rainy';
    }
  }

  getTodaysForecast(hourly: any) {
    const times = [6, 9, 12, 15, 18, 21];
    times.forEach((time, index) => {
      let period = 'AM';
      if (time >= 12) {
        period = 'PM';
      }
  
      let hour = time % 12;
      hour = hour === 0 ? 12 : hour;
  
      this.todaysForecast[index] = {
        index: index,
        time: `${hour} ${period}`,
        temperature: hourly.temperature_2m[time] + '°C',
        weather: this.getWeatherByCode(hourly.weather_code[time])
      };
    });
  }
  getSevenDaysForecast(daily: any) {
    daily.time.forEach((time: any, index: any) => {
      this.sevenDaysForecast[index] = {
        index: index,
        day: this.getDayName(daily.time[index]),
        time: daily.time[index],
        maxTemp: daily.temperature_2m_max[index],
        minTemp: daily.temperature_2m_min[index],
        weather: this.getWeatherByCode(daily.weather_code[index])
      }
    })
  }

  getDayName(dateString: string): string {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const date = new Date(dateString);
    const dayIndex = date.getDay(); // Get the day index (0-6)
    return days[dayIndex]; // Return the day name
  }
}
