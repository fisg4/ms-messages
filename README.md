![FastMusik](https://fastmusik-fastmusik-marmolpen3.cloud.okteto.net/static/media/fastMusik_logo.42183ad8193e5a2bba20.png)

# Microservicio de mensajes


## Nivel de acabado

El nivel de acabado final del microservicio es **9** y a través de los siguientes epígrafes se puede extraer la justificación de ese nivel.

## Descripción de la aplicación

Incluir enlace al vídeo demostración

## Descomposición en microservicios


## Customer Agreement


### Análisis de la capacidad

El análisis de la capacidad, realizado en conjunto por todos los miembros del equipo, puede encontrarse en la wiki del repositorio destinado al cliente (haga click [aquí](https://github.com/fisg4/client/wiki/An%C3%A1lisis-de-la-capacidad) para leerlo).

### Planes de precios y justificación


## Descripción de la API REST


## Requisitos

En esta sección se listan los requisitos que se han cumplido durante el desarrollo de la aplicación, diferenciando aquellos relativos al propio microservicio y aquellos relacionados con la plataforma en general.

### Requisitos del microservicio

Como se ha mencionado anteriormente, el nivel de acabado del microservicio es el 9 y, por tanto, además de todos los requisitos de nivel básico, se han implementado 5 avanzados.

#### API REST con un CRUD completo ✅

El desarrollo de este microservicio tiene como base el desarrollo de una API REST para las dos entidades creadas, Room y Message. De ambas, se eligió Room para crear un CRUD completo.

Para llegar a la versión final primero se partió de una simple definición de las rutas, las cuales usaban una base de datos en memoria. Posteriormente se añadieron la persistencia y validación de los datos a través de MongoDB en su servicio SaaS (Mongo Atlas) y la librería Mongoose. Tras ello se mejoró el tratamiento de errores, la eficiencia de las llamadas y se incluyó paginación. Por último, se añadieron las rutas de integración con el microservicio de soporte y con la API externa.

#### Mecanismo de autenticación ✅


#### Frontend ✅


#### Desplegado y accesible en la nube ✅


#### Versionado de la API ✅


#### Documentación de la API ✅

La API ha sido documentada mediante el servicio Swagger y es accesible a través de la URL de producción del microservicio (pulse [aquí](https://messages-fastmusik-marmolpen3.cloud.okteto.net/docs/) para navegar hasta ella)

#### Persistencia de datos ✅


#### Validación de los datos ✅


#### Gestión de código e integración continua ✅


#### Imagen de Docker ✅


#### Pruebas de componente ✅


#### Pruebas de integración ✅


#### Frontend con rutas y navegación ✅


#### Redux ✅


#### API externa ✅


#### Mecanismo de autenticación mediante JWT ✅


#### Mecanismo de rollback ✅


### Requisitos de la aplicación

Para obtener una calificación de 9 se han implementado los siguientes requisitos de aplicación avanzada.

#### Interacción entre microservicios ✅


#### Frontend común ✅


#### API Gateway ✅


#### Autenticación homogénea ✅


## Análisis de los esfuerzos

En esta sección se adjunta el informe de las horas de esfuerzo dedicadas al desarrollo de este microservicio y de los proyectos comunes del grupo.

### Jorge Andrea Molina

Su contribución al proyecto se divide en aproximadamente 80 horas dedicadas al desarrollo (puede consultar el registro de Clockify pulsando [aquí](https://drive.google.com/file/d/1Or4K0Unow6DmFME9oxRQ6wrBLU9v3MoO/view?usp=sharing)) y unas 8 horas participando y gestionando las reuniones de planificación, trabajo y seguimiento del grupo.
