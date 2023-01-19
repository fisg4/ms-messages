![FastMusik](https://fastmusik-fastmusik-marmolpen3.cloud.okteto.net/static/media/fastMusik_logo.42183ad8193e5a2bba20.png)

# Microservicio de mensajes


## Nivel de acabado

El nivel de acabado final del microservicio es **9** y a través de los siguientes epígrafes se puede extraer la justificación de ese nivel.

## Descripción de la aplicación

**### Incluir enlace al vídeo demostración ###**

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

El desarrollo de este microservicio tiene como base el desarrollo de una API REST para las dos entidades creadas, Room y Message. De ambas, se eligió Room para crear un CRUD completo: creación, lectura, modificación de dos campos y eliminación (véase la documentación de Swagger enlazada posteriormente).

Para llegar a la versión final primero se partió de una simple definición de las rutas, las cuales usaban una base de datos en memoria. Posteriormente se añadieron la persistencia y validación de los datos a través de MongoDB en su servicio SaaS (Mongo Atlas) y la librería Mongoose. Tras ello se mejoró el tratamiento de errores, la eficiencia de las llamadas y se incluyó paginación. Por último, se añadieron las rutas de integración con el microservicio de soporte y con la API externa.

#### Mecanismo de autenticación ✅

Las rutas del microservicio que son accesibles desde el cliente de FastMusik cuentan con una autenticación que dota de seguridad al proyecto.

En primer lugar, como solución temporal se introdujo un token obligatorio en las llamadas con información del usuario implicado. Este sirvió de base para el posterior sistema por tokens JWT del que se hablará más adelante.

#### Frontend ✅

Desde un primer momento se decidió que el frontend a desarrollar por el microservicio iba a formar parte de uno común, dando lugar a FastMusik. En particular, para cubrir las funcionalidades del servicio de mensajería se han desarrollado las vistas de `/chats`, `/chats/:id` y `/chats/:id/details`, así como un componente para crear canciones y otro para mostrar las salas en el perfil del usuario. Puede ver el resultado [aquí](https://fastmusik-fastmusik-marmolpen3.cloud.okteto.net/).

#### Desplegado y accesible en la nube ✅

El microservicio está desplegado en Okteto desde etapas tempranas del desarrollo. Primero el despliegue se realizó por separado para terminar integrándose con el resto de microservicios y clientes en un namespace común. Puede probar los diferentes endpoints con la siguiente URL: [https://messages-fastmusik-marmolpen3.cloud.okteto.net/](https://messages-fastmusik-marmolpen3.cloud.okteto.net/).

#### Versionado de la API ✅

La API cuenta con versionado sencillo el cual viene indicado tras el host, como podemos ver en el siguiente ejemplo de llamada: `https://messages-fastmusik-marmolpen3.cloud.okteto.net/api/v1/rooms/63c46d29d36d9a5a398448a1/messages?page=0&size=10`. Debido a la magnitud del proyecto no ha sido necesario crear más de la única versión existente.

#### Documentación de la API ✅

La API ha sido documentada mediante el servicio Swagger y es accesible a través de la URL de producción del microservicio (pulse [aquí](https://messages-fastmusik-marmolpen3.cloud.okteto.net/docs/) para navegar hasta ella)

#### Persistencia de datos ✅

**#### Comentar que hemos usado Mongo y Mongo Atlas para alojar nuestra base de datos ####**

#### Validación de los datos ✅

**#### Hablar de los esquemas de Mongoose y comentar que se valida y que si hay un error se notifica al usuario con un estado 400 ####**

#### Gestión de código e integración continua ✅

**#### Explicar que hemos configurado dos acciones diferentes: una para la ejecución de tests con cada push y pull request y otra para realizar un despliegue automático siempre que salgan bien los tests. Poner un enlace a la carpeta .github del repo ####**

#### Imagen de Docker ✅

**#### Comentar que hemos creado una imagen Docker sencilla para el despliegue en Okteto y poner una referencia a la misma ####**

#### Pruebas de componente ✅

**#### Decir el número de pruebas de componente realizadas (son 86) y que tenemos una cobertura del 100 % en las funciones de controlador y servicios ####**

#### Pruebas de integración ✅

**#### Decir el número de pruebas de integración realizadas (son 22) y que tenemos una cobertura del 100 % en las funciones de los modelos, que son las que se comunican con la BD ####**

#### (Avanzado) Frontend con rutas y navegación ✅

**### Comentar las rutas que hemos hecho y hacer referencia al requisito de frontend y el de frontend común ###**

#### (Avanzado) Redux ✅

**### Decir que hemos implementado Redux para almacenar el estado de las rooms del usuario, la pagniación de dichas rooms y la room activa. Poner ejemplos de código y/o referenciar los ficheros en el frontend común ###**

#### (Avanzado) API externa ✅

**### Comenta lo que veas de la API Externa ###**

#### (Avanzado) Mecanismo de autenticación mediante JWT ✅

**### Comenta que se utiliza un mecanismo de autenticación mediante JWT a través de una API Gateway que se explica en sección posterior ###**

#### (Avanzado) Mecanismo de rollback ✅

Este requisito avanzado, acordado con el profesorado de la asignatura, se basa en la implementación de un mecanismo de rollback para manejar los fallos que pueden tener lugar durante la integración con el microservicio de soporte. Este mecanismo tiene dos partes claramente diferencias, cada una de ellas se relaciona con una dirección de la integración:

- Por un lado, cuando un usuario reporta un mensaje el microservicio de mensajería se encarga de actualizar la información del mensaje con datos como el usuario demandante y la razón de la denuncia. Una vez se realiza esta acción se realiza una petición POST al microservicio de soporte para que creen una instancia de reporte en su dominio. En el caso de que esta comunicación falle, nuestro sistema está preparado para deshacer el campo.
- Por el otro lado, desde el microservicio de mensajes hemos habilitado un endpoint, `/messages/:id/unban`, a través del cual el microservicio de soporte puede deshacer la actualización del reporte previamente creado si alguno de sus procedimientos posteriores da error.

### Requisitos de la aplicación

La aplicación debía presentar diversas integraciones entre todos los microservicios a través del backend. Este requisito se ha cumplido, siendo la integración que aplica a este microservicio el de reporte de mensajes; por el cuál se notificaba inmediatamente al microservicio de soporte de la creación de un nuevo reporte. Además, luego se recibía la resolución de ese mismo reporte, dotando de doble sentido a la integración.

Para obtener una calificación de 9 se han implementado los siguientes requisitos de aplicación avanzada.

#### Frontend común ✅

Este requisito se ha cumplido a través de un proyecto desarrollado en React donde cada microservicio ha incluido una o varias vistas que almacenaban toda o casi toda la funcionalidad de su microservicio. Para completarla, al menos en lo relativo a este microservicio, también se han desarrollado componentes para completar las vistas de, en este caso, los microservicios de canciones y usuarios. Puede visitar el código del frontend que se ha desarrollado para los mensajes a través de este [enlace](https://github.com/fisg4/client/tree/main/src/messages).

#### API Gateway ✅

Como forma de comunicar fácilmente el cliente con los distintos microservicios se ha creado un servicio adicional que actúa como API Gateway. Las principales funciones de este componente, el cual está alojado en esta [ruta](https://apigateway-fastmusik-marmolpen3.cloud.okteto.net/), son: el mapeo de rutas, la comprobación de credenciales y la generación del token necesario para interactuar con la mayoría de rutas de la aplicación. Sobre estas dos últimas características se profundiza en el apartado siguiente.

#### Autenticación homogénea ✅

La API Gateway presentada anteriormente se desarrolló principalmente para posibilitar un sistema de autenticación homogénea que completase este requisito. Así, el servicio cuenta con una ruta raíz `/` a través de la que se realiza una llamada al microservicio de usuarios enviando las credenciales de un usuario de la aplicación. Si la respuesta del microservicio es positiva, este servicio genera un token JWT con los datos principales del usuario y lo envía de vuelta al emisor de la primera petición. Luego, para casi la totalidad de las rutas mapeadas en este servicio se realiza una comprobación mediante la librería passport para asegurar que el token recibido es el correcto.

## Análisis de los esfuerzos

En esta sección se adjunta el informe de las horas de esfuerzo dedicadas al desarrollo de este microservicio y de los proyectos comunes del grupo.

### Jorge Andrea Molina

Su contribución al proyecto se divide en aproximadamente 80 horas dedicadas al desarrollo (puede consultar el registro de Clockify pulsando [aquí](https://drive.google.com/file/d/1Or4K0Unow6DmFME9oxRQ6wrBLU9v3MoO/view?usp=sharing)) y unas 8 horas participando y gestionando las reuniones de planificación, trabajo y seguimiento del grupo.
