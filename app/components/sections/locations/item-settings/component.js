import Component from '@ember/component';
import { toPercentage } from "last-strawberry/utils/math";

export default Component.extend({
  classNames: ["item-desires", "col", "wrap"],
  massCreditRate: "",
  massDesire: false,

  actions:{
    massApplyCreditRate(){
      this.get("massApplyCreditRate")(toPercentage(this.get("massCreditRate")));
      this.set("massCreditRate", "");
    },

    massApplyDesire() {
      const massDesire = !this.get("massDesire");
      this.set("massDesire", massDesire);
      this.get("massApplyDesire")(massDesire);
    }
  }
});
