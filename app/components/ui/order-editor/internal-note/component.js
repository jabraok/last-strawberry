import Ember from "ember";

export default Ember.Component.extend({
    classNames: ["col"],

    actions: {
      noteChanged(e) {
        this.get("model").set("note", e.target.value);
      }
    }
});
