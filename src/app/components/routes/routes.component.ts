import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { FirebaseService } from "src/app/shared/services/firestore.service";
import * as moment from "moment";
moment.locale("es");

declare var ol: any;
@Component({
  selector: "app-routes",
  templateUrl: "./routes.component.html",
  styleUrls: ["./routes.component.css"],
})
export class RoutesComponent implements OnInit {
  private moduleId: string;

  loading: boolean = true;
  alumn: any;
  map: any;
  routes: any;
  style: null;
  vectorSource = new ol.source.Vector();
  vectorLayer = new ol.layer.Vector({
    source: this.vectorSource,
  });
  osrmRoute = "//router.project-osrm.org/route/v1/driving/";
  reverseGeocoding =
    "http://nominatim.openstreetmap.org/reverse?format=json&lon=";
  iconMarker =
    "https://cdn.mapmarker.io/api/v1/font-awesome/v5/pin?icon=fa-star-solid&size=30&hoffset=0&voffset=-1";
  styles = {
    route: new ol.style.Style({
      stroke: new ol.style.Stroke({
        width: 3,
        color: [40, 40, 40, 0.8],
      }),
    }),
    icon: new ol.style.Style({
      image: new ol.style.Icon({
        anchor: [0.5, 1],
        src: this.iconMarker,
      }),
    }),
  };

  constructor(
    private firebaseService: FirebaseService,
    private route: ActivatedRoute
  ) {}

  async ngOnInit() {
    this.moduleId = this.route.snapshot.paramMap.get("id");
    this.alumn = await this.getAlumnById();

    this.initMap();

    this.routes = await this.firebaseService
      .getRoutesByAlumn(this.alumn.userId)
      .then((routes: any) => {
        return routes.map((route) => {
          return {
            ...route,
            address: this.reverseGeo(
              route.points[0].longitude,
              route.points[0].latitude
            ),
          };
        });
      })
      .finally(() => (this.loading = false));

    this.addPointMaps(this.routes[0].points);
  }

  getDate(date: string, format: string) {
    return moment(date, "YYYY-MM-DD HH:mm").format(format).toString();
  }

  changeMap(route) {
    this.addPointMaps(route.points);
  }

  initMap() {
    this.map = new ol.Map({
      target: "map",
      layers: [
        new ol.layer.Tile({
          source: new ol.source.OSM(),
        }),
        this.vectorLayer,
      ],
      view: new ol.View({
        center: new ol.proj.transform(
          [-5.97317, 37.38283],
          "EPSG:4326",
          "EPSG:3857"
        ),
        zoom: 8,
      }),
    });
  }

  addPointMaps(points) {
    this.vectorLayer.getSource().clear();
    debugger;
    if (points.length > 1) {
      points.forEach((point) => {
        this.createFeature([point.longitude, point.latitude]);
      });
      this.getGeometry(
        `${points[0].longitude},${points[0].latitude}`,
        `${points[1].longitude},${points[1].latitude}`
      );
    } else {
      this.createFeature([points[0].longitude, points[0].latitude]);
    }
  }

  reverseGeo(lon, lat) {
    return fetch(this.reverseGeocoding + lon + "&lat=" + lat)
      .then(function (response) {
        return response.json();
      })
      .then(function (json) {
        return json.display_name;
      });
  }

  createRoute(polyline) {
    // route is ol.geom.LineString
    var route = new ol.format.Polyline({
      factor: 1e5,
    }).readGeometry(polyline, {
      dataProjection: "EPSG:4326",
      featureProjection: "EPSG:3857",
    });
    var feature = new ol.Feature({
      type: "route",
      geometry: route,
    });
    feature.setStyle(this.styles.route);
    this.vectorSource.addFeature(feature);
  }

  createFeature(coord) {
    var feature = new ol.Feature({
      type: "place",
      geometry: new ol.geom.Point(ol.proj.fromLonLat(coord)),
    });
    feature.setStyle(this.styles.icon);
    this.vectorSource.addFeature(feature);
  }

  getGeometry(point1, point2) {
    const that = this;
    fetch(this.osrmRoute + point1 + ";" + point2)
      .then(function (r) {
        return r.json();
      })
      .then(function (json) {
        that.createRoute(json.routes[0].geometry);
      });
  }

  getBadgetClass(action) {
    var classList = "";
    if (action == "caida") {
      classList = "badge-danger";
    } else if (action == "ruta") {
      classList = "badge-success";
    }
    return classList.concat(" text-capitalize badge");
  }

  async getAlumnById() {
    return this.firebaseService.getAlumnById(this.moduleId);
  }
}
