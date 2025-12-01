import { Component } from '@angular/core';
import { LoadingService } from './loading.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.css'
})
export class AppComponent {
  isLoading$: Observable<boolean>;

  constructor(private loadingService: LoadingService) {
    this.isLoading$ = this.loadingService.isLoading$;
  }

  fetchData() {
    this.loadingService.show();
    
    // Simulate API call
    setTimeout(() => {
      this.loadingService.hide();
    }, 3000);
  }
  
  title = 'Portfolio';
}
