class FilterController {
  constructor(model, view) {
    this._model = model;
    this._view = view;

    view.on('resizeHandler', () => {
      model.resize();
    });
    view.on('resetFilter', () => {
      model.resetFilter();
    });
    view.on('hideFilter', () => {
      model.hideFilter();
    });
    view.on('changeFilterHandler', () => {
      model.filterFlatStart();
    });
    view.on('reduceFilterHandler', flag => {
      model.reduceFilter(flag);
    });
    view.on('changeResultsViewType', value => {
      model.changeResultsViewType(value);
    });
    view.on('changeListScrollBlocked', value => {
      model.changeListScrollBlocked(value);
    });
    view.on('open-filter', value => {
      model.onAfterOpenFilter(value);
    });
  }
}

export default FilterController;
