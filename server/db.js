import mysql from "mysql2";
export const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "blog"
})

db.connect((err) => {
    if(err) {
        console.error("MySQL connection failed:", err);
        return;
    }
    console.log("MySQL connected");
})
