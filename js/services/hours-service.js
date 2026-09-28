/* ============================================================
   Servicio de horarios: calcula si el negocio está abierto.
   La configuración (hora de apertura/cierre) vive en brand-config.
   ============================================================ */
(function (global) {
  "use strict";

  class HoursService {
    constructor(brandConfig) {
      this._hours = brandConfig.hours || {};
      this._timezone = brandConfig.timezone || "America/Merida";
    }

    isOpen(now) {
      const current = this._current(now);
      const schedule = this._schedule(current.day);
      if (schedule.closed) return false;
      if (!schedule.open || !schedule.close) return true;
      const minutes = current.hour * 60 + current.minute;
      const open = this._toMinutes(schedule.open);
      const close = this._toMinutes(schedule.close);
      if (open === null || close === null) return true;
      if (open <= close) return minutes >= open && minutes < close;
      return minutes >= open || minutes < close;
    }

    statusText(now) {
      const current = this._current(now);
      const schedule = this._schedule(current.day);
      if (schedule.closed) return "Cerrado · Descansamos los martes";
      if (!schedule.open || !schedule.close) return "Atención continua";
      const range = this._formatTime(schedule.open) + " – " + this._formatTime(schedule.close);
      if (this.isOpen(now)) return "Abierto · " + range;
      return "Cerrado · Horario de hoy " + range;
    }

    _schedule(day) {
      if (this._hours.weekly && this._hours.weekly[day]) return this._hours.weekly[day];
      return this._hours;
    }

    _current(now) {
      const parts = new Intl.DateTimeFormat("en-US", {
        timeZone: this._timezone,
        weekday: "short",
        hour: "2-digit",
        minute: "2-digit",
        hourCycle: "h23"
      }).formatToParts(now || new Date());
      const values = {};
      parts.forEach(part => { if (part.type !== "literal") values[part.type] = part.value; });
      return {
        day: String(values.weekday || "").slice(0, 3).toLowerCase(),
        hour: Number(values.hour || 0),
        minute: Number(values.minute || 0)
      };
    }

    _formatTime(hhmm) {
      const minutes = this._toMinutes(hhmm);
      if (minutes === null) return hhmm;
      const hour = Math.floor(minutes / 60);
      const minute = minutes % 60;
      const displayHour = hour % 12 || 12;
      return displayHour + (minute ? ":" + String(minute).padStart(2, "0") : "") + (hour < 12 ? " a. m." : " p. m.");
    }

    _toMinutes(hhmm) {
      const m = /^(\d{1,2}):(\d{2})$/.exec(String(hhmm).trim());
      if (!m) return null;
      return +m[1] * 60 + +m[2];
    }
  }

  global.PosApp = global.PosApp || {};
  global.PosApp.HoursService = HoursService;
})(window);
