![FastMusik](https://fastmusik-fastmusik-marmolpen3.cloud.okteto.net/static/media/fastMusik_logo.42183ad8193e5a2bba20.png)

# Microservicio de mensajes


## Nivel de acabado

El nivel de acabado final del microservicio es **9** y a través de los siguientes epígrafes se puede extraer la justificación de ese nivel.

## Descripción de la aplicación

De forma general, FastMusik es una aplicación de música.

FastMusik presenta gran parte de las características de las redes sociales y las aplicaciones colaborativas. A través de búsquedas en el sistema, los usuarios pueden ir añadiendo canciones a la aplicación, dar likes a aquellas que más les gustan y completar la información de estas añadiendo la letra y el videoclip. Como resultado de la navegación y de ir haciendo diferentes likes, los usuarios podrán comenzar a chatear con otros con sus mismas preferencias musicales.

Además, FastMusik es una aplicación que cuenta con el respaldo de un sistema de soporte, mediante el cual es posible el envío de tickets de incidencias o solicitudes de cambios, así como reportes de mensajes inadecuados que se envían por los chats.

**<div style="color:red; text-transform: uppercase; font-size: 2em;">Incluir enlace al vídeo demostración</div>**

## Descomposición en microservicios

FastMusik se divide en 5 microservicios: usuarios, canciones, mensajería, soporte y, por último, una API Gateway. Todos ellos se integran a través del backend para compartir y complementar la información. Estos se integran a su vez con APIs externas como DeepL, Spotify, SendGrid y PurgoMalum. Por otro lado, en la API Gateway se localizan funciones de centralización de operaciones, principalmente el mapeo de endpoints de los diferentes microservicios, para ser un único punto de consumo para el frontend, y para la autenticación de usuarios y generación de JWT.

### Microservicio de usuarios

Implementado por **José Antonio Zamudio Amaya** y **Carlos Núñez Arenas**, El modelado de datos de este microservicio se basa en una única entidad, la que representa a los usuarios, que contiene toda la información necesaria para la gestión de los mismos. Con ella se presentan las siguientes funcionalidades: operaciones CRUD de la entidad, gestión de credenciales, registro y control de usuarios en los clientes y comprobación de texto ofensivo.

Como puntos destacables, está el uso de una API externa, PurgoMalum, para comprobar los textos que se introducen en el sistema; la autenticación que permite el control de la sesión del usuario y la centralización de la información de los usuarios.

### Microservicio de canciones

Este es el microservicio implementado por **Juan Carlos Cortés Muñoz** y **Mario Ruano Fernández**, integrantes del ms-songs.

En lo que respecta a la funcionalidad que ofrece el microservicio ms-songs, en FastMusik, los usuarios podrán buscar canciones, tanto en el sistema como en Spotify, acceder a los videoclips y letras de estas y hacer like en aquellas canciones que más les gusten.

Otras funcionalidades que derivan de este microservicio son la de generar un listado de canciones favoritas de cada usuario, crear salas de chat entre usuarios con los mismos gustos musicales y notificar al servicio de soporte de incorrecciones en el videoclip de una canción.

### Microservicio de mensajes

Este microservicio ha sido implementado por **Jorge Andrea Molina** y **Félix Jiménez González**.

El modelado de datos de este microservicio se basa en las entidades de Salas y Mensajes, las cuales contienen toda la información para posibilitar las conversaciones entre usuarios del sistema. Este servicio presenta funcionalidades como la recuperación de entidades con paginación, la traducción del texto de los mensajes, las operaciones CRUD de ambas entidades y el reporte de mensajes ofensivos.

Como puntos destacables, el uso de la API externa de DeepL para la traducción y la integración interna para los reportes usando mecanismos de rollback ante fallos.

### Microservicio de soporte

Este microservicio ha sido implementado por **María Elena Molino Peña** y **Alejandro José Muñoz Aranda**

El modelado de datos de este microservicio se basa en las entidades de Tickets y Reports, las cuales contienen toda la información necesaria para mantener el control y el buen funcionamiento del sistema. Este servicio presenta funcionalidades como el envío de notificaciones a los usuarios, las operaciones CRUD con las entidades y la gestión de incidencias.

Como puntos destacables están el uso de la API externa de SendGrid para enviar correos, la tolerancia a fallos desplegando un cliente adicional para la gestión de incidencias y el mecanismo de rollback incluido en la integración con los diferentes microservicios.

## Customer Agreement


### Análisis de la capacidad

El análisis de la capacidad, realizado en conjunto por todos los miembros del equipo, puede encontrarse en la wiki del repositorio destinado al cliente (haga click [aquí](https://github.com/fisg4/client/wiki/An%C3%A1lisis-de-la-capacidad) para leerlo).

### Planes de precios y justificación


## Descripción de la API REST
La API REST se compone de dos entidades principales: **Message**, que representa un mensaje enviado por un usuario, y **Room**, que representa la sala en la que una conversación entre dos usuarios tiene lugar.

Para llevar a cabo la implementación de la API REST, se ha llevado la estructuración de carpetas:

- models → Incluye los modelos de las dos entidades.
- controllers → Donde se implementa la funcionalidad de las dos entidades, recibiendo peticiones y devolviendo respuestas.
- routes → En la que se listan los endpoints de las dos entidades.
- services → Vienen a ser servicios auxiliares que tienen una cierta abstracción con respecto a ambas entidades.

Cada entidad tiene sus rutas asociadas y por consiguiente sus controladores asociados. De esta manera, se pueden recibir peticiones a través del endpoint correspondiente desde el frontend, y se pueden enviar las respuestas correspondientes a dichas llamadas (con el código de estado y el contenido apropiado).

Para más información sobre las rutas existentes, se proporciona la documentación en <a href="https://messages-fastmusik-marmolpen3.cloud.okteto.net/docs/#/">Swagger</a>.

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

Para llevar a cabo la persistencia de datos, se ha utilizado la base de datos no relacional MongoDB. Para la implementación, y utilizando dicha base de datos, se han utilizado tanto un entorno de desarrollo en local como en producción, utilizando MongoDB Atlas.

#### Validación de los datos ✅

La validación de los datos ha venido de la mano de la librería de _Node.js_, **mongoose**. Gracias a esta validación, si se diese el caso en el que existiesen errores en la misma, se notificaría al usuario con un código de estado de **400** (bad request), indicando que se ha realizado una petición incorrecta. 

#### Gestión de código e integración continua ✅

Con respecto a la integración continua, se han configurado dos acciones diferentes:

- Por un lado, una acción para la ejecución de tests con cada push y pull request que se realice.
- Por otro lado, otra acción para que se lleve a cabo un despliegue automático siempre que salgan bien los tests.

Dichas acciones se encuentran implementadas <a href="https://github.com/fisg4/ms-messages/tree/main/.github/workflows">aquí</a>.

#### Imagen de Docker ✅

Se ha creado una imagen de Docker sencilla para realizar el despliegue en Okteto y para el despliegue en local. Para dicha imagen, se ha implementado el siguiente <a href="https://github.com/fisg4/ms-messages/blob/main/okteto.yml">fichero</a>. 

#### Pruebas de componente ✅

El número total de pruebas de componente asciende a una cantidad de  **86**, incluyendo a las entidades de *Message* y de *Room*. Asimismo, se ha conseguido tener una cobertura del 100% del código en cuanto a funciones de controlador y servicios respecta.

Las pruebas de componente se pueden encontrar en:

 - <a href="https://github.com/fisg4/ms-messages/tree/main/tests/controllers">Pruebas de controlador</a>.
 - <a href="https://github.com/fisg4/ms-messages/blob/main/tests/services.test.js">Pruebas de servicio</a>.

#### Pruebas de integración ✅

Con respecto a las pruebas de integración con la base de datos, se han realizado un total de 22 tests (incluyéndose sendos componentes: *Message* y *Room*). Con estos 22 tests, tenemos una covertura total del 100% en las funciones de modelos, que son las encargadas de realizar la comunicación con la base de datos.

Las pruebas de integración con la base de datos se pueden encontrar <a href="https://github.com/fisg4/ms-messages/tree/main/tests/integration">aquí</a>.

#### (Avanzado) Frontend con rutas y navegación ✅

Al tener un frontend común, se han realizado se han utilizado tres rutas principales por parte del microservicio de Message, que son:

- `/chats` <br><p>&emsp;Accediéndose desde la vista en la que se encuentra el listado de likes, es la vista encargada de  de listar todas las salas (*Rooms*) en las que un usuario es partícipe. En el caso de sobrepasar un número de 5 salas en las que el usuario sea partícipe, y la sala deseada no se encuentre en dicha lista, se ha implementado paginación, de manera que puedan obtener las 5 salas siguientes.</p>

- `/chats/:id` <br><p>&emsp;A esta ruta se redirige al acceder a un chat concreto (esto se consigue haciendo click en el mismo). En esta vista, el usuario podrá:
  - Enviar mensajes para el otro participante del chat.
  - Editar sus propios mensajes.
  - Traducir aquellos mensajes que no estén en español por parte del otro usuario.
  - Reportar aquellos mensajes que puedan ser ofensivos.</p>

- `/chats/:id/details` <br><p>&emsp;Accediéndose desde la cabecera de un Chat (i.e. desde la ruta `/chats/:id`), se puede acceder a la vista de detalles de la sala. Desde esta vista, se puede:
  - Ver información de la sala.
  - Ver información sobre la canción a la que hace referencia la sala.
  - Editar el nombre y la descripción de la sala.
  - Eliminar la sala.</p>

Las rutas se pueden encontrar especificadas en el fichero <a href="https://github.com/fisg4/client/blob/main/src/App.js">App.js</a>

#### (Avanzado) Redux ✅

Se ha implementado *Redux* para mantener el estado de:

- El estado de las salas (*Rooms*) del usuario.
- La información sobre la paginación de las salas.
- La información de la sala que se encuentra activa en el momento.

Para ello, se ha importado en el fichero <a href="https://github.com/fisg4/client/blob/89e21f2d909547b731a90c108410bc19da496b0e/src/app/store.js#L16">store.js</a> (que contiene todos los slices de todos los microservicios) <a href="https://github.com/fisg4/client/blob/main/src/messages/slices/roomsSlice.js">el slice correspondiente a nuestro microservicio</a>:

```
const initialState = {
    rooms: [],
    pagination: {
        currentPage: 0,
        totalElements: 0,
        totalPages: 0
    },
    room: null
};

export const roomsSlice = createSlice({
    name: 'rooms',
    initialState,
    reducers: {
        setRooms: (state, action) => {
            state.rooms = action.payload;
        },
        setPagination: (state, action) => {
            state.pagination = action.payload;
        },
        setRoom: (state, action) => {
            state.room = action.payload;
        }
    }
});
```
Una vez declarados los estados y los reducers de *Message*, se pueden hacer uso de ellos en la aplicación para:
- Mantener y recuperar un estado concreto, utilizando `useSelector`. <br><p>Por ejemplo, para recuperar el estado de la *Room*: </p>
```
useSelector(state => state.rooms);
```
- Modificar un estado, utilizando `useDispatch`. <br><p>Nuevamente, con el ejemplo de *Room*:</p>

```
// Declaración del dispatch
const dispatch = useDispatch();

// [...] Operaciones para obtener información necesaria (llamadas a API, etc.).

// Modificación del estado
dispatch(setRoom({ ...room, name, description }))
```

#### (Avanzado) API externa ✅

Se ha implementado el uso de la API externa <a href="https://www.deepl.com/en/docs-api/">DeepL</a>. El uso principal que se le da a dicha API es la traducción de mensajes entrantes por parte de usuarios extranjeros al español. Para ello, se hace uso del método `translateText`, al que se le pasan como parámetros:

- El texto a traducir.
- El idioma del mensaje de entrada (en el caso de ser nulo, la propia API hace la detección automática del idioma del texto entrante).
- El idioma al que se desea traducir el texto.

#### (Avanzado) Mecanismo de autenticación mediante JWT ✅

Se ha implementado un mecanismo de autenticación utilizando <a href="https://www.npmjs.com/package/jsonwebtoken">jsonwebtoken</a> a través de la API Gateway, comentada en la sección de _[API Gateway](##API-Gateway-✅)_. Dicha autenticación viene dada a  través del token de usuario, que es enviado por la cabecera de una request específica.

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

### Félix Jiménez González
El esfuerzo en horas ha sido de aproximadamente 60 horas. El informe de horas se puede consultar <a href="https://drive.google.com/file/d/1xrLUsjkf-wTsxF50v01Hcr6SjNgM0xct/view?usp=sharing">aquí</a>.
