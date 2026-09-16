class Statistics {

  constructor() {
    this.stats = null;
    this.elements = {};

  }

  init_stats() {
    this.stats = createDiv();
    this.stats.id("info_pane");
    this.stats.style("position", "absolute");
    this.stats.style("bottom", "10px");
    this.stats.style("right", "10px");
    this.stats.style("max-height", "90vh");
    this.stats.style("overflow-y", "auto");
    this.stats.style("background", "rgba(20, 20, 20, 0.85)");
    this.stats.style("color", "#fff");
    this.stats.style("font-family", "'Courier New', courier");
    this.stats.style("padding", "12px");
    this.stats.style("border-radius", "8px");
    this.stats.style("box-shadow", "0 4px 10px rgba(0,0,0,0.5)");
    this.stats.style("width", "320px");
    this.stats.style("z-index", "1000");


  }

  update_stat(info_text, variable) {
    let stats_title_text = `${info_text}: ${variable}`;

    if (!this.elements[info_text]) {
      let stats_title = createElement("h2");
      stats_title.parent(this.stats);
      stats_title.style("margin", "0 0 10px 0");
      stats_title.style("font-family", "'Fira Sans Condensed', sans-serif !important");
      stats_title.style("font-size", "16px");
      stats_title.style("color", "white");

      this.elements[info_text] = stats_title;
    }

    this.elements[info_text].html(stats_title_text);
  }

}
