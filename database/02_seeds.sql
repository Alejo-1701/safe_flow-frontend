-- =============================================================================
-- BASE DE DATOS: Safe Flow / ParkResidencial
-- SCRIPT DML: Datos Iniciales de Prueba (02_seeds.sql)
-- MOTOR: PostgreSQL
-- =============================================================================

-- 1. Insertar Roles Base
INSERT INTO
    roles (id_rol, nombre_rol)
VALUES (1, 'Propietario'),
    (2, 'Residente'),
    (3, 'Visitante'),
    (4, 'Guarda'),
    (5, 'Administrador');

-- 2. Insertar Empresa de Vigilancia
INSERT INTO
    empresa_vigilancia (
        nit,
        nombre_empresa,
        rep_legal,
        telefono,
        email,
        direccion
    )
VALUES (
        '900123456-1',
        'Seguridad Colseguros Ltda',
        'Carlos Mendoza',
        '6015551234',
        'contacto@colseguros.com',
        'Calle 26 # 68-12'
    );

-- 3. Insertar Personas de Prueba (Un representante de cada rol)
INSERT INTO
    personas (
        num_documento,
        tipo_documento,
        primer_nombre,
        segundo_nombre,
        primer_apellido,
        segundo_apellido,
        id_rol,
        nit_empresa
    )
VALUES (
        '10101010',
        'CC',
        'Admin',
        'General',
        'Sistema',
        'Principal',
        5,
        NULL
    ),
    (
        '20202020',
        'CC',
        'Brayan',
        'Alex',
        'Camacho',
        'Gomez',
        1,
        NULL
    ),
    (
        '30303030',
        'CC',
        'Juan',
        'Carlos',
        'Perez',
        'Rodriguez',
        2,
        NULL
    ),
    (
        '40404040',
        'CC',
        'Pedro',
        'Antonio',
        'Rios',
        'Morales',
        4,
        '900123456-1'
    ),
    (
        '50505050',
        'CC',
        'Maria',
        'Fernanda',
        'Lopez',
        'Castro',
        3,
        NULL
    );

-- 4. Insertar Correos Electrónicos (Persona_Correo)
INSERT INTO
    persona_correo (doc_persona, email)
VALUES (
        '10101010',
        'admin@safeflow.com'
    ),
    (
        '20202020',
        'brayan.propietario@email.com'
    ),
    (
        '30303030',
        'juan.residente@email.com'
    ),
    (
        '40404040',
        'pedro.guarda@colseguros.com'
    ),
    (
        '50505050',
        'maria.visitante@email.com'
    );

-- 5. Insertar Teléfonos (Persona_Telefonos)
INSERT INTO
    persona_telefonos (doc_persona, telefono)
VALUES ('10101010', '3001112233'),
    ('20202020', '3102223344'),
    ('30303030', '3203334455'),
    ('40404040', '3154445566'),
    ('50505050', '3185556677');

-- 6. Insertar Perfiles (Credenciales de Acceso)
INSERT INTO
    perfil (
        doc_persona,
        contrasenia,
        estado_perfil
    )
VALUES (
        '10101010',
        '$2a$10$e8R1O/Z6yA7...hash_admin',
        TRUE
    ),
    (
        '20202020',
        '$2a$10$e8R1O/Z6yA7...hash_propietario',
        TRUE
    ),
    (
        '30303030',
        '$2a$10$e8R1O/Z6yA7...hash_residente',
        TRUE
    ),
    (
        '40404040',
        '$2a$10$e8R1O/Z6yA7...hash_guarda',
        TRUE
    ),
    (
        '50505050',
        '$2a$10$e8R1O/Z6yA7...hash_visitante',
        TRUE
    );

-- 7. Insertar Tablas Especializadas (ISA)
INSERT INTO
    administrador (
        numero_documento,
        rol,
        inicio_gestion,
        fin_gestion
    )
VALUES (
        '10101010',
        'Administrador General',
        '2026-01-01',
        NULL
    );

INSERT INTO
    guardia_seguridad (numero_documento, empresa)
VALUES (
        '40404040',
        'Seguridad Colseguros Ltda'
    );

-- 8. Insertar Infraestructura (Apartamento y Residente)
INSERT INTO
    apartamento (
        id_apartamento,
        torre,
        numero_apto,
        doc_propietario
    )
VALUES (
        101,
        'Torre 1',
        '101',
        '20202020'
    ),
    (
        102,
        'Torre 1',
        '102',
        '20202020'
    );

INSERT INTO
    residente (
        numero_documento,
        id_apartamento
    )
VALUES ('30303030', 101);

-- 9. Insertar Parqueaderos
INSERT INTO
    parqueadero (
        id_parqueadero,
        tipo_celda,
        estado,
        id_apto_asignado
    )
