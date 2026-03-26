# AUTH

## /auth/login
Method: POST

Headers: content-type/application-json

Body:
```json
{
  "email": "test@test.com",
  "password": "123456"
}
```

Expected response:
```json
{
  "result": "success",
  "msg": "login succesful for test@test.com",
  "data": {
    "session": {
      "access_token": "..."
    }
  }
}
```

---

## /auth/logout
Method: POST

Headers: content-type/application-json

Expected response:
```json
{
  "result": "success",
  "msg": "logout succesful for test@test.com"
}
```

---

# ALUMNO

## /alumno/getwarns
Method: GET

Returns all alumnos with promedio_actual below 7.

Expected response:
```json
{
  "result": "success",
  "msg": "getting warns",
  "data": {
    "Alumnos": [
      {
        "matricula": 12345,
        "nombres": "Juan",
        "apellidos": "Perez",
        "promedio_actual": 6.5
      }
    ]
  }
}
```

---

## /alumno/get
Method: GET

Query params (optional):
- `nombre` — search by name or apellidos (partial, case-insensitive), also matches `estado`
- `matricula` — search by exact matricula number

If neither is provided, returns all alumnos.
Note: `matricula` takes precedence over `nombre` when both are given.

Examples:
- `/alumno/get`
- `/alumno/get?nombre=Juan`
- `/alumno/get?matricula=12345`

Expected response:
```json
{
  "result": "success",
  "msg": "getting alumnos by Juan",
  "data": {
    "Alumnos": [
      {
        "matricula": 12345,
        "nombres": "Juan",
        "apellidos": "Perez"
      }
    ]
  }
}
```

---

## /alumno/get/:matricula
Method: GET

Params:
- `matricula` — integer, the student's ID number

Example: `/alumno/get/12345`

Expected response:
```json
{
  "result": "success",
  "msg": "Juan details retreived",
  "data": {
    "alumno": {
      "matricula": 12345,
      "nombres": "Juan",
      "apellidos": "Perez",
      "correo": "juan.perez@school.edu",
      "carrera": 1,
      "grupo_id": 2,
      "grupo_nom": "1A",
      "estado": "Activo",
      "promedio_actual": 8.5
    },
    "calificaciones": [
      {
        "matricula": 12345,
        "materia": { "nombre": "Calculo Diferencial" },
        "unidad": 1,
        "calificacion": 8.5,
        "acreditado": true
      }
    ],
    "horario": [
      {
        "materia": { "nombre": "Calculo Diferencial" },
        "inicio": "2024-01-15T08:00:00",
        "fin": "2024-01-15T10:00:00"
      }
    ]
  }
}
```

`estado` enum values: `"Activo"` | `"Baja Temporal"` | `"Baja Definitiva"`

---

## /alumno/change-state/:matricula
Method: PATCH

Params:
- `matricula` — integer, the student's ID number

Body:
```json
{
  "newState": "Baja Temporal"
}
```

Valid `newState` values: `"Activo"` | `"Baja Temporal"` | `"Baja Definitiva"`

Expected response:
```json
{
  "result": "success",
  "msg": "Juan state changed from Activo to Baja Temporal"
}
```

---

## /alumno/get-extended/:matricula
Method: GET

Params:
- `matricula` — integer, the student's ID number

Example: `/alumno/get-extended/12345`

Expected response:
```json
{
  "result": "success",
  "msg": "Juan extended data retreived succesfully",
  "data": {
    "Matricula": 12345,
    "Nombre": "Juan Perez",
    "Genero": "Masculino",
    "ProgramaEducativo": "Ingenieria en Sistemas Computacionales",
    "Grupo": "1A",
    "Turno": "Matutino",
    "Nivel": "TSU",
    "Cuatrimestre": 3
  }
}
```

---

# BAJAS

## /bajas/create
Method: POST

Body:
```json
{
  "matricula": 12345,
  "tipoDeBaja": "Baja Temporal",
  "motivo": "Problemas personales"
}
```

Valid `tipoDeBaja` values: `"Baja Temporal"` | `"Baja Definitiva"`

Changes the alumno's `estado` to `tipoDeBaja` and creates a record in `historial_baja`.

Expected response:
```json
{
  "result": "success",
  "msg": "Juan ha sido dado de Baja Temporal"
}
```

---

## /bajas/getall
Method: GET

Returns all records from `historial_baja` joined with their corresponding alumno data.

