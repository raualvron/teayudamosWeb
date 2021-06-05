class Alert {
  id: string;
  type: AlertType;
  message: string;
  autoClose: boolean;
  keepAfterRouteChange: boolean;
  fade: boolean;

  constructor(init?: Partial<Alert>) {
    Object.assign(this, init);
  }
}

enum AlertType {
  Success,
  Error,
  Info,
  Warning,
}

export { Alert, AlertType };
