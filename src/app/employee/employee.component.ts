import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Gender } from '../core/models/Gender';
import { ApiService } from '../core/service/api.service';
import { MaritalStatus } from '../core/models/MaritalStatus';
import Swal from 'sweetalert2'
import { Employee } from '../core/models/Employee';
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
  columnsEmployed: string[]= ['name', 'lastname', 'dpi', 'total', 'edit', 'del'];
  jobPositionList: any[] = [];
  btnEdit: boolean = false;
  employeeId : number = 0;
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

  createFormGroup(data?: Employee) {
    return this.fb.group({
      name: [data?.name || "", [Validators.required]],
      lastname: [data?.lastname || "", [Validators.required]],
      genderId: [data?.genderId ||  1,[Validators.required]],
      maritalStatusId: [data?.maritalStatusId || 1 ,[Validators.required]],
      birthdayDate: [data?.birthdayDate || new Date(),[Validators.required]],
      age: [data?.age ||  0,[Validators.required]],
      dpi: [data?.dpi ||  0,[Validators.required]],
      nit: [data?.nit || 0],
      socialSecurity: [data?.socialSecurity || 0],
      irtra: [data?.irtra ||  0],
      passport: [data?.passport ||  0,[Validators.required]],
      address: [data?.address ||  "",[Validators.required]],
      jobPositonID: [data?.jobPositonID ||  0,[Validators.required]],
      salary: [data?.salary || 0,[Validators.required]],
      bonus: [data?.bonus ||  0,[Validators.required]],
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
        this.showAlert("Empleado registrado correctamente!!!");
        this.cleanForm();
        
      }, (error: HttpErrorResponse) => {
        (error.status === 404) 
          console.log("error")
      });

    }else{
      this.employeeForm.markAllAsTouched();
    }
  }

  editEmployee(){
    if(this.employeeForm.valid){
      const employee = this.employeeForm.value;
      this.api.put(`employee/${this.employeeId}`, employee).subscribe((res: any) => {
        this.getEmployes();
        this.showAlert("Empleado actualizado correctamente!!!");
        this.cleanForm();
        
      }, (error: HttpErrorResponse) => {
        (error.status === 404) 
          console.log("error")
      });

    }else{
      this.employeeForm.markAllAsTouched();
    }
  }

  employeeDelete(employeeID : number){
    
      this.api.delete(`employee/${employeeID}`).subscribe((res: any) => {
        this.getEmployes();
        this.showAlert("Empleado eliminado correctamente!!!");
      }, (error: HttpErrorResponse) => {
        (error.status === 404) 
          console.log("error")
      });
  }

  confirmDeleteEmployee(employeeID : number){
    Swal.fire({
      title: "Esta seguro?",
      text: "Una vez eliminado, ¡no podrá recuperar a este empleado!",
      icon: 'warning',
      showConfirmButton: true,
      showCancelButton: true     
    })
    .then((willDelete) => {

        if(willDelete.value){
          this.employeeDelete(employeeID);
        }
    });
  }


  employeeSelected(employee: Employee){
    this.employeeId = employee.id;
    this.employeeForm = this.createFormGroup(employee);
    this.btnEdit = true;
  }

  showAlert(msg : string){
    Swal.fire({
      text: msg,
     icon: 'success',
     confirmButtonText: 'Ok'
   })
  }

  cleanForm(){
    this.employeeForm.reset();
    this.employeeId = 0;
  }
}