Expected response:
```json
{
  "result": "success",
  "msg": "Succesfully retreive Bajas data",
  "data": {
    "Bajas": [
      {
        "No.": 1,
        "Matricula": 12345,
        "Nombre": "Juan Perez",
        "Genero": "Masculino",
        "ProgramaEducativo": "Ingenieria en Sistemas Computacionales",
        "Grupo": "1A",
        "Turno": "Matutino",
        "Nivel": "TSU",
        "Cuatrimestre": 3,
        "TipoDeBaja": "Baja Temporal",
        "Motivo": "Problemas personales",
        "Comentarios": null
      }
    ]
  }
}
```

---

# DOCENTE

## /docente/create
Method: POST

Headers:
- `content-type: application/json`
- `authorization: Bearer <access_token>` (required — caller must have cargo `Directivo` or `Administracion`)

Body:
```json
{
  "nomina": 1001,
  "nombres": "Maria",
  "apellidos": "Lopez",
  "correo": "maria.lopez@school.edu",
  "cargo": "PTC"
}
```

Valid `cargo` values: `"Directivo"` | `"Administracion"` | `"PTA"` | `"PTC"`

Expected response:
```json
{
  "result": "success",
  "msg": "register succesful for Maria"
}
```

---

## /docente/get
Method: GET

Query params (optional):
- `nombre` — search by name/apellidos (partial, case-insensitive), also matches materia name and grupo_nom via horario
- `nomina` — search by exact nomina number

If neither is provided, returns all docentes.
Note: `nomina` takes precedence over `nombre` when both are given.

Examples:
- `/docente/get`
- `/docente/get?nombre=Maria`
- `/docente/get?nomina=1001`

Expected response:
```json
{
  "result": "success",
  "msg": "getting docentes by Maria",
  "data": {
    "Docentes": [
      {
        "nomina": 1001,
        "nombres": "Maria",
        "apellidos": "Lopez",
        "correo": "maria.lopez@school.edu",
        "cargo": "PTC"
      }
    ]
  }
}
```

---

## /docente/get/:nomina
Method: GET

Params:
- `nomina` — integer, the teacher's employee ID

Example: `/docente/get/1001`

Expected response:
```json
{
  "result": "success",
  "msg": "Maria details retreived",
  "data": {
    "docente": {
      "nomina": 1001,
      "nombres": "Maria",
      "apellidos": "Lopez",
      "correo": "maria.lopez@school.edu",
      "cargo": "PTC",
      "auth_id": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
    },
    "grupo_tutorado": [
      {
        "id": 2,
        "nom": "1A",
        "salon": "Salon 101",
        "tutor": 1001
      }
    ],
    "horario": [
      {
        "materia": { "nombre": "Calculo Diferencial" },
        "inicio": "2024-01-15T08:00:00",
        "fin": "2024-01-15T10:00:00"
      }
    ]
  }
}
```

---

# CARRERA

## /carrera/getall
Method: GET

Expected response:
```json
{
  "result": "success",
  "msg": "getting all carreras",
  "data": {
    "Carreras": [
      {
        "id": 1,
        "nom": "ISC",
        "nombre": "Ingenieria en Sistemas Computacionales"
      }
    ]
  }
}
```

---

## /carrera/:id
Method: GET

Params:
- `id` — integer, the carrera ID

Example: `/carrera/1`

Expected response:
```json
{
  "result": "success",
  "msg": "Ingenieria en Sistemas Computacionales details retrieved",
  "data": {
    "carrera": {
      "id": 1,
      "nom": "ISC",
      "nombre": "Ingenieria en Sistemas Computacionales"
    },
    "materias": [
      {
        "id": 10,
        "nombre": "Calculo Diferencial",
        "cuatrimestre": 1,
        "carga_horaria": 5
      }
    ]
  }
}
```

---

# GRUPO

## /grupo/getall
Method: GET

Expected response:
```json
{
  "result": "success",
  "msg": "getting all grupos",
  "data": {
    "Grupos": [
      {
        "id": 2,
        "nom": "1A",
        "salon": "Salon 101",
        "tutor": 1001
      }
    ]
  }
}
```

`tutor` is the docente nomina (integer) or `null` if no tutor assigned.

---

## /grupo/getdetails
Method: GET

Returns all grupos with tutor name and student count joined in.

