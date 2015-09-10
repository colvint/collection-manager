Relation = function Relation(collection, selector) {
  this.collection = collection;
  this.selector = selector || {};

  this.allowedOptions = function () {
    return this.collection.find(this.selector).fetch();
  };

  this.allowedIds = function () {
    return _.pluck(this.allowedOptions(), '_id');
  };

  this.relatedValue = function (id) {
    if (!id) return null;

    var relation = this.collection.findOne(id);

    return relation ? relation.name : 'Relation not found';
  };
}
