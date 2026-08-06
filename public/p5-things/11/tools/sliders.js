class SliderTree {

  constructor(panel_title = "control_panel") {

    this.panel = createDiv();
    this.panel.id("control-panel");
    this.panel.style("position", "absolute");
    this.panel.style("top", "10px");
    this.panel.style("left", "10px");
    this.panel.style("max-height", "90vh");
    this.panel.style("overflow-y", "auto");
    this.panel.style("background", "rgba(20, 20, 20, 0.85)");
    this.panel.style("color", "#fff");
    this.panel.style("font-family", "sans-serif");
    this.panel.style("padding", "12px");
    this.panel.style("border-radius", "8px");
    this.panel.style("box-shadow", "0 4px 10px rgba(0,0,0,0.5)");
    this.panel.style("width", "320px");
    this.panel.style("z-index", "1000");

    let title = createElement("h3", panel_title);
    title.parent(this.panel);
    title.style("margin", "0 0 10px 0");
    title.style("font-size", "16px");
    title.style("color", "4DF");

    this.groups = {};
    this.values = {};

  }

  create_group(group_name, is_open = false) {

    if (this.groups[group_name]) return this.groups[group_name];

    let details = createElement("details");
    details.parent(this.panel);
    details.style("margin-bottom", "8px");
    details.style("border-bottom", "1px solid #444");
    details.style("padding-bottom", "6px");

    if (is_open) details.attribute("open", "");

    let summary = createElement("summary", group_name);

    summary.parent(details);
    summary.style("font-weight", "bold");
    summary.style("cursor", "pointer");
    summary.style("color", "#AEE");
    summary.style("padding", "4px 0");

    let content_div = createDiv();
    content_div.parent(details);
    content_div.style("padding-left", "8px");

    this.groups[group_name] = content_div;

    return content_div;

  }

  add_slider(group, name, min, max, val, step, comment = "") {

    let parent_group = this.create_group(group);

    let row = createDiv();
    row.parent(parent_group);
    row.style("margin", "6px 0");
    row.style("display", "flex");
    row.style("flex-direction", "column");
    row.style("gap", "2px");

    let label_row = createDiv();
    label_row.parent(row);
    label_row.style("display", "flex");
    label_row.style("justify-content", "space-between");
    label_row.style("font-size", "12px");

    let label_span = createSpan(name);
    label_span.parent(label_row);

    let val_span = createSpan(`${val}, ${comment}`);
    val_span.parent(label_row);
    val_span.style("color", "#8F8");

    let ctrl_row = createDiv();
    ctrl_row.parent(row);
    ctrl_row.style("display", "flex");
    ctrl_row.style("gap", "6px");
    ctrl_row.style("align-items", "center");

    let slider = createSlider(min, max, val, step);
    slider.parent(ctrl_row);
    slider.style("flex-grow", "1");

    let input = createInput(val.toString(), "number");
    input.parent(ctrl_row);
    input.size(45);
    input.style('font-family', 'sans-serif');
    input.style("font-size", "11px");

    const key = `${group}.${name}`;
    this.values[key] = { slider, input, val_span, comment };

    const update_val = (v) => {
      slider.value(v);
      input.value(v);
      val_span.html(`${v} (${comment})`);
    };

    input.input(() => update_val(parseFloat(input.value()) || 0));
    slider.input(() => update_val(parseFloat(slider.value())));

  }

  get(group, name) {
    const key = `${group}.${name}`;
    if (this.values[key]) {
      return parseFloat(this.values[key].slider.value());
    }
    return 0;
  }
}
