import { bootstrapApplication } from '@angular/platform-browser';
import { TodosComponent } from './app/todos/todos.component';
import { provideHttpClient } from '@angular/common/http';

bootstrapApplication(TodosComponent, {
  providers: [provideHttpClient()]
}).catch(err => console.error(err));