import { NgModule, Component } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LayoutsComponent } from './layouts.component';
import { AuthGuard } from 'src/app/core/helpers';
import { RoleGuard } from '../core/helpers/role.guard';

const routes: Routes = [
  { path: 'layouts',
    component: LayoutsComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: '/layouts/dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadChildren: () =>
        import('../features/dashboard/dashboard.module').then(
            (m) => m.DashboardModule
        ),
      },
      { path: 'user',
        canActivate: [RoleGuard], 
        loadChildren: () =>
        import('../features/user/user.module').then(
            (m) => m.UserModule
        ),
      },
      { path: 'eLearning',
        canActivate: [RoleGuard], 
        loadChildren: () =>
        import('../features/e-learning/e-learning.module').then(
            (m) => m.ELearningModule
        ),
      },
      { path: 'questionnaries', 
        canActivate: [RoleGuard],
        loadChildren: () =>
        import('../features/questionnaries/questionnaries.module').then(
            (m) => m.QuestionnariesModule
        ),
      },
      { 
        path: 'broadcast',
        canActivate: [RoleGuard], 
        loadChildren: () =>
        import('../features/broadcast/broadcast.module').then(
            (m) => m.BroadcastModule
        ),
      },
      { 
        path: 'task',
        canActivate: [RoleGuard], 
        loadChildren: () =>
        import('../features/task/task.module').then(
            (m) => m.TaskModule
        ),
      },
      { 
        path: 'reports', 
        loadChildren: () =>
        import('../features/reports/reports.module').then(
            (m) => m.ReportsModule
        ),
      },
      { 
        path: 'update-status',
        canActivate: [RoleGuard], 
        loadChildren: () =>
        import('../features/update-status/update-status.module').then(
            (m) => m.UpdateStatusModule
        ),
      },
      { 
        path: 'category',
        canActivate: [RoleGuard], 
        loadChildren: () =>
        import('../features/category/category.module').then(
            (m) => m.CategoryModule
        ),
      },
      { 
        path: 'uploads',
        canActivate: [RoleGuard], 
        loadChildren: () =>
        import('../features/upload-section/upload-section.module').then(
            (m) => m.UploadSectionModule
        ),
      },
      { 
        path: 'settings', 
        loadChildren: () =>
        import('../features/settings/settings.module').then(
            (m) => m.SettingsModule
        ),
      },
      { 
        path: 'manage-users', 
        loadChildren: () =>
        import('../features/manage-users/manage-users.module').then(
            (m) => m.ManageUsersModule
        ),
      },
      { 
        path: 'notifications', 
        loadChildren: () =>
        import('../features/notifications/notifications.module').then(
            (m) => m.NotificationsModule
        ),
      },
    ] 
  }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LayoutsRoutingModule { }
