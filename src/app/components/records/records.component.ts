import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { FirebaseService } from "src/app/shared/services/firestore.service";
import { ModalService } from "src/app/shared/helpers/modal/modal.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AlertService } from "src/app/shared/helpers/alert/alert.service";
import * as moment from "moment";
moment.locale("es");

@Component({
  selector: "app-records",
  templateUrl: "./records.component.html",
  styleUrls: ["./records.component.css"],
})
export class RecordsComponent implements OnInit {
  alumn: any;
  minutes: any;
  loading: boolean = true;
  submitted = false;
  recordForm: FormGroup;
  constructor(
    private formBuilder: FormBuilder,
    private firebaseService: FirebaseService,
    private route: ActivatedRoute,
    public modalService: ModalService,
    public alertService: AlertService
  ) {}

  ngOnInit() {
    this.getAlumnById();
    this.getMinutesByAlumn();
    this.recordForm = this.formBuilder.group({
      title: ["", Validators.required],
      description: ["", Validators.required],
      date: ["", Validators.required],
      type: ["", Validators.required],
    });
  }

  async getAlumnById() {
    const alumnId = this.route.snapshot.paramMap.get("id");
    this.alumn = await this.firebaseService.getAlumnById(alumnId);
  }

  get f() {
    return this.recordForm.controls;
  }

  async openModal(id: string, alumnId: string) {
    this.modalService.open(id);
  }

  getDate(date: string, format: string) {
    return moment(date, "YYYY-MM-DD").format(format).toString();
  }

  async onSubmit() {
    this.submitted = true;
    if (this.recordForm.valid) {
      const { title, description, date, type } = this.recordForm.value;
      this.firebaseService
        .addMinute({
          title,
          description,
          date,
          type,
          userId: this.alumn.userId,
        })
        .then(() => {
          this.alertService.success("The minute has been added", {
            autoClose: true,
          });
          this.modalService.close("custom-modal-1");
          this.loading = true;
          this.getMinutesByAlumn();
        })
        .catch(() => {
          this.alertService.success("Couldn't added the minute", {
            autoClose: true,
          });
          this.modalService.close("custom-modal-1");
        });
    }
  }

  async getMinutesByAlumn() {
    const alumnId = this.route.snapshot.paramMap.get("id");
    const noSorted: any = await this.firebaseService.getMinutesByAlumn(alumnId);
    if (noSorted)
      this.minutes = noSorted?.sort(
        (a, b) => <any>new Date(a.date) - <any>new Date(b.date)
      );
    this.loading = false;
  }
}
