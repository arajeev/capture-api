# API Documentation
## 1. User
### 1.1 Get all users: [GET] `/user/all`
#### Description
Get all user information.
- Endpoint: `/user/all`
- Authentication: `[Admin]`
- Only the admin user can get all user information.

#### Request:
- Header: `{'Authorization': 'Basic TOKEN'}`
- Body: `{}`

#### Response:
```javascript
{
    users: [
        {
            "uid": [INTEGER],
            "first_name": [STRING],
            "last_name": [STRING],
            "email": [STRING],
            "username": [STRING],
            "updatedAt": [STRING],
            "createdAt": [STRING],
            "text": [STRING],
            "token": [STRING],
            "group": [STRING]
        },
    ]
}
```
#### Response Status Codes:
- Success Code: `{200: 'Success'}`
- Error Code: `{403: 'Unauthorized', 401: 'NotFoundError'}`

### 1.2 Get user information: [GET] `/user/:id`
#### Description
Get user information for user with the specified `id`.
- Endpoint: `/user/:id`
    - `id`: identification for the target user.
- Authentication: `[Admin, User]`
- Admins can access all information. Users can only access their own ids.

#### Request:
- Header: `{'Authorization': 'Basic TOKEN'}`
- Body: `{}`

#### Response:
```javascript
{
    "uid": [INTEGER],
    "first_name": [STRING],
    "last_name": [STRING],
    "email": [STRING],
    "username": [STRING],
    "password": [STRING],
    "token": [STRING],
    "updatedAt": [STRING],
    "createdAt": [STRING],
    "group": [STRING]
}
```
#### Response Status Codes:
- Success Code: `{200: 'Success'}`
- Error Code: `{401: 'Unauthorized', 404: 'NotFoundError'}`

### 1.3 Create a user: [POST] `/user/create`
#### Description
Creates a new user.
- Endpoint: `/user/create`
- Authentication: `[Admin]`
- Only Admins can create new users.

#### Request:
- Header: `{'Authorization': 'Basic TOKEN'}`
- Body:
```javascript
{
    "first_name": [STRING],
    "last_name": [STRING],
    "email": [STRING],
    "username": [STRING],
    "password": [STRING],
    "group": [STRING]
}
```

#### Response:
```javascript
{
    "uid": [INTEGER],
    "first_name": [STRING],
    "last_name": [STRING],
    "email": [STRING],
    "username": [STRING],
    "password": [STRING],
    "token": [STRING],
    "updatedAt": [STRING],
    "createdAt": [STRING],
    "group": [STRING]
}
```
#### Response Status Codes:
- Success Code: `{201: 'Created'}`
- Error Code: `{401: 'Unauthorized', 409: 'ConflictError'}`

### 1.4 Delete a user: [DEL] `/user/delete/:id`
#### Description
Deletes the user with the given `id`.
- Endpoint: `/user/delete/:id`
- Authentication: `[Admin, User]`

#### Request:
- Header: `{'Authorization': 'Basic TOKEN'}`
- Params: `id` of the user to be deleted.
- Admin can delete anyone, user can delete their own info.
- Body: `{}`

#### Response:
- body: `{}`
#### Response Status Codes:
- Success Code: `{204: 'Deleted'}`
- Error Code: `{403: 'Unauthorized', 404: 'NotFoundError'}`

### 1.5 Login: [POST] `/user/login`
#### Description
Login the user.
- Endpoint: `/user/login`
- Authentication:

#### Request:
- Header: `{'Authorization': 'Basic TOKEN'}`
- Params: `id` of the user that is logging in.
- Body: {}

#### Response:
- body: `{}`
#### Response Status Codes:
- Success Code: `{200: 'OK'}`
- Error Code: `{401: 'Unauthorized'}`

## 2. Entries
### 2.1 List all journal entries for current user: [GET] `/journal/:uid/entries`
#### Description
- Endpoint: `/journal/:uid/entries`
    -- `userId` is the id of the user whose entries are being requested
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
    - `entryId`: identification for the target entry.
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

### 2.3 Create an entry: [POST] `/journal/:userId/create`
#### Description
Creates a new entry.
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

### 2.4 Delete an entry: [DEL] `/journal/user/:userId/entries/:entryId`
#### Description
Deletes the entry with the given `id`.
- Endpoint: `/journal/:userId/entries/:entryId`
    - `userId`: identification for the target user.
    - `entryId`: identification for the target entry.
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
