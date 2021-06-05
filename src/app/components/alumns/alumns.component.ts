import { Component, OnInit } from "@angular/core";
import { AngularFireStorage } from "@angular/fire/storage";
import { FormControl } from "@angular/forms";
import { Router } from "@angular/router";
import { debounceTime } from "rxjs/operators";
import { ModalService } from "src/app/shared/helpers/modal/modal.service";
import { FirebaseService } from "src/app/shared/services/firestore.service";

@Component({
  selector: "app-alumns",
  templateUrl: "./alumns.component.html",
  styleUrls: ["./alumns.component.css"],
})
export class AlumnsComponent implements OnInit {
  public alumns: any = null;
  public loading: boolean = true;
  public alumnSelected: any = null;
  alumnFilter = new FormControl();

  constructor(
    private firebaseService: FirebaseService,
    public modalService: ModalService,
    private storage: AngularFireStorage,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getAlumnsBySchool();

    this.alumnFilter.valueChanges.pipe(debounceTime(500)).subscribe((value) => {
      if (value == "") {
        this.getAlumnsBySchool();
      } else {
        this.alumns = this.alumns.filter(
          (alumn) =>
            alumn.name.includes(value) ||
            alumn.parent[0].includes(value) ||
            alumn.parent[1].includes(value)
        );
      }
    });
  }

  async getAlumnsBySchool() {
    const teacherInfo: any = await this.firebaseService.getTeacherInfoByUser();
    const schoolId = teacherInfo?.schoolId;

    if (schoolId) {
      this.alumns = await this.firebaseService
        .getAlumnsBySchool(schoolId)
        .then((alumns) => {
          debugger;
          this.loading = false;
          return alumns;
        });
    } else {
      this.loading = false;
    }
  }

  async getAlumnImg(alumnId: any) {
    const ref = this.storage.ref(`alumns/${alumnId}`);
    return ref.getDownloadURL();
  }

  async openModal(id: string, alumn: any) {
    this.modalService.open(id);
    this.alumnSelected = {
      ...alumn,
      photo: await this.getAlumnImg(alumn.userId),
    };
  }

  goToRoutes(alumn: any, component: string) {
    this.router.navigate([`alumns/${alumn.userId}/${component}`]);
  }
}
