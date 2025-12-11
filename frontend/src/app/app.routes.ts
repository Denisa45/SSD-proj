import { Routes } from '@angular/router';

import { PlannerComponent } from './pages/planner/planner.component';
import { Login } from './pages/login/login';
import { LayoutComponent } from './pages/layout/layout';
import { Dashboard } from './pages/dashboard/dashboard';
import { Register } from './register/register';
import { CoursesComponent } from './pages/course/courses/courses.component';
import { StudyTimerComponent } from './pages/timer/timer.component';
import { SettingsComponent } from './pages/settings/settings.component';

import { EventDetailComponent } from './pages/event-detail/event-detail.component';
import { ScheduleComponent } from './pages/schedule/schedule.component';

export const routes: Routes = [
  // 1. NON-SIDEBAR ROUTES (Login/Register)
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'register', component: Register },

  // 2. MAIN LAYOUT ROUTE: Renders the Sidebar and the <router-outlet>
  {
    path: '',
    component: LayoutComponent, // This renders the sidebar
    children: [
      // All these pages load INSIDE the sidebar layout

      { path: 'dashboard', component: Dashboard },
      { path: 'courses', component: CoursesComponent },
      { path: 'planner', component: PlannerComponent },
      { path: 'timer', component: StudyTimerComponent },
      { path: 'settings', component: SettingsComponent },

      // 👇 ADD THE SCHEDULE ROUTE HERE
      { path: 'schedule', component: ScheduleComponent, title: 'Class Schedule' },

      // 👇 ADD THE EVENT/NEW ROUTE HERE
      { path: 'event/new', component: EventDetailComponent, title: 'Add Event' }, 
      
      // 👇 KEEP THE PARAMETERIZED ROUTES HERE (courses/:id and event/:id)
      {
        path: 'courses/:id',
        loadComponent: () =>
          import('./pages/course/course-detail/course-detail.component')
            .then(m => m.CourseDetailComponent)
      },

      {
        // Using the component directly since it's already imported
        path: 'event/:id',
        component: EventDetailComponent,
        title: 'Edit Event' 
      }
    ]
  },
  
  // ❌ DELETE these top-level routes, they are now correctly placed above:
  /*
  { path: 'event/new', component: EventDetailComponent, title: 'Add Event' }, 
  { path: 'event/:id', component: EventDetailComponent, title: 'Edit Event' }, 
  { path: 'schedule', component: ScheduleComponent, title: 'Class Schedule' },
  */
];