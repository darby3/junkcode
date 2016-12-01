# README

## TODO: Figure out docker

## Docker

### Run a mysql instance via docker

```
docker run --name some-mysql -v $PWD/datadir:/var/lib/mysql -p 3306:3306 -e MYSQL_ROOT_PASSWORD=my-secret-pw -d mysql
```

### Access it (command line)

```
docker exec -it some-mysql bash
```

### Update the config file to point at it, wherever it may be...


