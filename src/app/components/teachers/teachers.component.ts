import { Component, OnInit } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";
import { AngularFireStorage } from "@angular/fire/storage";
import { FormControl } from "@angular/forms";
import { debounceTime, switchMap } from "rxjs/operators";
import { AlertService } from "src/app/shared/helpers/alert/alert.service";
import { ModalService } from "src/app/shared/helpers/modal/modal.service";
import { AuthService } from "src/app/shared/services/auth.service";
import { FirebaseService } from "src/app/shared/services/firestore.service";

@Component({
  selector: "app-teachers",
  templateUrl: "./teachers.component.html",
  styleUrls: ["./teachers.component.css"],
})
export class TeachersComponent implements OnInit {
  public teachers: any;
  private fullTeachers: any;
  public loading: boolean = true;
  public teacherInfo: any;
  public schoolInfo: any;
  public teacherSelected: any = null;
  teacherFilter = new FormControl();

  constructor(
    private firebaseService: FirebaseService,
    public authService: AuthService,
    public afs: AngularFirestore,
    public alertService: AlertService,
    public modalService: ModalService,
    private storage: AngularFireStorage
  ) {}
  ngOnInit() {
    this.getSchoolByUser();

    this.teacherFilter.valueChanges
      .pipe(debounceTime(500))
      .subscribe((value) => {
        if (value == "") {
          this.getSchoolByUser();
        } else {
          this.teachers = this.teachers.filter(
            (teacher) =>
              teacher.firstname.includes(value) ||
              teacher.lastname.includes(value)
          );
        }
      });
  }

  async getSchoolByUser() {
    this.teacherInfo = await this.firebaseService.getTeacherInfoByUser();
    const schoolId = this.teacherInfo?.schoolId;

    if (schoolId) {
      this.teachers = await this.firebaseService
        .getTeachersBySchool(schoolId)
        .then((teachers) => {
          this.loading = false;
          return teachers;
        });
      this.fullTeachers = Object.assign({}, this.teachers);
    } else {
      this.loading = false;
    }
  }

  async deleteTeacher(userId: string) {
    const userInfo: any = await this.authService?.GetUserInfo();
    if (this.teacherInfo.title !== "head") {
      this.alertService.error("You not have permission to delete teachers", {
        autoClose: true,
      });
    } else if (userInfo.uid === this.teacherInfo.userId) {
      this.alertService.error("You can not delete yourself", {
        autoClose: true,
      });
    } else {
      this.firebaseService.deleteTeacher(userId).then(() => {
        this.alertService.success("User deleted successfully", {
          autoClose: true,
        });
        this.loading = true;
        this.getSchoolByUser();
      });
    }
  }

  async openModal(id: string, teacher: any) {
    this.modalService.open(id);
    this.teacherSelected = {
      ...teacher,
      photo: await this.getTeacherImg(teacher),
    };
  }

  async getTeacherImg(teacherSelected: any) {
    const ref = this.storage.ref(`teachers/${teacherSelected.userId}`);
    return ref.getDownloadURL();
  }

  closeModal(id: string) {
    this.modalService.close(id);
    this.teacherSelected = null;
  }
}
