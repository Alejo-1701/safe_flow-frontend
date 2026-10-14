-- =============================================================================
-- BASE DE DATOS: Safe Flow / ParkResidencial
-- SCRIPT DDL: Estructura de Tablas (01_schema.sql)
-- MOTOR: PostgreSQL
-- =============================================================================

-- Limpieza previa (opcional para ejecución limpia)
DROP TABLE IF EXISTS notificacion_estados CASCADE;

DROP TABLE IF EXISTS notificacion CASCADE;

DROP TABLE IF EXISTS solicitud CASCADE;

DROP TABLE IF EXISTS incidentes CASCADE;

DROP TABLE IF EXISTS recaudo CASCADE;

DROP TABLE IF EXISTS pago CASCADE;

DROP TABLE IF EXISTS tarifa CASCADE;

DROP TABLE IF EXISTS autorizacion_visita CASCADE;

DROP TABLE IF EXISTS registro_acceso CASCADE;

DROP TABLE IF EXISTS turno CASCADE;

DROP TABLE IF EXISTS vehiculos CASCADE;

DROP TABLE IF EXISTS asamblea_copropietarios CASCADE;

DROP TABLE IF EXISTS parqueadero CASCADE;

DROP TABLE IF EXISTS guardia_seguridad CASCADE;

DROP TABLE IF EXISTS residente CASCADE;

DROP TABLE IF EXISTS apartamento CASCADE;

DROP TABLE IF EXISTS empresa_vigilancia CASCADE;

DROP TABLE IF EXISTS administrador CASCADE;

DROP TABLE IF EXISTS perfil CASCADE;

DROP TABLE IF EXISTS persona_correo CASCADE;

DROP TABLE IF EXISTS persona_telefonos CASCADE;

DROP TABLE IF EXISTS personas CASCADE;

DROP TABLE IF EXISTS roles CASCADE;

-- =============================================================================
-- 1. MÓDULO DE IDENTIDAD Y SEGURIDAD
-- =============================================================================

-- Tabla: Roles
CREATE TABLE roles (
    id_rol SMALLSERIAL PRIMARY KEY,
    nombre_rol VARCHAR(15) NOT NULL UNIQUE
);

-- Tabla: EmpresaVigilancia
CREATE TABLE empresa_vigilancia (
    nit VARCHAR(20) PRIMARY KEY,
    nombre_empresa VARCHAR(100) NOT NULL,
    rep_legal VARCHAR(100) NOT NULL,
    telefono VARCHAR(15) NOT NULL,
    email VARCHAR(100) NOT NULL,
    direccion VARCHAR(100) NOT NULL
);

-- Tabla: Personas (Entidad central)
CREATE TABLE personas (
    num_documento VARCHAR(10) PRIMARY KEY,
    tipo_documento CHAR(2) NOT NULL,
    primer_nombre VARCHAR(50) NOT NULL,
    segundo_nombre VARCHAR(50),
    primer_apellido VARCHAR(50) NOT NULL,
    segundo_apellido VARCHAR(50) NOT NULL,
    id_rol INT NOT NULL REFERENCES roles (id_rol) ON DELETE RESTRICT ON UPDATE CASCADE,
    nit_empresa VARCHAR(20) REFERENCES empresa_vigilancia (nit) ON DELETE SET NULL ON UPDATE CASCADE
);

-- Tabla: Persona_Telefonos (Multivaluado 1FN)
CREATE TABLE persona_telefonos (
    doc_persona VARCHAR(10) REFERENCES personas (num_documento) ON DELETE CASCADE ON UPDATE CASCADE,
    telefono VARCHAR(15) NOT NULL,
    PRIMARY KEY (doc_persona, telefono)
);

-- Tabla: Persona_Correo (Multivaluado 1FN)
CREATE TABLE persona_correo (
    doc_persona VARCHAR(10) REFERENCES personas (num_documento) ON DELETE CASCADE ON UPDATE CASCADE,
    email VARCHAR(250) NOT NULL,
    PRIMARY KEY (doc_persona, email)
);

-- Tabla: Perfil (Credenciales - Relación 1:1)
CREATE TABLE perfil (
    doc_persona VARCHAR(10) PRIMARY KEY REFERENCES personas (num_documento) ON DELETE CASCADE ON UPDATE CASCADE,
    contrasenia VARCHAR(255) NOT NULL,
    estado_perfil BOOLEAN DEFAULT TRUE
);

