
class Users {
  constructor() {
    this.users = [];
    }
    addUser (id,name,room) {
      var user = {id, name,room};
      this.users.push(user);
      return user;
    }
    removeUser (id) {
      var user = this.users.filter((user) => user.id==id)[0];
      if(user) {
        this.users = this.users.filter((user) => user.id != id);
      }

     return user;
    }
    removeUserByName (name) {
      var user = this.users.filter((user) => user.name==name)[0];
      if(user) {
        this.users = this.users.filter((user) => user.name != name);
      }
      return user;
    }
    getUser (id) {
      return this.users.filter((user) => user.id == id)[0];

    }
    getUserList (room) {
      var user = this.users.filter((user) => {
        return user.room == room;
      });
      var nameArray = user.map((user) => {
        return user.name;
      });
      return nameArray;
    }
}

module.exports = {Users};
