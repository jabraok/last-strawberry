import Ember from "ember";
import computed from "ember-computed-decorators";

const {
  and,
  notEmpty
} = Ember.computed;

export default Ember.Component.extend({
  localStorage: Ember.inject.service(),

  classNames: ["col", "card-1"],
  classNameBindings: ["shouldDisplay::hidden"],
  hasData:       notEmpty("salesData"),
  hasItem:       notEmpty("item"),
  shouldDisplay: and("hasData", "hasItem"),
  page:"sales_orders",
  isHidden:true,

  async willRender(){
    let isHidden = await this.get("localStorage").getItem(this.get("LSKey"));
    if(!Ember.isPresent(isHidden)){
      isHidden = true;
    }
      this.set("isHidden", isHidden);
  },

  init() {
    this.salesDataStream = new Rx.Subject();

    this.salesDataStreamSubscription = this.salesDataStream
      .debounce(500)
      .subscribe(salesData => {
        this.set("debouncedData", salesData);
      });

      this._super();
  },

  didReceiveAttrs() {
    this.salesDataStream.onNext(this.get("salesData"));
  },

  willDestroy() {
    this.salesDataStreamSubscription.dispose();
  },

  @computed("page")
  LSKey(page){
    return page + "_item_location_sales_trend_is_close";
  },

  @computed("debouncedData.@each.{previous_ending,ending,returns,sold,starting,ts}")
  chartData(salesData = []){
    return {
      labels: salesData.map(sd => moment.unix(sd.ts).format("MM-DD")),
      datasets: [
        {
          label: "Sold",
          fillColor: "rgba(220,220,220,0)",
          strokeColor: "rgba(0,179,221,0.8)",
          pointColor: "rgba(0,179,221,1)",
          pointStrokeColor: "#fff",
          pointHighlightFill: "#fff",
          pointHighlightStroke: "rgba(220,220,220,1)",
          data: salesData.map(sd => sd.sold)
        },
        {
          label: "Previous Ending",
          fillColor: "rgba(151,187,205,0)",
          strokeColor: "rgba(151,187,205,0.8)",
          pointColor: "rgba(151,187,205,1)",
          pointStrokeColor: "#fff",
          pointHighlightFill: "#fff",
          pointHighlightStroke: "rgba(151,187,205,1)",
          data: salesData.map(sd => sd.previous_ending)
        },
        {
          label: "Returned",
          fillColor: "rgba(151,187,205,0)",
          strokeColor: "rgba(255,100,108,0.8)",
          pointColor: "rgba(255,100,108,1)",
          pointStrokeColor: "#fff",
          pointHighlightFill: "#fff",
          pointHighlightStroke: "rgba(151,187,205,1)",
          data: salesData.map(sd => sd.returns)
        }
      ]
    }
  },

  actions: {
    toggleOpenClose(){
      this.set("isHidden", !this.get("isHidden"));
      this.get("localStorage").setItem(this.get("LSKey"), this.get("isHidden"));
    }
  }
});
