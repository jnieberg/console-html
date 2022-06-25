(function (console) {
  if (!console || !console.log) {
    return;
  }

  const _appendHiddenElement = (id) => {
    if (!document.getElementById(id)) {
      const buffer = document.createElement("div");
      buffer.setAttribute("id", id);
      buffer.setAttribute("style", "z-index:-1;position:absolute;top:-99999px;left:-99999px;display:none");
      document.body.appendChild(buffer);
    }
    return document.getElementById(id);
  };

  const _camelToKebab = (text) => {
    return text.replace(/([A-Z])/g, "-$1").toLowerCase();
  };

  const _htmlToLog = (text, parent) => {
    parent.innerHTML = text;
    if (parent.data) {
      const styles = window.getComputedStyle(parent.parentElement);
      return [
        `%c${parent.data}`,
        Object.entries(styles)
          // @ts-ignore
          .map(([k, v]) => {
            k = _camelToKebab(k);
            return [k, styles.getPropertyValue(k)];
          })
          // @ts-ignore
          .filter(([k, v]) => v)
          .map(([k, v]) => `${k}:${v};`)
          .join(" "),
      ];
    }
    const children = parent.childNodes;
    const result = [];
    if (children.length) {
      children.forEach((child) => {
        result.push(_htmlToLog(child.innerHTML, child));
      });
    }
    return result.flat();
  };

  const htmlToLog = (obj) => {
    const root = _appendHiddenElement("__consoleHtmlBuffer");
    const text = obj.map((o) => (o instanceof Element ? o.outerHTML : o));
    if (root) {
      const result = _htmlToLog(text, root);
      root.innerHTML = "";
      return [result.filter((_, i) => i % 2 === 0).join(""), ...result.filter((_, i) => i % 2 === 1)];
    }
    return text;
  };

  // @ts-ignore
  console.html = (...text) => {
    console.log(...htmlToLog(text));
    return htmlToLog(text);
  };
})(window.console);