Expected response:
```json
{
  "result": "success",
  "msg": "getting grupo details",
  "data": {
    "Grupos": [
      {
        "id": 2,
        "nom": "1A",
        "salon": "Salon 101",
        "tutor_nomina": 1001,
        "tutor_nombres": "Maria",
        "tutor_apellidos": "Lopez",
        "num_alumnos": 25
      }
    ]
  }
}
```

`tutor_nomina`, `tutor_nombres`, `tutor_apellidos` are `null` when no tutor is assigned.

---

# HORARIO

## /horario/getby/docente/:docente
Method: GET

Params:
- `docente` — integer, the docente's nomina

Example: `/horario/getby/docente/1001`

Expected response:
```json
{
  "result": "success",
  "msg": "horario for docente 1001",
  "data": {
    "horario": [
      {
        "materia": { "nombre": "Calculo Diferencial" },
        "inicio": "2024-01-15T08:00:00",
        "fin": "2024-01-15T10:00:00"
      }
    ]
  }
}
```

---

## /horario/getby/alumno/:alumno
Method: GET

Params:
- `alumno` — integer, the alumno's matricula

Example: `/horario/getby/alumno/12345`

Resolves the alumno's grupo first, then returns that grupo's full schedule.

Expected response:
```json
{
  "result": "success",
  "msg": "horario for alumno 12345",
  "data": {
    "horario": [
      {
        "materia": { "nombre": "Calculo Diferencial" },
        "inicio": "2024-01-15T08:00:00",
        "fin": "2024-01-15T10:00:00"
      }
    ]
  }
}
```

---

## /horario/getby/grupo/:grupo
Method: GET

Params:
- `grupo` — integer, the grupo ID

Example: `/horario/getby/grupo/2`

Expected response:
```json
{
  "result": "success",
  "msg": "horario for grupo 2",
  "data": {
    "horario": [
      {
        "materia": { "nombre": "Calculo Diferencial" },
        "inicio": "2024-01-15T08:00:00",
        "fin": "2024-01-15T10:00:00"
      }
    ]
  }
}
```

---

# CALIFICACIONES

## /calificaciones/getby/:matricula
Method: GET

Params:
- `matricula` — integer, the alumno's matricula

Example: `/calificaciones/getby/12345`

Expected response:
```json
{
  "result": "success",
  "msg": "calificaciones for matricula 12345",
  "data": {
    "calificaciones": [
      {
        "matricula": 12345,
        "materia": { "nombre": "Calculo Diferencial" },
        "unidad": 1,
        "calificacion": 8.5,
        "acreditado": true
      }
    ]
  }
}
```

---

## /calificaciones/getstatsby/grupo/:grupo
Method: GET

Params:
- `grupo` — integer, the grupo ID

Example: `/calificaciones/getstatsby/grupo/2`

Aggregates calificaciones for all alumnos in the grupo.

Expected response:
```json
{
  "result": "success",
  "msg": "stats for grupo 2",
  "data": {
    "promedio": 7.8,
    "acreditados": 42,
    "reprobados": 8,
    "total": 50,
    "Calificaciones": [
      {
        "materia": 10,
        "calificacion": 8.5,
        "acreditado": true
      }
    ]
  }
}
```

`materia` in `Calificaciones` is the raw materia ID (integer).

---

## /calificaciones/getstatsby/carrera/:carrera
Method: GET

Params:
- `carrera` — integer, the carrera ID

Example: `/calificaciones/getstatsby/carrera/1`

Aggregates calificaciones for all alumnos enrolled in the carrera.

Expected response:
```json
{
  "result": "success",
  "msg": "stats for carrera 1",
  "data": {
    "promedio": 7.8,
    "acreditados": 120,
    "reprobados": 30,
    "total": 150,
    "Calificaciones": [
      {
        "materia": 10,
        "calificacion": 8.5,
        "acreditado": true
      }
    ]
  }
}
```

---

## /calificaciones/getstatsby/docente/:docente
Method: GET

Params:
- `docente` — integer, the docente's nomina

Example: `/calificaciones/getstatsby/docente/1001`

Aggregates calificaciones for all materias the docente teaches (via horario).

Expected response:
```json
{
  "result": "success",
  "msg": "stats for docente 1001",
  "data": {
    "promedio": 7.8,
    "acreditados": 35,
    "reprobados": 5,
    "total": 40,
    "Calificaciones": [
      {
        "materia": 10,
        "calificacion": 8.5,
        "acreditado": true
      }
    ]
  }
}
```