-- Tabla Especializada (ISA): Administrador
CREATE TABLE administrador (
    numero_documento VARCHAR(10) PRIMARY KEY REFERENCES personas (num_documento) ON DELETE CASCADE ON UPDATE CASCADE,
    rol VARCHAR(50) NOT NULL,
    inicio_gestion DATE NOT NULL,
    fin_gestion DATE
);

-- Tabla Especializada (ISA): Guardia_Seguridad
CREATE TABLE guardia_seguridad (
    numero_documento VARCHAR(10) PRIMARY KEY REFERENCES personas (num_documento) ON DELETE CASCADE ON UPDATE CASCADE,
    empresa VARCHAR(100) NOT NULL
);

-- =============================================================================
-- 2. MÓDULO DE INFRAESTRUCTURA Y SOPORTE LEGAL
-- =============================================================================

-- Tabla: Apartamento
CREATE TABLE apartamento (
    id_apartamento SMALLSERIAL PRIMARY KEY,
    torre VARCHAR(10) NOT NULL,
    numero_apto VARCHAR(10) NOT NULL,
    doc_propietario VARCHAR(10) NOT NULL REFERENCES personas (num_documento) ON DELETE RESTRICT ON UPDATE CASCADE
);

-- Tabla Especializada (ISA): Residente
CREATE TABLE residente (
    numero_documento VARCHAR(10) PRIMARY KEY REFERENCES personas (num_documento) ON DELETE CASCADE ON UPDATE CASCADE,
    id_apartamento SMALLINT NOT NULL REFERENCES apartamento (id_apartamento) ON DELETE RESTRICT ON UPDATE CASCADE
);

-- Tabla: Parqueadero
CREATE TABLE parqueadero (
    id_parqueadero VARCHAR(20) PRIMARY KEY,
    tipo_celda VARCHAR(20) NOT NULL,
    estado VARCHAR(20) NOT NULL,
    id_apto_asignado INT REFERENCES apartamento (id_apartamento) ON DELETE SET NULL ON UPDATE CASCADE
);

-- Tabla: AsambleaCopropietarios
CREATE TABLE asamblea_copropietarios (
    id_asamblea SMALLSERIAL PRIMARY KEY,
    numero_acta VARCHAR(20) NOT NULL,
    fecha_reunion DATE NOT NULL,
    art_referencia VARCHAR(30) NOT NULL,
    des_acuerdo TEXT NOT NULL
);

-- =============================================================================
-- 3. MÓDULO DE OPERACIÓN Y VEHÍCULOS
-- =============================================================================

-- Tabla: Vehiculos
CREATE TABLE vehiculos (
    placa VARCHAR(10) PRIMARY KEY,
    numero_chasis VARCHAR(30) UNIQUE NOT NULL,
    tipo VARCHAR(20) NOT NULL,
    linea VARCHAR(50) NOT NULL,
    modelo INT NOT NULL,
    cilindraje INT NOT NULL,
    color VARCHAR(20) NOT NULL,
    servicio VARCHAR(20) NOT NULL,
    clase_vehiculo VARCHAR(20) NOT NULL,
    doc_propietario VARCHAR(10) NOT NULL REFERENCES personas (num_documento) ON DELETE RESTRICT ON UPDATE CASCADE
);

-- Tabla: Turno
CREATE TABLE turno (
    id_turno SMALLSERIAL PRIMARY KEY,
    fecha_turno DATE NOT NULL,
    hora_inicio TIME NOT NULL,
    hora_fin TIME NOT NULL,
    recaudo_fisico MONEY NOT NULL,
    observaciones TEXT,
    num_documento_guardia VARCHAR(10) NOT NULL REFERENCES personas (num_documento) ON DELETE RESTRICT ON UPDATE CASCADE
);

-- Tabla: Registro_Acceso
CREATE TABLE registro_acceso (
    id_registro SMALLSERIAL PRIMARY KEY,
    placa VARCHAR(10) NOT NULL REFERENCES vehiculos (placa) ON DELETE RESTRICT ON UPDATE CASCADE,
    id_turno SMALLINT NOT NULL REFERENCES turno (id_turno) ON DELETE RESTRICT ON UPDATE CASCADE,
    fecha_entrada DATE NOT NULL,
    hora_entrada TIME NOT NULL,
    fecha_salida DATE,
    hora_salida TIME
);

