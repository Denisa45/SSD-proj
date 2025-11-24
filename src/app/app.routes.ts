import { Routes } from '@angular/router';

import { PlannerComponent } from './pages/planner/planner.component';
import { Login } from './pages/login/login';
import { LayoutComponent } from './pages/layout/layout';
import { Dashboard } from './pages/dashboard/dashboard';
import { Register } from './register/register';
import { CoursesComponent } from './pages/course/courses/courses.component';
import { StudyTimerComponent } from './pages/timer/timer.component';
import { SettingsComponent } from './pages/settings/settings.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  { path: 'login', component: Login },
  { path: 'register', component: Register },

  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: 'dashboard', component: Dashboard },
      { path: 'courses', component: CoursesComponent },
      { path: 'planner', component: PlannerComponent },
      { path: 'timer', component: StudyTimerComponent },
      { path: 'settings', component: SettingsComponent },

      {
        path: 'courses/:id',
        loadComponent: () =>
          import('./pages/course/course-detail/course-detail.component')
            .then(m => m.CourseDetailComponent)
      },

      {
        path: 'event/:id',
        loadComponent: () =>
         import('./pages/event-detail/event-detail.component').then(m => m.EventDetailComponent)
}
    ]
  }
];
