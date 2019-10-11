Node.js, Express & MongoDB: Simple Add, Edit, Delete, View (CRUD)
========

A simple and basic CRUD application (Create, Read, Update, Delete) using Node.js, Express, MongoDB & EJS Templating Engine.

**Start MongoDB server**

```
sudo service mongod start
```

**Check MongoDB server status**

```
sudo service mongod status
```

**Go to MongoDB shell**

```
mongod
```

**Show databases**

```
show dbs
```

**Create database named "test"**

```
use test
```

**Create collection(table) named "users"**

```
> db.crud.insert({btsid:"KL01234",bsc:12345, name:"kakkand"})
```

**Query collection**

```
>  db.crud.find().pretty()
{
        "_id" : ObjectId("5da037ea55e66bb5ee7ba008"),
        "btsid" : "KL01234",
        "bsc" : 12345,
        "name" : "kakkand"
}
```
**Running the app in localhost:3000**

```
node app.js
```