-- Tabla: Autorizacion_Visita
CREATE TABLE autorizacion_visita (
    id_autorizacion SERIAL PRIMARY KEY,
    fecha_programada DATE NOT NULL,
    doc_residente VARCHAR(10) NOT NULL REFERENCES personas (num_documento) ON DELETE CASCADE ON UPDATE CASCADE,
    doc_visitante VARCHAR(10) NOT NULL REFERENCES personas (num_documento) ON DELETE CASCADE ON UPDATE CASCADE,
    placa_vehiculo VARCHAR(10) REFERENCES vehiculos (placa) ON DELETE SET NULL ON UPDATE CASCADE
);

-- =============================================================================
-- 4. MÓDULO FINANCIERO Y RECAUDO
-- =============================================================================

-- Tabla: Tarifa
CREATE TABLE tarifa (
    id_tarifa SMALLSERIAL PRIMARY KEY,
    tipo_vehiculo VARCHAR(20) NOT NULL,
    valor_minuto MONEY NOT NULL,
    id_asamblea SMALLINT NOT NULL REFERENCES asamblea_copropietarios (id_asamblea) ON DELETE RESTRICT ON UPDATE CASCADE
);

-- Tabla: Pago
CREATE TABLE pago (
    id_pago SERIAL PRIMARY KEY,
    metodo_pago VARCHAR(20) NOT NULL,
    fecha_caja DATE NOT NULL,
    hora_caja TIME NOT NULL,
    monto_total MONEY NOT NULL,
    id_registro SMALLINT UNIQUE NOT NULL REFERENCES registro_acceso (id_registro) ON DELETE RESTRICT ON UPDATE CASCADE,
    id_turno SMALLINT NOT NULL REFERENCES turno (id_turno) ON DELETE RESTRICT ON UPDATE CASCADE
);

-- Tabla: Recaudo (Factura)
CREATE TABLE recaudo (
    numero_factura SERIAL PRIMARY KEY,
    id_pago INT UNIQUE NOT NULL REFERENCES pago (id_pago) ON DELETE RESTRICT ON UPDATE CASCADE,
    id_tarifa SMALLINT NOT NULL REFERENCES tarifa (id_tarifa) ON DELETE RESTRICT ON UPDATE CASCADE,
    id_confirmacion VARCHAR(50) UNIQUE NOT NULL,
    sub_total MONEY NOT NULL,
    total_pagado MONEY NOT NULL
);

-- =============================================================================
-- 5. MÓDULO DE GESTIÓN Y NOVEDADES
-- =============================================================================

-- Tabla: Incidentes
CREATE TABLE incidentes (
    id_incidente SERIAL PRIMARY KEY,
    doc_persona VARCHAR(10) NOT NULL REFERENCES personas (num_documento) ON DELETE CASCADE ON UPDATE CASCADE,
    descripcion TEXT NOT NULL,
    fecha_incidente DATE NOT NULL
);

-- Tabla: Solicitud
CREATE TABLE solicitud (
    id_solicitud SERIAL PRIMARY KEY,
    doc_persona VARCHAR(10) NOT NULL REFERENCES personas (num_documento) ON DELETE CASCADE ON UPDATE CASCADE,
    descripcion TEXT NOT NULL,
    fecha_solicitud DATE NOT NULL,
    estado_solicitud VARCHAR(20) NOT NULL DEFAULT 'Pendiente'
);

-- Tabla: Notificacion
CREATE TABLE notificacion (
    id_notificacion SERIAL PRIMARY KEY,
    tipo VARCHAR(30) NOT NULL,
    mensaje TEXT NOT NULL,
    leido BOOLEAN DEFAULT FALSE,
    numero_documento VARCHAR(10) NOT NULL REFERENCES personas (num_documento) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Tabla: Notificacion_Estados (Historial)
CREATE TABLE notificacion_estados (
    id_estado_hist SERIAL PRIMARY KEY,
    id_notificacion INT NOT NULL REFERENCES notificacion (id_notificacion) ON DELETE CASCADE ON UPDATE CASCADE,
    nuevo_estado VARCHAR(20) NOT NULL,
    duracion INTERVAL NOT NULL,
    fecha_cambio DATE NOT NULL,
    hora_cambio TIME NOT NULL
);