import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { UserService } from '../../services/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { User } from '@app/models/user.model';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss', '../../user-management.styles.scss']
})
export class UserListComponent implements OnInit {
  displayedColumns = ['id', 'username', 'email', 'role', 'actions'];
  dataSource = new MatTableDataSource<User>();
  loading = true;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private userService: UserService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.userService.getAllUsers().subscribe({
      next: (response) => {
        if (response.success) {
          this.dataSource.data = response.data || [];
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        }
        this.loading = false;
      },
      error: () => {
        this.snackBar.open('Error loading users', 'Close', { duration: 3000 });
        this.loading = false;
      }
    });
  }

  deleteUser(id: number): void {
    if (confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
      this.userService.deleteUser(id).subscribe({
        next: (response) => {
          if (response.success) {
            this.snackBar.open('Usuario eliminado', 'Close', { duration: 3000 });
            this.loadUsers();
          }
        },
        error: () => {
          this.snackBar.open('Error al eliminar usuario', 'Close', { duration: 3000 });
        }
      });
    }
  }

  // Nuevos métodos requeridos por el template
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  getRoleColor(role: string): string {
    return role === 'admin' ? 'primary' : 'warn';
  }
}