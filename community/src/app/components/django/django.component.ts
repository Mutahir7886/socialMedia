import { Component, OnInit } from '@angular/core';
import {apiUrls} from "../../../environments/apis/api.urls";
import {HttpService} from "../../services/http.service";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-django',
  templateUrl: './django.component.html',
  styleUrls: ['./django.component.css']
})
export class DjangoComponent implements OnInit {
  resumeArray:any=[]
  selectedResume: any;
   id= Math.floor((Math.random() * 59123127) + 1);
   // Institute_name;
   // Marks_GPA;Degree;
   editEducation: any;
   selectedId;
   selectedName;
   educationForm: FormGroup;
   educationFormArray:FormArray;
   editEducationObject:any;
   allData;
   index=1



  constructor(private httpService: HttpService,
              private modalService: NgbModal,
              private formBuilder: FormBuilder) {
    this.educationFormArray = this.formBuilder.array([]);
  }

  ngOnInit(): void {
    this.educationForm = this.formBuilder.group({
      Institute_name: ['', Validators.required],
      // options: this.formBuilder.array([]),
      Degree: ['', Validators.required],
      Marks_GPA: ['', Validators.required]
    });
    this.httpService.get(apiUrls.django).subscribe(data => {
      this.allData=data;
      this.resumeArray=data.map(a=>{
        return {name:a.name , id:a.id}
      })
      console.log(this.resumeArray)
    });

  }



  get Degree(): FormControl {
    return this.educationForm.get('Degree') as FormControl;
  }
  get Institute_name(): FormControl {
    return this.educationForm.get('Institute_name') as FormControl;
  }
  get Marks_GPA(): FormControl {
    return this.educationForm.get('Marks_GPA') as FormControl;
  }
  submit(Degree: any, Institute_name: any, Marks_GPA: any) {
    console.log(Degree)
    console.log(Institute_name)
    console.log(Marks_GPA)



    this.httpService.post(apiUrls.ResumeEducationEdit + this.selectedId + "/education", [{
      id: this.id,
      Bio_edu: this.selectedName,
      Degree: Degree,
      Institute_name: Institute_name,
      Marks_GPA: Marks_GPA
    }]).subscribe(data => {
      console.log('sucessful')
      this.Degree.setValue('')
      this.Institute_name.setValue('')
      this.Degree.setValue('');
      this.modalService.dismissAll()

    }, error => {
      console.log(error)
    })
  }

  addEducationModal(addEducation:any,resumeId,resumeName) {
    this.selectedId=resumeId;
    this.selectedName=resumeName
    console.log('id',this.selectedId)
    console.log('Name',this.selectedName)
    this.modalService.open(addEducation, {ariaLabelledBy: 'modal-basic-title'}).result
      .then((result) => {

      })
      .catch((error) => {
        console.log(error);
      });
  }

  editEducationForm(editEducation,resumeId,resumeName) {

    this.editEducationObject= this.allData.filter(object=>{
      return object.name ===resumeName;
    })
    // this.educationFormArray.push(this.educationForm)
    console.log(this.editEducationObject)

    this.editEducationObject[0].education.forEach(education=>{
        this.educationFormArray.push(this.formBuilder.group(
          { Institute_name:education.Institute_name ,Degree:education.Degree,Marks_GPA:education.Marks_GPA}
          ))
        // this.educationForm.setValue({Institute_name:education.Institute_name,Degree:education.Degree,Marks_GPA:education.Marks_GPA})
        // console.log('formgroupobject',this.educationForm)
        // this.educationFormArray.push(this.educationForm)
        // console.log('educationFormArray',this.educationFormArray)
    })
    console.log('complete form Group',this.educationFormArray)
    this.modalService.open(editEducation, {ariaLabelledBy: 'modal-basic-title'}).result
      .then((result) => {

      })
      .catch((error) => {
        console.log(error);
      });

  }

  closeEditEducation() {
    this.educationFormArray = this.formBuilder.array([]);
    this.modalService.dismissAll();
  }
}
