import {Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {HttpService} from "../../services/http.service";
import {apiUrls} from "../../../environments/apis/api.urls";

@Component({
  selector: 'app-resume-detail',
  templateUrl: './resume-detail.component.html',
  styleUrls: ['./resume-detail.component.css']
})
export class ResumeDetailComponent implements OnInit {
  // @Input() resume;
  selectedName;
  resume;
  id= Math.floor((Math.random() * 59123127) + 1);
  Bio_edu;
  Institute_name;
  Marks_GPA;
  Degree;
  editEducation: any;
   selectedId;

  constructor(private route: ActivatedRoute,
              private httpService: HttpService
  ) {
  }

  ngOnInit(): void
  {
    // console.log('in ResumeDetailComponent');
    this.selectedName = this.route.snapshot.paramMap.get('name');
    this.selectedId = this.route.snapshot.paramMap.get('id');

    this.httpService.get(apiUrls.django).subscribe(data => {
      console.log(data)
      data.forEach(eachResume => {
        if (eachResume.name == this.selectedName) {
          this.resume = eachResume;
        }

      })
      console.log('resumeSelected', this.resume)

    });
  }

  submit(Degree: any, Institute_name: any, Marks_GPA: any) {
    this.editEducation = {
      'id': this.id,
      'Bio_edu': this.selectedName,
      'Degree': Degree,
      'Institute_name': Institute_name,
      'Marks_GPA': Marks_GPA
    }
    console.log('Data to Edit', this.editEducation)
    this.httpService.post(apiUrls.ResumeEducationEdit + this.selectedId + "/education", [{
      id: this.id,
      Bio_edu: this.selectedName,
      Degree: Degree,
      Institute_name: Institute_name,
      Marks_GPA: Marks_GPA
    }]).subscribe(data => {
      console.log('sucessful')

    }, error => {
      console.log(error)
    })
  }
}
