import {Component, EventEmitter, Output} from '@angular/core';
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {debounceTime, distinctUntilChanged, map, switchMap} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})
export class SearchComponent {
  @Output() searchChange = new EventEmitter<string>();
  @Output() searchResult = new EventEmitter<any>();

  searchQuery = new FormControl('');
  filteredCities: any[] = [];

  constructor(private http: HttpClient, private router: Router) {
    this.searchQuery.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(query => {
        if (query) {
          return this.http.get<any>(`https://geocoding-api.open-meteo.com/v1/search?name=${query}`);
        } else {
          return [];
        }
      })
    ).subscribe(
      data => {
        this.searchResult.emit(data.results || []);
        this.filteredCities = data.results;
      },
      error => {
        console.error('Error fetching geocoding data', error);
      }
    );
  }

  selectCity(city: any) {
    this.filteredCities = [];
    this.searchQuery.setValue('');
    this.router.navigate(['/cities', city.name]);
  }
}
