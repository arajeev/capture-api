# API Documentation
## 1. User
### 1.1 Get all users: [GET] `/user/all`
#### Description
Get all user information.
- Endpoint: `/user/all`
- Authentication: `[Admin]`
-
#### Request:
- Header: `{'Authorization': 'Bearer TOKEN'}`
- Body: `{}`

#### Response:
```javascript
{
    entries: [
        {
            "uid": [INTEGER],
            "first_name": [STRING],
            "last_name": [STRING],
            "email": [STRING],
            "username": [STRING],
            "updatedAt": [STRING],
            "createdAt": [STRING],
            "text": [STRING]
        },
    ]
}
```
#### Response Status Codes:
- Success Code: `{200: 'Success'}`
- Error Code: `{403: 'Forbidden', 404: 'NotFoundError'}`

### 1.2 Get user information: [GET] `/user/:id`
#### Description
Get user information for user with the specified `id`.
- Endpoint: `/user/:id`
    - `id`: identification for the target user.
- Authentication: `[Admin, User]`
    - `token`: User token must be the one assigned to the target user or an admin token.

#### Request:
- Header: `{'Authorization': 'Bearer TOKEN'}`
- Body: `{}`

#### Response:
```javascript
{
    "uid": [INTEGER],
    "first_name": [STRING],
    "last_name": [STRING],
    "email": [STRING],
    "username": [STRING],
    "updatedAt": [STRING],
    "createdAt": [STRING]
}
```
#### Response Status Codes:
- Success Code: `{200: 'Success'}`
- Error Code: `{403: 'Forbidden', 404: 'NotFoundError'}`

### 1.3 Create a user: [POST] `/user/create`
#### Description
Creates a new user.
- Endpoint: `/user/create`
- Authentication: `[Admin]`

#### Request:
- Header: `{'Authorization': 'Bearer TOKEN'}`
- Body:
```javascript
{
    "first_name": [STRING],
    "last_name": [STRING],
    "email": [STRING],
    "username": [STRING],
    "password": [STRING]
}
```

#### Response:
```javascript
{
    "id": [INTEGER],
    "first_name": [STRING],
    "last_name": [STRING],
    "email": [STRING],
    "username": [STRING],
    "updatedAt": [STRING],
    "createdAt": [STRING]
}
```
#### Response Status Codes:
- Success Code: `{201: 'Created'}`
- Error Code: `{403: 'Forbidden', 409: 'ConflictError'}`

### 1.4 Delete a user: [DEL] `/user/delete/:id`
#### Description
Deletes the user with the given `id`.
- Endpoint: `/user/delete/:id`
- Authentication: `[Admin, User]`

#### Request:
- Header: `{'Authorization': 'Bearer TOKEN'}`
- Params: `id` of the user to be deleted.
- Body: `{}`

#### Response:
- body: `{}`
#### Response Status Codes:
- Success Code: `{204: 'NoContent'}`
- Error Code: `{403: 'Forbidden', 404: 'NotFoundError'}`

## 2. Entries
### 2.1 List all journal entries for current user: [GET] `/journal/:uid/entries`
#### Description
- Endpoint: `/journal/all/:uid`
    -- `userId` is the id of the user whose lists are being requested
- Authentication: `[Admin, User]`

#### Request:
- Header: `{'Authorization': 'Bearer TOKEN'}`
- Body: `{}`

#### Response:
```javascript
{
    entries: [
        {
            "eid": [INTEGER],
            "heading": [STRING],
            "date": [STRING],
            "time": [STRING],
            "uid": [INTEGER],
            "media": [STRING],
            "location": [STRING],
            "updatedAt": [STRING],
            "createdAt": [STRING],
            "text": [STRING]
        },
    ]
}
```
#### Response Status Codes:
- Success Code: `{200: 'Success'}`
- Error Code: `{403: 'Forbidden'}`

### 2.2 View a user: [GET] `/journal/:userId/entry/:entryId`
#### Description
Get entry with the specified `entryid` from user with the specified `id`.
- Endpoint: `/journal/:userId/entries/:entryId`
    - `userId`: identification for the target user.
    - `listId`: identification for the target list.
- Authentication: `[Admin, User]`
    - `token`: User token must be the one assigned to the target user or an admin token.

#### Request:
- Header: `{'Authorization': 'Bearer TOKEN'}`
- Body: `{}`

#### Response:
```javascript
     {
        "eid": [INTEGER],
        "heading": [STRING],
        "date": [STRING],
        "time": [STRING],
        "uid": [INTEGER],
        "media": [STRING],
        "location": [STRING],
        "updatedAt": [STRING],
        "createdAt": [STRING],
        "text": [STRING]
    }
```
#### Response Status Codes:
- Success Code: `{200: 'Success'}`
- Error Code: `{403: 'Forbidden', 404: 'NotFoundError'}`

### 2.3 Create an entry: [POST] `/journal/:userId/list/create`
#### Description
Creates a new list.
- Endpoint: `/journal/:userId/create`
    - `userId`: identification for the target user.
- Authentication: `[Admin, User]`

#### Request:
- Header: `{'Authorization': 'Bearer TOKEN'}`
- Body:
```javascript
{
    "heading": [STRING],
    "date": [STRING],
    "time": [STRING],
    "media": [STRING],
    "location": [STRING],
    "text": [STRING]
}
```

#### Response:
```javascript
 {
    "eid": [INTEGER],
   "heading": [STRING],
    "date": [STRING],
    "time": [STRING],
    "uid": [INTEGER],
    "media": [STRING],
    "location": [STRING],
    "updatedAt": [STRING],
    "createdAt": [STRING],
    "text": [STRING]
}
```
#### Response Status Codes:
- Success Code: `{201: 'Created'}`
- Error Code: `{403: 'Forbidden', 409: 'ConflictError'}`

### 2.4 Delete an entry: [DEL] `/journal/user/:userId/entries/:listId`
#### Description
Deletes the entry with the given `id`.
- Endpoint: `/journal/:userId/list/:listId`
    - `userId`: identification for the target user.
    - `listId`: identification for the target list.
- Authentication: `[Admin, User]`

#### Request:
- Header: `{'Authorization': 'Bearer TOKEN'}`
- Params: `id` of the user to be deleted.
- Body: `{}`

#### Response:
- body: `{}`
#### Response Status Codes:
- Success Code: `{204: 'NoContent'}`
- Error Code: `{403: 'Forbidden', 404: 'NotFoundError'}`
