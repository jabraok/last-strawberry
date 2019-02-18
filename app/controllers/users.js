import Controller from '@ember/controller';

export default Controller.extend({
  actions: {
    saveUser(changeset) {
      changeset.save();
    },

    deleteUser(user) {
      user.destroyRecord();
    },

		createNewUser(changeset) {
      const user = this.store.createRecord('user', {
        firstName: changeset.get("firstName"),
        lastName: changeset.get("lastName"),
        email: changeset.get("email"),
        role: changeset.get("role"),
        phone: changeset.get("phone"),
        password: changeset.get("password")
      });
			user.save();
    }
  }
});
