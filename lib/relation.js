Relation = function Relation(collectionName, selector) {
  this.collectionName = collectionName;
  this.selector       = selector || {};

  this.collection = function () {
    var globalObject = typeof(global) === 'undefined' ? window : global;
    return globalObject[this.collectionName];
  };

  this.allowedOptions = function () {
    return this.collection().find(this.selector).fetch();
  };

  this.allowedIds = function () {
    return _.pluck(this.allowedOptions(), '_id');
  };
}
