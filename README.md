# Indorse Application - Authentication Wizard

This project developed for Indorse Hiring.


### Documentetion (Postman)

https://documenter.getpostman.com/view/5560754/Rzfnj6mk

### Installing

This application using PostgreSQL Server. You should be import a sql file to database on this path : ./sql/public.sql

After then, edit to Database settings in ./config.ini

```
[database_linux]
host = localhost
port = 5432
user = postgres
password = pass
database = dbname
```

If you are on Windows, you should edit this block

```
[database_windows]
host = localhost
port = 5432
user = postgres
password = dbpass
database = dbname
```
And set to Domain, IP or Port on this config file.

```
[server]
domain = 127.0.0.1
ip = 127.0.0.1
port = 1923
https_port = 1924
version = 0.1
```

Finally you can type this commands on shell/cmd (You must be in project root folder)
```
npm install
node server.js
```

## Versioning

--

## Authors

* **Volkan MUHTAR** - *Initial work* - [volconus](https://github.com/volconus)

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
