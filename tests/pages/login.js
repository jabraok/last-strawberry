import {
  clickable,
  fillable,
  text,
  visitable,
  create
} from "ember-cli-page-object";

export default create({
  visit: visitable('/login'),
  username: fillable('.username'),
  password: fillable('.password'),
  clickSubmit: clickable(".submit"),
  errorMessage: text('.error')
});
