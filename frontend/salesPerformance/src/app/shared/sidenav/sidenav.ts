import { Component } from '@angular/core';
import { MaterialModule } from '../material-module/material-module';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.html',
  styleUrls: ['./sidenav.scss'],
  imports: [MaterialModule, RouterModule, CommonModule]
})
export class Sidenav {
  sectionsByRole: { [role: string]: { label: string, link: string }[] } = {
    admin: [
      { label: 'Upload Data', link: '/home/admin/upload' },
      { label: 'ASC', link: '/home/admin/asc' },
      { label: 'Distributor', link: '/home/admin/distributor' },
      { label: 'Promoter', link: '/home/admin/promoter' },
      { label: 'Control Log', link: '/home/admin/control-log' }  // ✅ updated
    ],
    user: [
      { label: 'Dashboard', link: '/home/user/dashboard' },
      { label: 'Leaderboard', link: '/home/user/leaderboard' },
      { label: 'User Profile', link: '/home/user/profile' }
    ]
  };

  sectionsToShow: { label: string, link: string }[] = [];

  constructor(private router: Router) {}

  ngOnInit() {
    if (typeof sessionStorage !== 'undefined') {
      const role = sessionStorage.getItem('sp_role');
      if (role === 'Admin') {
        this.sectionsToShow = this.sectionsByRole['admin'];
      } else {
        this.sectionsToShow = this.sectionsByRole['user'];
      }
    }
  }

  selectedLabel: string | null = null;

  navigateWithRole(section: { label: string, link: string }) {
    this.selectedLabel = section.label;

    const labelToRoleMap: { [label: string]: string } = {
      'Upload Data': 'admin',
      'ASC': 'asc',
      'Distributor': 'distributor',
      'Promoter': 'promoter',
      'Control Log': 'control-log'   // ✅ updated
    };

    const TempRole = labelToRoleMap[section.label] || 'user';

    // Keep the real role as-is, fallback to Admin if not set
    const currentRole = sessionStorage.getItem('sp_role');
    if (!currentRole) {
      sessionStorage.setItem('sp_role', 'Admin');
    }

    // Set selected temp role
    sessionStorage.setItem('temp_role', TempRole);

    // Navigate to the route
    this.router.navigate([section.link]);
  }
}