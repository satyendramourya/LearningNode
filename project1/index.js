const express = require('express');
const fs = require('fs');
const app = express();
const port = 3000;
const users = require("./MOCK_DATA.json");


app.use(express.urlencoded({ extended: false }));

// server side rendering of all users req.
app.get("/users", (req, res) => {
    const html = `
    <style>
        table {
            border-collapse: collapse;
            width: 100%;
        }
        
        th, td {
            text-align: left;
            padding: 8px;
        }
        
        th {
            background-color: #f2f2f2;
        }
        
        tr:nth-child(even) {
            background-color: #f2f2f2;
        }
    </style>
    <table>
        <tr>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Email</th>
            <th>Gender</th>
            <th>Job Title</th>
        </tr>

        ${users.map((user) =>
        `<tr>
                <td>${user.first_name}</td>
                <td>${user.last_name}</td>
                <td>${user.email}</td>
                <td>${user.gender}</td>
                <td>${user.job_title}</td>
            </tr>`
    ).join('')}
    </table>
    `;

    return res.send(html);
});

// raw data response - JSON
app.get("/api/users", (req, res) => {
    return res.json(users)
});


// app.get("/api/users/:id", (req, res) => {
//     const id = Number(req.params.id);
//     const user = users.find((user) => user.id === id);
//     return res.json(user)
// });

app.post("/api/users", (req, res) => {
    const body = req.body;
    users.push({...body, id: users.length+1});
    fs.writeFile("./MOCK_DATA.json", JSON.stringify(users), (err, data) => {
        return res.json({ status: "200, added successfully" });
    })
});

// app.patch("/api/users/:id", (req, res) => {
//     return res.json({ status: "pending" });
// });

// app.delete("/api/users/:id", (req, res) => {
//     return res.json({ "status": "pending" });
// });


// grouping of the routes.
app.route("/api/users/:id")
    .get((req, res) => {
        const id = Number(req.params.id);
        const user = users.find((user) => user.id === id);
        return res.json(user)
    }).patch((req, res) => {
        const id = Number(req.params.id);
        const body = req.body;
        const userIndex = users.findIndex((user) => user.id === id);
        if (userIndex !== -1) {
            users[userIndex] = { ...userIndex, ...body };
            fs.writeFile("./MOCK_DATA.json", JSON.stringify(users), (err, data) => {
                return res.json({ status: "200, updated successfully" });
            })
        } else {
            return res.json({ status: "404, user not found" });
        }
    }).delete((req, res) => {
        
        const id = Number(req.params.id);
        const userIndex = users.findIndex((user) => user.id === id);
        if (userIndex !== 1) {
            users.splice(userIndex, 1);
            fs.writeFile("./MOCK_DATA.json", JSON.stringify(users), (err, data) => {
                return res.json({ status: "200, deleted successfully" });
            })
        } else {
            return res.json({ status: "200, deleted successfully" });
        }
    })


app.listen(port, () => {
    console.log(`server is running on port ${port}`);
})