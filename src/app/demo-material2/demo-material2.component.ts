import { MaterializeAction } from 'angular2-materialize';
import { Component, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-demo-material2',
  templateUrl: './demo-material2.component.html',
  styles: []
})
export class DemoMaterial2Component {

  constructor() { }

  modalActions = new EventEmitter<string | MaterializeAction>();
  openModal() {
    this.modalActions.emit({ action: 'modal', params: ['open'] });
  }
  closeModal() {
    this.modalActions.emit({ action: 'modal', params: ['close'] });
  }

}
