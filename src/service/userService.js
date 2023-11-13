import mysql from "mysql2/promise";
import bcrypt from "bcryptjs";
import bluebird from "bluebird";
import db from "../models";
import user from "../models/user";
const salt = bcrypt.genSaltSync(10);

//create the connection to database
// const connection = mysql.createConnection({
//     host: '172.29.2.91',
//     user: 'newstage',
//     password: "newstage123#@!",
//     database: "JWT_DB"

// })

const hashUserPassword = (userPassword) => {
  let hashPassword = bcrypt.hashSync(userPassword, salt);
  return hashPassword;
};

const createNewUser = async (email, password, username) => {
  let hashPass = hashUserPassword(password);
  // const connection = await mysql.createConnection({host:'172.29.2.91', user: 'newstage', password: "newstage123#@!", database: 'JWT_DB', Promise: bluebird});

  try {
    // const [rows, fields] = await connection.execute("INSERT INTO USER (email, password, username) VALUE (?, ?, ?)", [email, hashPass, username]);
    await db.USER.create({
      username: username,
      email: email,
      password: hashPass,
    });
  } catch (error) {
    console.log(">>> check error: ", error);
  }

  // connection.query(
  //     'INSERT INTO USER (email, password, username) VALUE (?, ?, ?)', [email, hashPass, username],
  //     function (err, results, fields) {
  //         if(err){
  //             console.log(err)
  //         }
  //     }
  // )
};

const getUserList = async () => {
  //test relationship
  let newUser = await db.USER.findOne({
    where: { id: 3 },
    attributes: ["email"],
    include: { model: db.GROUP, attributes: ["id", "name"] },
    raw: true,
    nest: true,
  });

  //test n - n relationship
  let role = await db.ROLE.findAll({
    include: { model: db.GROUP, where: { id: 1 } },
    raw: true,
    nest: true,
  });

  // let users = []
  // connection.query(
  //     'SELECT * FROM USER',
  //     function (err, results, fields) {
  //         if(err){
  //             console.log(err)
  //         }
  //         console.log("check results: ", results)
  //     }
  // )

  // const connection = await mysql.createConnection({host:'172.29.2.91', user: 'newstage', password: "newstage123#@!", database: 'JWT_DB', Promise: bluebird});
  try {
    // const [rows, fields] = await connection.execute("SELECT * FROM USER");
    // console.log("check row: ", rows)
    // return rows;
  } catch (error) {
    console.log(">>> check error: ", error);
  }

  //ORM
  let users = [];
  users = await db.USER.findAll();
  return users;
};

const deleteUser = async (id) => {
  // const connection = await mysql.createConnection({host:'172.29.2.91', user: 'newstage', password: "newstage123#@!", database: 'JWT_DB', Promise: bluebird});
  // try{
  //     const [rows, fields] = await connection.execute("DELETE FROM USER WHERE id=?", [id]);
  //     return rows;
  // }catch(error){
  //     console.log(">>> check error: ", error)
  // }

  //ORM
  await db.USER.destroy({
    where: { id: id },
  });
};

const getUserById = async (id) => {
  // const connection = await mysql.createConnection({host:'172.29.2.91', user: 'newstage', password: "newstage123#@!", database: 'JWT_DB', Promise: bluebird});
  // try{
  //     const [rows, fields] = await connection.execute("SELECT * FROM USER WHERE id = ?", [id]);
  //     return rows;
  // }catch(error){
  //     console.log(">>> check error: ", error)
  // }
  let user = {};
  user = await db.USER.findOne({
    where: { id: id },
  });
  return user.get({ plain: true });
};

const updateUserInfor = async (email, username, id) => {
  // const connection = await mysql.createConnection({host:'172.29.2.91', user: 'newstage', password: "newstage123#@!", database: 'JWT_DB', Promise: bluebird});
  // try{
  //     const [rows, fields] = await connection.execute("UPDATE USER SET email = ?, username = ? WHERE id = ?", [email, username, id]);
  //     return rows;
  // }catch(error){
  //     console.log(">>> check error: ", error)
  // }
  await db.USER.update(
    { email: email, username: username },
    { where: { id: id } }
  );
};

const testFucn = async (id) => {
  const connection = await mysql.createConnection({
    host: "172.29.2.91",
    user: "newstage",
    password: "newstage123#@!",
    database: "JWT_DB",
    Promise: bluebird,
  });
  try {
    const [rows, fields] = await connection.execute(
      `SELECT TRANSACTION_P35.userBuy, TRANSACTION_P35.averagePrice, U.username, TRANSACTION_MEMBER.MemberEatId, MEMBER_P35.username AS "Thanh vien" FROM TRANSACTION_P35  
        LEFT JOIN USER AS U ON TRANSACTION_P35.userBuy = U.id 
        LEFT JOIN TRANSACTION_MEMBER ON TRANSACTION_P35.id = TRANSACTION_MEMBER.transactionId 
        LEFT JOIN MEMBER_P35 ON MEMBER_P35.id = TRANSACTION_MEMBER.MemberEatId 
        WHERE TRANSACTION_P35.userBuy = ? ORDER BY TRANSACTION_MEMBER.MemberEatId`,
      [id]
    );
    return rows;
  } catch (error) {
    console.log(">>> check error: ", error);
  }
  // let user = {}
  // user = await db.USER.findOne({
  //     where: {id: id}
  // })
  // return user.get({plain: true})
};

module.exports = {
  createNewUser,
  getUserList,
  deleteUser,
  getUserById,
  updateUserInfor,
  testFucn,
};
