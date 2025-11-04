import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Layout } from './pages/layout/layout';
import { Dashboard } from './pages/dashboard/dashboard';
import { Register } from './register/register';
import { CourseDetailComponent } from './pages/course/course-detail/course-detail';
export const routes: Routes = [
    {
        path:'',
        redirectTo:'login',
        pathMatch:'full'
    },
    {
        path:'login',
        component:Login
    },
    { 
        path: 'register', 
        component: Register },
    {
        path:'',
        component:Layout,
        children:[
        {
            path: 'dashboard',   
            component: Dashboard
        }
        ]

    },

    {
    path: 'course/:id',
    component: CourseDetailComponent
    }


];
