# Test dev

Nodejs + Graph + MongoDb

## Installation

docker build -t test .

```bash
docker build -t test .
docker run -p 3000:3000 --env-file .env test
```

## Create

```sql
mutation {
  createTicket(user: "Usuario", title: "Título del ticket", description: "Descripción del ticket") {
    _id
    user
    title
    description
    createdAt
    updatedAt
    status
  }
}
```

## Get all

```sql
query {
  getAllTickets(limit: 10, offset: 0) {
    _id
    user
    title
    description
    createdAt
    updatedAt
    status
  }
}
```

## Get id

```sql
query {
  getTicket(id: "65d3a3c56cfe98a618074d67") {
    _id
    user
    title
    description
    createdAt
    updatedAt
    status
  }
}
```

## Update status

```sql
mutation {
    updateTicketStatus(id: "65d3a3c56cfe98a618074d67", status: "nuevo") {
        _id
        user
        title
        description
        createdAt
        updatedAt
        status
    }
}
```

## License

[MIT](https://choosealicense.com/licenses/mit/)
