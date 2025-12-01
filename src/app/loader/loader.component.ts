// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-loader',
//   standalone: false,
//   templateUrl: './loader.component.html',
//   styleUrl: './loader.component.css'
// })
// export class LoaderComponent {

// }

import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-loader',
  standalone: false,
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.css']
})
export class LoaderComponent {
  @Input() isLoading: boolean = false;
}