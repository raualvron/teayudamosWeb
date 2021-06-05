import { ActivatedRoute } from "@angular/router";
import { FirebaseService } from "src/app/shared/services/firestore.service";

import { Component, OnInit } from "@angular/core";
import { Subject } from "rxjs";
import * as moment from "moment";
import { CalendarView } from "angular-calendar";
import { AlertService } from "src/app/shared/helpers/alert/alert.service";
import { ModalService } from "src/app/shared/helpers/modal/modal.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

@Component({
  selector: "app-medicine",
  templateUrl: "./medicine.component.html",
  styleUrls: ["./medicine.component.css"],
})
export class MedicineComponent implements OnInit {
  private moduleId: string;

  medicineForm: FormGroup;
  alumn: any;
  loading: boolean = true;
  events;
  view: CalendarView = CalendarView.Week;
  CalendarView = CalendarView;
  viewDate: Date = new Date();
  refresh: Subject<any> = new Subject();
  submitted = false;
  locale: string = "es";

  activeDayIsOpen: boolean = true;
  constructor(
    private formBuilder: FormBuilder,
    private firebaseService: FirebaseService,
    private route: ActivatedRoute,
    public modalService: ModalService,
    public alertService: AlertService
  ) {}

  ngOnInit(): void {
    this.moduleId = this.route.snapshot.paramMap.get("id");
    this.getMedicineByAlumn();

    this.medicineForm = this.formBuilder.group({
      title: ["", Validators.required],
      start: ["", Validators.required],
      end: ["", Validators.required],
      color: ["", Validators.required],
    });
  }

  async getAlumnById() {
    return this.firebaseService.getAlumnById(this.moduleId).then((resp) => {
      return resp;
    });
  }

  deleteCalendar(uid: string) {
    this.firebaseService
      .deleteMedicine(uid)
      .then(() =>
        this.alertService.success("The medicine has been deleted", {
          autoClose: true,
        })
      )
      .catch(() =>
        this.alertService.success("Couldn't delete the medicine", {
          autoClose: true,
        })
      );
    this.loading = true;
    this.getMedicineByAlumn();
  }

  async getMedicineByAlumn() {
    this.alumn = await this.getAlumnById();
    const calendar: any = await this.firebaseService
      .getMedicineByAlumn(this.alumn.userId)
      .catch(() => (this.loading = false));

    this.events = calendar.map((cal) => {
      return {
        start: moment(cal.start, "YYYY-MM-DD HH:mm").toDate(),
        end: moment(cal.end, "YYYY-MM-DD HH:mm").toDate(),
        title: cal.title,
        color: { primate: cal.color, secondary: cal.color },
        actions: [
          {
            label: '<i class="fas fa-fw fa-trash-alt"></i>',
            a11yLabel: "Delete",
            onClick: () => this.deleteCalendar(cal.uid),
          },
        ],
      };
    });

    this.loading = false;
  }

  get f() {
    return this.medicineForm.controls;
  }

  async openModal(id: string) {
    this.modalService.open(id);
  }

  async onSubmit() {
    this.submitted = true;
    if (this.medicineForm.valid) {
      const { title, start, end, color } = this.medicineForm.value;
      this.firebaseService
        .addMedicine({ title, start, end, color, userId: this.alumn.userId })
        .then(() => {
          this.alertService.success("The medicine has been added", {
            autoClose: true,
          });
          this.modalService.close("custom-modal-1");
          this.loading = true;
          this.getMedicineByAlumn();
        })
        .catch(() => {
          this.alertService.success("Couldn't added the medicine", {
            autoClose: true,
          });
          this.modalService.close("custom-modal-1");
        });
    }
  }
}
