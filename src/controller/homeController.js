// connect Mysql by libary mysql2
import userService from "../service/userService";

const handleHelloworld = (req, res) => {
  return res.render("home.ejs");
};

const handleUserPage = async (req, res) => {
  // console.log("cookie:", req.cookies)
  let userList = await userService.getUserList();
  let test = await userService.testFucn("42");
  let arrNew = [];
  let current = {};
  let totalMember = 0;
  for (let i = 0; i < test.length; i++) {
    if (i === 0) {
      current = test[i];
      totalMember = test[i].averagePrice;
    } else if (test[i].MemberEatId === current.MemberEatId) {
      current = test[i];
      totalMember = totalMember + test[i].averagePrice;

      if (i === test.length - 1) {
        current.averagePrice = totalMember;
        arrNew.push(current);
      }
    } else if (test[i].MemberEatId !== current.MemberEatId) {
      current.averagePrice = totalMember;
      arrNew.push(current);

      totalMember = test[i].averagePrice;
      current = test[i];

      if (i === test.length - 1) {
        current.averagePrice = totalMember;
        arrNew.push(current);
      }
    }
  }

  //   for (let i of test) {
  //     console.log(i);
  //   }

  // console.log("check array new: ", arrNew);
  return res.render("user.ejs", { userList });
};

const handleCreateNewUser = (req, res) => {
  // console.log("check response: ", req.body)
  let email = req.body.email;
  let password = req.body.password;
  let username = req.body.username;

  userService.createNewUser(email, password, username);
  // return res.send("handleCreateNewUser")
  return res.redirect("/user");
};

const handleDeleteUser = (req, res) => {
  // userService.deleteUser(id)
  // return res.redirect('/user')
  // console.log("check id: ", req.params.id)
  userService.deleteUser(req.params.id);
  return res.redirect("/user");
};

const getUpdateUserPage = async (req, res) => {
  let id = req.params.id;
  let user = await userService.getUserById(id);
  let userData = {};
  // if(user && user.length > 0){
  //     userData = user[0]
  // }
  userData = user;
  return res.render("user-update.ejs", { userData });
};

const handleUpdateUser = async (req, res) => {
  let email = req.body.email;
  let username = req.body.username;
  let id = req.body.id;
  await userService.updateUserInfor(email, username, id);
  return res.redirect("/user");
};

module.exports = {
  handleHelloworld,
  handleUserPage,
  handleCreateNewUser,
  handleDeleteUser,
  getUpdateUserPage,
  handleUpdateUser,
};
