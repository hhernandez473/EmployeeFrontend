import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Gender } from '../core/models/Gender';
import { ApiService } from '../core/service/api.service';
import { MaritalStatus } from '../core/models/MaritalStatus';
import Swal from 'sweetalert2'
@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.scss']
})
export class EmployeeComponent implements OnInit {

  employeeForm : FormGroup;
  genderList: Gender[] = [];
  maritalStatusList: MaritalStatus[] = [];
  EmployeeList: any [] = [];
  columnsEmployed: string[]= ['name', 'lastname', 'dpi', 'total'];
  jobPositionList: any[] = [];
  constructor(
    private api: ApiService,
    private fb: FormBuilder
  ) { 
    this.employeeForm = this.createFormGroup();
  }

  ngOnInit(): void {
    this.getEmployes();
    this.getGender();
    this.getMaritalStatus();
    this.getJobPosition();
  }

  createFormGroup() {
    return this.fb.group({
      name: ["", [Validators.required]],
      lastname: ["", [Validators.required]],
      genderId: [1,[Validators.required]],
      maritalStatusId: [1,[Validators.required]],
      birthdayDate: [new Date(),[Validators.required]],
      age: [0,[Validators.required]],
      dpi: [0,[Validators.required]],
      nit: [0],
      socialSecurity: [0],
      irtra: [0],
      passport: [0,[Validators.required]],
      address: ["",[Validators.required]],
      jobPositonID: [0,[Validators.required]],
      salary: [0,[Validators.required]],
      bonus: [0,[Validators.required]],
    });
  }

  public checkError = (controlName: string, errorName: string) => {
    return this.employeeForm.controls[controlName].hasError(errorName);
  }

  getEmployes() {
    this.api.get("employee").subscribe((res: any) => {
      this.EmployeeList = res;
    }, (error: HttpErrorResponse) => {
      (error.status === 404) 
        console.log("error")
    });
  }

  getGender(){
    this.api.get("gender").subscribe((res: any) => {
      this.genderList = res;
    }, (error: HttpErrorResponse) => {
      (error.status === 404) 
        console.log("error")
    });
  }

  getMaritalStatus(){
    this.api.get("maritalStatus").subscribe((res: any) => {
      this.maritalStatusList = res;
    }, (error: HttpErrorResponse) => {
      (error.status === 404) 
        console.log("error")
    });
  }

  getJobPosition(){
    this.api.get("departament").subscribe((res: any) => {
      this.jobPositionList = res;
    }, (error: HttpErrorResponse) => {
      (error.status === 404) 
        console.log("error")
    });
  }
  
  saveEmployee(){
    if(this.employeeForm.valid){
      const employee = this.employeeForm.value;
      this.api.post("employee", employee).subscribe((res: any) => {
        this.getEmployes();
        Swal.fire({
           text: 'Empleado registrado correctamente',
          icon: 'success',
          confirmButtonText: 'Ok'
        })
        this.employeeForm.reset();
        
      }, (error: HttpErrorResponse) => {
        (error.status === 404) 
          console.log("error")
      });

    }else{
      this.employeeForm.markAllAsTouched();
    }
  }
}
