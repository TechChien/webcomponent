const template = document.createElement("template");
template.innerHTML = `
  <div id='root' style="display:flex;align-items:center;">
    <div id="dateContainer">
      <input type="text" id="inputDate" class="form-control" placeholder="yyyy/mm/dd">
    </div>
    <slot name="icon"></slot>
  </div>
`;

class CustomDatePicker extends HTMLElement {
  constructor() {
    super();
    this.root = this.attachShadow({ mode: "open" });
    // shadowRoot shields the web component from external styling, mostly
    let clone = template.content.cloneNode(true);
    this.root.append(clone);
  }

  static observedAttributes = ["lan"];

  connectedCallback() {
    this.init(this.getAttribute("lan"));
    this._value = "";
  }

  init(lan) {
    this.customInput = this.root.querySelector("#inputDate");

    $(this.customInput).datepicker({
      language: lan, //设置语言
      autoclose: true, //选择后自动关闭
      clearBtn: true, //清除按钮
      format: "yyyy-mm-dd", //日期格式
      container:  this.root.querySelector("#dateContainer");
    });

    this.icon = this.root.querySelector("slot[name='icon']");
    $(this.icon).click(() => {
      $(this.customInput).datepicker("show");
    });

    this._value = "";
  }

  get value() {
    return $(this.customInput)
      .data("datepicker")
      .getFormattedDate("yyyy-mm-dd");
  }

  set value(v) {
    this._value = v;
  }

  attributeChangedCallback(name, _, newLan) {
    if (name === "lan") {
      $(this.root.querySelector("#inputDate")).datepicker("destroy");
      this.init(newLan);
    }
  }
}

customElements.define("input-date", CustomDatePicker);