VALUES (
        'P-101',
        'Residente',
        'Ocupado',
        101
    ),
    (
        'P-102',
        'Residente',
        'Disponible',
        102
    ),
    (
        'V-001',
        'Visitante',
        'Disponible',
        NULL
    );

-- 10. Insertar Asamblea y Tarifas
INSERT INTO
    asamblea_copropietarios (
        id_asamblea,
        numero_acta,
        fecha_reunion,
        art_referencia,
        des_acuerdo
    )
VALUES (
        1,
        'ACTA-2026-01',
        '2026-02-15',
        'Art. 12 Parágrafo 3',
        'Aprobación de tarifas de parqueadero de visitantes para el año 2026.'
    );

INSERT INTO
    tarifa (
        id_tarifa,
        tipo_vehiculo,
        valor_minuto,
        id_asamblea
    )
VALUES (1, 'Carro', 100.00, 1),
    (2, 'Moto', 50.00, 1);

-- 11. Insertar Vehículos
INSERT INTO
    vehiculos (
        placa,
        numero_chasis,
        tipo,
        linea,
        modelo,
        cilindraje,
        color,
        servicio,
        clase_vehiculo,
        doc_propietario
    )
VALUES (
        'KNO123',
        'CHASIS98765432101',
        'Particular',
        'Mazda 3',
        2023,
        2000,
        'Gris',
        'Particular',
        'Carro',
        '30303030'
    ),
    (
        'XYZ987',
        'CHASIS98765432102',
        'Particular',
        'Yamaha FZ',
        2022,
        150,
        'Negro',
        'Particular',
        'Moto',
        '50505050'
    );

-- 12. Insertar Turno y Registros de Operación
INSERT INTO
    turno (
        id_turno,
        fecha_turno,
        hora_inicio,
        hora_fin,
        recaudo_fisico,
        observaciones,
        num_documento_guardia
    )
VALUES (
        1,
        '2026-04-14',
        '06:00:00',
        '14:00:00',
        50000.00,
        'Turno sin novedades críticas.',
        '40404040'
    );

INSERT INTO
    registro_acceso (
        id_registro,
        placa,
        id_turno,
        fecha_entrada,
        hora_entrada,
        fecha_salida,
        hora_salida
    )
VALUES (
        1,
        'XYZ987',
        1,
        '2026-04-14',
        '08:00:00',
        '2026-04-14',
        '10:00:00'
    );

INSERT INTO
    autorizacion_visita (
        id_autorizacion,
        fecha_programada,
        doc_residente,
        doc_visitante,
        placa_vehiculo
    )
VALUES (
        1,
        '2026-04-14',
        '30303030',
        '50505050',
        'XYZ987'
    );

-- 13. Insertar Pago y Recaudo
INSERT INTO
    pago (
        id_pago,
        metodo_pago,
        fecha_caja,
        hora_caja,
        monto_total,
        id_registro,
        id_turno
    )
VALUES (
        1,
        'Efectivo',
        '2026-04-14',
        '10:05:00',
        6000.00,
        1,
        1
    );

INSERT INTO
    recaudo (
        numero_factura,
        id_pago,
        id_tarifa,
        id_confirmacion,
        sub_total,
        total_pagado
    )
VALUES (
        1,
        1,
        2,
        'CONF-20260414-001',
        6000.00,
        6000.00
    );

-- 14. Insertar Novedades (Incidentes, Solicitudes y Notificaciones)
INSERT INTO
    incidentes (
        id_incidente,
        doc_persona,
        descripcion,
        fecha_incidente
    )
VALUES (
        1,
        '30303030',
        'Vehículo mal parqueado bloqueando el acceso al parqueadero P-101.',
        '2026-04-14'
    );

INSERT INTO
    solicitud (
        id_solicitud,
        doc_persona,
        descripcion,
        fecha_solicitud,
        estado_solicitud
    )
VALUES (
        1,
        '30303030',
        'Solicitud de asignación de control de parqueadero adicional.',
        '2026-04-10',
        'Pendiente'
    );

INSERT INTO
    notificacion (
        id_notificacion,
        tipo,
        mensaje,
        leido,
        numero_documento
    )
VALUES (
        1,
        'Acceso',
        'Su visitante Maria Lopez ha ingresado al conjunto.',
        TRUE,
        '30303030'
    );

INSERT INTO
    notificacion_estados (
        id_estado_hist,
        id_notificacion,
        nuevo_estado,
        duracion,
        fecha_cambio,
        hora_cambio
    )
VALUES (
        1,
        1,
        'Leída',
        '00:05:00',
        '2026-04-14',
        '08:05:00'
    );