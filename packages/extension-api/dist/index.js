'use strict';

// src/constants.ts
var EventType = /* @__PURE__ */ ((EventType2) => {
  EventType2["RenderList"] = "RenderList";
  EventType2["RenderMarkdown"] = "RenderMarkdown";
  return EventType2;
})(EventType || {});

// src/clipboard.ts
var clipboard = {
  async writeText(text) {
  }
};

// src/renderList.ts
function renderList(items) {
  postMessage({
    type: "RenderList" /* RenderList */,
    items
  });
}

// src/renderMarkdown.ts
function renderMarkdown(text) {
  postMessage({
    type: "RenderMarkdown" /* RenderMarkdown */,
    content: text
  });
}

// src/index.ts
var input = "TODO";

exports.EventType = EventType;
exports.clipboard = clipboard;
exports.input = input;
exports.renderList = renderList;
exports.renderMarkdown = renderMarkdown;
//# sourceMappingURL=out.js.map
//# sourceMappingURL=index.js.map