import {DTOJobInstance} from '../batch/dto-job-instance.interface';

export const DTO_BATCHS: DTOJobInstance[] = [{
  "executions": [{
    "creation": "2026-11-03T19:32:37.381644Z",
    "debut": "2026-11-03T19:32:37.659844Z",
    "etapes": [{
      "creation": "2026-11-03T19:32:37.762066Z",
      "debut": "2026-11-03T19:32:37.801941Z",
      "fin": "2026-11-03T19:35:21.725964Z",
      "nom": "stepCalculerMoyennes",
      "statut": "COMPLETED"
    }],
    "fin": "2026-11-03T19:35:21.801117Z",
    "parametres": [{"nom": "date", "type": "java.time.LocalDate", "valeur": "2026-11-03"}],
    "statut": "COMPLETED"
  }], "nom": "jobCalculerMoyennes"
}, {
  "executions": [{
    "creation": "2026-11-03T19:32:08.472697Z",
    "debut": "2026-11-03T19:32:08.76793Z",
    "etapes": [{
      "creation": "2026-11-03T19:32:08.864424Z",
      "debut": "2026-11-03T19:32:08.906825Z",
      "fin": "2026-11-03T19:32:11.318063Z",
      "nom": "stepConvertirEnValeurCours",
      "statut": "COMPLETED"
    }],
    "fin": "2026-11-03T19:32:11.396638Z",
    "parametres": [{"nom": "date", "type": "java.time.LocalDate", "valeur": "2026-11-03"}],
    "statut": "COMPLETED"
  }], "nom": "jobConvertirEnValeurCours"
}, {
  "executions": [{
    "creation": "2026-11-03T19:31:31.690362Z",
    "debut": "2026-11-03T19:31:32.016077Z",
    "etapes": [{
      "creation": "2026-11-03T19:31:32.101248Z",
      "debut": "2026-11-03T19:31:32.13716Z",
      "fin": "2026-11-03T19:31:38.286552Z",
      "nom": "stepRecupererBoursoramaCours",
      "statut": "COMPLETED"
    }, {
      "creation": "2026-11-03T19:31:38.415893Z",
      "debut": "2026-11-03T19:31:38.450648Z",
      "fin": "2026-11-03T19:31:42.235303Z",
      "nom": "stepPersisterBoursoramaCours",
      "statut": "COMPLETED"
    }],
    "fin": "2026-11-03T19:31:42.297304Z",
    "parametres": [{"nom": "date", "type": "java.time.LocalDate", "valeur": "2026-11-03"}],
    "statut": "COMPLETED"
  }], "nom": "jobMajBoursoramaCours"
}, {
  "executions": [{
    "creation": "2026-11-03T19:30:59.834155Z",
    "debut": "2026-11-03T19:31:00.077433Z",
    "etapes": [{
      "creation": "2026-11-03T19:31:00.162524Z",
      "debut": "2026-11-03T19:31:00.200769Z",
      "fin": "2026-11-03T19:31:02.653339Z",
      "nom": "stepRecupererAbcCotations",
      "statut": "COMPLETED"
    }, {
      "creation": "2026-11-03T19:31:02.770234Z",
      "debut": "2026-11-03T19:31:02.806897Z",
      "fin": "2026-11-03T19:31:06.720519Z",
      "nom": "stepPersisterAbcCotations",
      "statut": "COMPLETED"
    }],
    "fin": "2026-11-03T19:31:06.778044Z",
    "parametres": [{"nom": "date", "type": "java.time.LocalDate", "valeur": "2026-11-03"}],
    "statut": "COMPLETED"
  }], "nom": "jobMajAbcCotations"
}, {
  "executions": [{
    "creation": "2026-11-03T19:30:27.292002Z",
    "debut": "2026-11-03T19:30:27.611373Z",
    "etapes": [{
      "creation": "2026-11-03T19:30:30.463436Z",
      "debut": "2026-11-03T19:30:30.499091Z",
      "fin": "2026-11-03T19:30:34.019488Z",
      "nom": "stepPersisterAbcLibelles",
      "statut": "COMPLETED"
    }, {
      "creation": "2026-11-03T19:30:27.70431Z",
      "debut": "2026-11-03T19:30:27.739469Z",
      "fin": "2026-11-03T19:30:30.348588Z",
      "nom": "stepRecupererAbcLibelles",
      "statut": "COMPLETED"
    }],
    "fin": "2026-11-03T19:30:34.067964Z",
    "parametres": [{"nom": "date", "type": "java.time.LocalDate", "valeur": "2026-11-03"}],
    "statut": "COMPLETED"
  }], "nom": "jobMajAbcLibelles"
}];
