# Messages microservice

**URL**: chat/api/\<VERSION\>

## Schema

### Room

![image](https://user-images.githubusercontent.com/56023983/201470559-8864be20-5cd3-49e9-bc36-9cc38e744ebe.png)

#### CRUD

- (CREATE) Create room
- (READ) Get room
- (UPDATE) Add/remove participants
- (DELETE) Delete room

#### Room routes

- GET /rooms
- GET /rooms/:id
- POST /rooms
- PATCH /rooms/:id/participants
- DELETE /rooms/:id

### Message

![image](https://user-images.githubusercontent.com/56023983/201470722-15e999d8-0baf-4900-9e51-8f7164391299.png)

#### Message routes

- GET /messages
- POST /messages
- PATCH /messages/:id
