// import { MaterializeAction } from 'angular2-materialize';
// import { Component, EventEmitter } from '@angular/core';
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';

  // modalActions = new EventEmitter<string | MaterializeAction>();
  // openModal() {
  //   this.modalActions.emit({ action: 'modal', params: ['open'] });
  // }
  // closeModal() {
  //   this.modalActions.emit({ action: 'modal', params: ['close'] });
  // }

}
