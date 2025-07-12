# Complete API Endpoints for Postman Testing

Replace `<BASE_URL>` with your server URL (e.g., `http://localhost:3000`).

---

## AUTH

### Signup (User)
POST `<BASE_URL>/api/auth/signup`
```json
{
  "username": "normaluser",
  "email": "normaluser@example.com",
  "password": "yourpassword"
}
```

### Signup (Guest)
POST `<BASE_URL>/api/auth/signup`
```json
{
  "username": "guestuser",
  "role": "guest"
}
```

### Login (User)
POST `<BASE_URL>/api/auth/login`
```json
{
  "email": "normaluser@example.com",
  "password": "yourpassword"
}
```

### Login (Guest)
POST `<BASE_URL>/api/auth/login`
```json
{
  "username": "guestuser",
  "role": "guest"
}
```

### Get My Profile
GET `<BASE_URL>/api/auth/me`
Headers: `Authorization: Bearer <token>`

### Update My Profile
PUT `<BASE_URL>/api/auth/profile`
Headers: `Authorization: Bearer <token>`
```json
{
  "username": "newusername",
  "avatar": "https://your-avatar-url.com/avatar.png"
}
```

---

## USERS

### Get User Profile
GET `<BASE_URL>/api/users/<userId>`

### Get User's Questions
GET `<BASE_URL>/api/users/<userId>/questions`

### Get User's Answers
GET `<BASE_URL>/api/users/<userId>/answers`

---

## QUESTIONS

### Get All Questions
GET `<BASE_URL>/api/questions`

### Get Single Question
GET `<BASE_URL>/api/questions/<questionId>`

### Create Question (User/Admin Only)
POST `<BASE_URL>/api/questions`
Headers: `Authorization: Bearer <token>`
```json
{
  "title": "Sample Question Title",
  "body": "Question details go here.",
  "tags": ["tag1", "tag2"]
}
```

### Update Question (User/Admin Only)
PUT `<BASE_URL>/api/questions/<questionId>`
Headers: `Authorization: Bearer <token>`
```json
{
  "title": "Updated Title",
  "body": "Updated details.",
  "tags": ["tag1", "tag3"]
}
```

### Delete Question (User/Admin Only)
DELETE `<BASE_URL>/api/questions/<questionId>`
Headers: `Authorization: Bearer <token>`

### Get Popular Tags
GET `<BASE_URL>/api/questions/tags`

---

## ANSWERS

### Create Answer (User/Admin Only)
POST `<BASE_URL>/api/answers`
Headers: `Authorization: Bearer <token>`
```json
{
  "questionId": "<questionId>",
  "body": "This is my answer."
}
```

### Update Answer (User/Admin Only)
PUT `<BASE_URL>/api/answers/<answerId>`
Headers: `Authorization: Bearer <token>`
```json
{
  "body": "Updated answer."
}
```

### Delete Answer (User/Admin Only)
DELETE `<BASE_URL>/api/answers/<answerId>`
Headers: `Authorization: Bearer <token>`

### Vote Answer
POST `<BASE_URL>/api/answers/<answerId>/vote`
Headers: `Authorization: Bearer <token>`
```json
{
  "vote": "up" // or "down"
}
```

### Accept Answer
POST `<BASE_URL>/api/answers/<answerId>/accept`
Headers: `Authorization: Bearer <token>`

---

## NOTIFICATIONS

### Get My Notifications
GET `<BASE_URL>/api/notifications`
Headers: `Authorization: Bearer <token>`

### Get Unread Count
GET `<BASE_URL>/api/notifications/unread-count`
Headers: `Authorization: Bearer <token>`

### Mark All as Read
PUT `<BASE_URL>/api/notifications/read-all`
Headers: `Authorization: Bearer <token>`

### Mark Single as Read
PUT `<BASE_URL>/api/notifications/<notificationId>/read`
Headers: `Authorization: Bearer <token>`

### Delete Notification
DELETE `<BASE_URL>/api/notifications/<notificationId>`
Headers: `Authorization: Bearer <token>`

---

## ADMIN (Admin Only)

### Get Dashboard Stats
GET `<BASE_URL>/api/admin/stats`
Headers: `Authorization: Bearer <admin token>`

### Get All Users
GET `<BASE_URL>/api/admin/users`
Headers: `Authorization: Bearer <admin token>`

### Get All Questions
GET `<BASE_URL>/api/admin/questions`
Headers: `Authorization: Bearer <admin token>`

### Ban/Unban User
PUT `<BASE_URL>/api/admin/users/<userId>/ban`
Headers: `Authorization: Bearer <admin token>`

### Delete Question
DELETE `<BASE_URL>/api/admin/questions/<questionId>`
Headers: `Authorization: Bearer <admin token>`

### Delete Answer
DELETE `<BASE_URL>/api/admin/answers/<answerId>`
Headers: `Authorization: Bearer <admin token>`

---

## UPLOADS

### Upload Image
POST `<BASE_URL>/api/upload/image`
Headers: `Authorization: Bearer <token>`
Body: form-data, key=`image`, type=`File`

### Delete Image
DELETE `<BASE_URL>/api/upload/image/<publicId>`
Headers: `Authorization: Bearer <token>`

---

## Notes
- Guest users can only use GET endpoints (view only).
- Replace `<token>` with the JWT received from login/signup.
- Replace `<questionId>`, `<answerId>`, `<userId>`, `<notificationId>`, `<publicId>` with actual IDs.
- For all protected routes, always include the Authorization header.
- For file uploads, use form-data in Postman.
