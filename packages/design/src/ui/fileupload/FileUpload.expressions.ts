import { createSignals } from "../../utils/SignalManager";
import type { FileUploadArgs, FileUploadSignals } from "./FileUpload.types";
import { renderFileTypeIcons } from "./FileUploadIcons";

/**
 * Datastar-Expressions und Client-Controller des File-Uploads.
 * Interne Datei: wird bewusst nicht über index.ts exportiert.
 *
 * File-Objekte lassen sich nicht in Signalen halten. Deshalb steckt die Logik in einem kleinen Controller
 * (`document.getElementById(id)._fu`), den `data-init` am Root erzeugt. Der Quelltext des Controllers wird
 * Base64-kodiert in die Expression eingebettet: Die Datastar-Expression bleibt so ein einziger Ausdruck ohne
 * Semikolon, den auch ein Expression-Parser nicht zerlegen kann.
 */

export const DEFAULT_FILE_UPLOAD_LABEL = "File upload";
export const DEFAULT_FILE_UPLOAD_FIELD_NAME = "file";
export const DEFAULT_PROGRESS_SIZE = 40;

/** Methoden des Controllers, die als Event-Handler verwendet werden */
export type FileUploadHandlerMethod =
  | "onDropzoneClick"
  | "onDragEnter"
  | "onDragOver"
  | "onDragLeave"
  | "onDrop"
  | "onPaste"
  | "onKeyDown"
  | "onTriggerClick"
  | "onListClick"
  | "onClearClick";

/** Initialer Signal-State */
export const fileUploadInitialSignals: FileUploadSignals = { dragging: false, invalid: false, count: 0 };

/** Signal-Manager (Signal-Name = ID mit "-" zu "_") */
export const fileUploadSignals = (id: string, invalid = false) =>
  createSignals<FileUploadSignals>(id, { ...fileUploadInitialSignals, invalid });

/** DOM-IDs der Teile, abgeleitet von der Root-ID */
export function fileUploadIds(id: string) {
  return { input: `${id}-input`, dropzone: `${id}-dropzone`, list: `${id}-list`, label: `${id}-label` };
}

/** Bedingung "mindestens eine Datei" für data-show */
export function buildHasFilesCondition(id: string): string {
  return `${fileUploadSignals(id).signal("count")} > 0`;
}

/** Event-Handler: ruft eine Methode des Controllers auf (kein Fehler, solange der Controller fehlt) */
export function buildFileUploadHandler(id: string, method: FileUploadHandlerMethod): string {
  return `document.getElementById(${JSON.stringify(id)})._fu?.${method}(evt)`;
}

/** Reaktive Attribute der Dropzone (data-dragging, data-invalid, aria-invalid) */
export function buildDropzoneBindings(id: string) {
  const s = fileUploadSignals(id);
  return {
    "data-attr:data-dragging": `${s.signal("dragging")} ? '' : null`,
    "data-attr:data-invalid": `${s.signal("invalid")} ? '' : null`,
    "data-attr:aria-invalid": `${s.signal("invalid")} ? 'true' : 'false'`,
  };
}

/**
 * Quelltext des Controllers (Funktionskörper mit den Parametern `el`, `cfg`, `sig`).
 * Darf keine Backticks und keine Template-Platzhalter enthalten (steht in einem Template-String).
 */
const CONTROLLER_SOURCE = String.raw`
if (el._fu) return el._fu;
const id = cfg.id;
const input = document.getElementById(id + "-input");
const files = new Map();
const urls = new Map();
const pending = new Map();
let frame = 0;
let counter = 0;
let invalidTimer = 0;
const validate = cfg.validate || (() => null);

const fire = (name, detail) => {
  el.dispatchEvent(new CustomEvent("file-upload-" + name, { bubbles: true, detail: detail }));
};
const getFiles = () => Array.from(files.values()).map((st) => st.file);

const formatBytes = (bytes) => {
  if (bytes === 0) return "0 B";
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), sizes.length - 1);
  return (bytes / Math.pow(1024, i)).toFixed(i ? 1 : 0) + " " + sizes[i];
};

const iconName = (file) => {
  const type = file.type;
  const ext = (file.name.split(".").pop() || "").toLowerCase();
  if (type.startsWith("video/")) return "video";
  if (type.startsWith("audio/")) return "audio";
  if (type.startsWith("text/") || ["txt", "md", "rtf", "pdf"].includes(ext)) return "text";
  if (["html", "css", "js", "jsx", "ts", "tsx", "json", "xml", "php", "py", "rb", "java", "c", "cpp", "cs"].includes(ext)) return "code";
  if (["zip", "rar", "7z", "tar", "gz", "bz2"].includes(ext)) return "archive";
  if (["exe", "msi", "app", "apk", "deb", "rpm"].includes(ext) || type.startsWith("application/")) return "cog";
  return "file";
};

const release = (file) => {
  const url = urls.get(file);
  if (url) {
    URL.revokeObjectURL(url);
    urls.delete(file);
  }
};

const previewNode = (file) => {
  if (file.type.startsWith("image/")) {
    let url = urls.get(file);
    if (!url) {
      url = URL.createObjectURL(file);
      urls.set(file, url);
    }
    const img = document.createElement("img");
    img.src = url;
    img.alt = file.name;
    img.className = "size-full object-cover";
    return img;
  }
  const tpl = document.createElement("template");
  tpl.innerHTML = cfg.icons[iconName(file)];
  return tpl.content.firstElementChild;
};

const statusText = (st) =>
  st.error ? "Error: " + st.error : st.status === "uploading" ? "Uploading: " + st.progress + "% complete" : st.status === "success" ? "Upload complete" : "Ready to upload";

const paint = (st) => {
  const item = st.el;
  if (!item) return;
  const base = item.id;
  const nameId = base + "-name";
  const describedBy = [nameId, base + "-size", base + "-status"];
  if (st.error) describedBy.push(base + "-message");
  item.setAttribute("aria-describedby", describedBy.join(" "));
  item.querySelectorAll("[data-file-upload-field]").forEach((field) => {
    const key = field.getAttribute("data-file-upload-field");
    if (key === "name") field.textContent = st.file.name;
    if (key === "size") field.textContent = formatBytes(st.file.size);
    if (key === "status") field.textContent = statusText(st);
    if (key === "message") {
      field.textContent = st.error || "";
      field.hidden = !st.error;
    }
  });
  item.querySelectorAll('[data-slot="file-upload-progress"]').forEach((pg) => {
    pg.setAttribute("aria-valuenow", st.progress);
    pg.setAttribute("aria-valuetext", st.progress + "%");
    const bar = pg.querySelector("[data-file-upload-progress-bar]");
    if (bar) bar.style.transform = "translateX(-" + (100 - st.progress) + "%)";
    const circle = pg.querySelector("[data-file-upload-progress-circle]");
    if (circle) {
      const c = parseFloat(circle.getAttribute("stroke-dasharray"));
      circle.setAttribute("stroke-dashoffset", String(c - (st.progress / 100) * c));
    }
    if (pg.getAttribute("data-variant") === "fill") pg.style.clipPath = "inset(" + (100 - st.progress) + "% 0% 0% 0%)";
    pg.hidden = !pg.hasAttribute("data-force-mount") && st.progress === 100;
  });
};

const renderItem = (st) => {
  const list = document.getElementById(id + "-list");
  const tpl = list && list.querySelector("template[data-file-upload-item-template]");
  if (!tpl || !tpl.content.firstElementChild) return;
  const item = tpl.content.firstElementChild.cloneNode(true);
  const base = id + "-item-" + ++counter;
  item.id = base;
  item.setAttribute("aria-labelledby", base + "-name");
  item.querySelectorAll("[data-file-upload-field]").forEach((field) => {
    field.id = base + "-" + field.getAttribute("data-file-upload-field");
  });
  item.querySelectorAll('[data-slot="file-upload-preview"]').forEach((preview) => {
    preview.setAttribute("aria-labelledby", base + "-name");
    preview.prepend(previewNode(st.file));
  });
  item.querySelectorAll('[data-slot="file-upload-progress"]').forEach((pg) => pg.setAttribute("aria-labelledby", base + "-name"));
  item.querySelectorAll('[data-file-upload-action="delete"]').forEach((btn) => {
    btn.setAttribute("aria-controls", base);
    btn.setAttribute("aria-describedby", base + "-name");
  });
  st.el = item;
  list.appendChild(item);
  paint(st);
};

const reindex = () => {
  let i = 0;
  files.forEach((st) => {
    i += 1;
    if (st.el) {
      st.el.setAttribute("aria-setsize", files.size);
      st.el.setAttribute("aria-posinset", i);
    }
  });
  sig.count(files.size);
};

const syncInput = () => {
  if (!input || cfg.uploadUrl) return;
  try {
    const dt = new DataTransfer();
    files.forEach((st) => dt.items.add(st.file));
    input.files = dt.files;
  } catch (e) {}
};

const flagInvalid = () => {
  sig.invalid(true);
  clearTimeout(invalidTimer);
  invalidTimer = setTimeout(() => sig.invalid(false), 2000);
};

const reject = (file, message) => fire("reject", { file: file, message: message });

const typeOk = (file) => {
  if (!cfg.accept) return true;
  const ft = (file.type || "").toLowerCase();
  const ext = "." + file.name.split(".").pop().toLowerCase();
  return cfg.accept.split(",").map((t) => t.trim().toLowerCase()).some((t) => t === ft || t === ext || (t.includes("/*") && ft.startsWith(t.replace("/*", "/"))));
};

const markUploading = (file) => {
  const st = files.get(file);
  if (!st) return;
  st.progress = 0;
  st.status = "uploading";
  paint(st);
};

const setProgress = (file, progress) => {
  pending.set(file, Math.min(Math.max(0, progress), 100));
  if (frame) return;
  frame = requestAnimationFrame(() => {
    frame = 0;
    pending.forEach((value, f) => {
      const st = files.get(f);
      if (st) {
        st.progress = value;
        st.status = "uploading";
        paint(st);
      }
    });
    pending.clear();
  });
};

const setSuccess = (file) => {
  const st = files.get(file);
  if (!st) return;
  pending.delete(file);
  st.progress = 100;
  st.status = "success";
  paint(st);
};

const setError = (file, message) => {
  const st = files.get(file);
  if (!st) return;
  pending.delete(file);
  st.error = message;
  st.status = "error";
  paint(st);
};

const startUpload = (file) => {
  markUploading(file);
  const xhr = new XMLHttpRequest();
  const st = files.get(file);
  if (st) st.xhr = xhr;
  xhr.open("POST", cfg.uploadUrl);
  xhr.upload.onprogress = (e) => {
    if (e.lengthComputable) setProgress(file, Math.round((e.loaded / e.total) * 100));
  };
  xhr.onload = () => (xhr.status >= 200 && xhr.status < 300 ? setSuccess(file) : setError(file, "Upload failed (" + xhr.status + ")"));
  xhr.onerror = () => setError(file, "Upload failed");
  const body = new FormData();
  body.append(cfg.fieldName, file, file.name);
  xhr.send(body);
};

const addFiles = (list) => {
  if (cfg.disabled) return;
  let queue = Array.from(list);
  let flagged = false;
  if (cfg.maxFiles) {
    const remaining = Math.max(0, cfg.maxFiles - files.size);
    if (remaining < queue.length) {
      const overflow = queue.slice(remaining);
      queue = queue.slice(0, remaining);
      flagged = true;
      overflow.forEach((file) => reject(file, validate(file) || "Maximum " + cfg.maxFiles + " files allowed"));
    }
  }
  const accepted = [];
  queue.forEach((file) => {
    const message = validate(file) || (!typeOk(file) ? "File type not accepted" : "") || (cfg.maxSize && file.size > cfg.maxSize ? "File too large" : "");
    if (message) {
      flagged = true;
      reject(file, message);
    } else {
      accepted.push(file);
    }
  });
  if (flagged) flagInvalid();
  if (accepted.length === 0) return;
  accepted.forEach((file) => {
    const st = { file: file, progress: 0, status: "idle", error: undefined, el: null, xhr: null };
    files.set(file, st);
    renderItem(st);
  });
  reindex();
  syncInput();
  fire("change", { files: getFiles() });
  fire("accept", { files: accepted });
  if (cfg.uploadUrl) accepted.forEach(startUpload);
};

const removeEntry = (st) => {
  if (st.xhr) st.xhr.abort();
  release(st.file);
  pending.delete(st.file);
  if (st.el) st.el.remove();
};

const removeFile = (file) => {
  const st = files.get(file);
  if (!st) return;
  removeEntry(st);
  files.delete(file);
  reindex();
  syncInput();
  fire("change", { files: getFiles() });
};

const clear = () => {
  files.forEach(removeEntry);
  files.clear();
  clearTimeout(invalidTimer);
  sig.invalid(false);
  reindex();
  syncInput();
  fire("change", { files: [] });
};

const openDialog = () => {
  if (input && !cfg.disabled) input.click();
};

const markFromEvent = (evt) => {
  evt.preventDefault();
  sig.dragging(true);
};

if (input) {
  input.addEventListener("change", () => {
    addFiles(Array.from(input.files || []));
    syncInput();
    if (cfg.uploadUrl) input.value = "";
  });
  input.addEventListener("cancel", syncInput);
}

const api = {
  addFiles, removeFile, clear, getFiles, setProgress, setSuccess, setError, openDialog,
  onDropzoneClick(evt) {
    if (evt.defaultPrevented) return;
    const target = evt.target;
    if (!(target instanceof HTMLElement && target.closest("[data-file-upload-action]"))) openDialog();
  },
  onDragEnter: markFromEvent,
  onDragOver: markFromEvent,
  onDragLeave(evt) {
    const related = evt.relatedTarget;
    if (related && related instanceof Node && evt.currentTarget.contains(related)) return;
    evt.preventDefault();
    sig.dragging(false);
  },
  onDrop(evt) {
    evt.preventDefault();
    sig.dragging(false);
    addFiles(Array.from(evt.dataTransfer.files));
  },
  onPaste(evt) {
    evt.preventDefault();
    sig.dragging(false);
    const items = evt.clipboardData && evt.clipboardData.items;
    if (!items) return;
    const pasted = [];
    for (let i = 0; i < items.length; i++) {
      if (items[i].kind === "file") {
        const file = items[i].getAsFile();
        if (file) pasted.push(file);
      }
    }
    if (pasted.length > 0) addFiles(pasted);
  },
  onKeyDown(evt) {
    if (!evt.defaultPrevented && (evt.key === "Enter" || evt.key === " ")) {
      evt.preventDefault();
      openDialog();
    }
  },
  onTriggerClick(evt) {
    if (!evt.defaultPrevented) openDialog();
  },
  onListClick(evt) {
    if (evt.defaultPrevented || !evt.target.closest) return;
    const btn = evt.target.closest('[data-file-upload-action="delete"]');
    if (!btn) return;
    files.forEach((st) => {
      if (st.el && st.el.contains(btn)) removeFile(st.file);
    });
  },
  onClearClick(evt) {
    if (!evt.defaultPrevented) clear();
  },
};
el._fu = api;
return api;
`;

/** Base64 des Controller-Quelltexts (nur ASCII, deshalb ist btoa sicher) */
const controllerBase64 = (): string => btoa(CONTROLLER_SOURCE);

/** Alle Zeichen des Controller-Quelltexts müssen ASCII sein, sonst scheitert btoa */
export const controllerSource = (): string => CONTROLLER_SOURCE;

/**
 * data-init des Roots: erzeugt den Controller einmalig (`el._fu`).
 * Die Signale werden über Setter-Funktionen übergeben, damit Datastar die `$...`-Referenzen auflöst.
 */
export function buildFileUploadInit(args: FileUploadArgs): string {
  const s = fileUploadSignals(args.id);

  const config = {
    id: args.id,
    accept: args.accept || undefined,
    maxFiles: args.maxFiles || undefined,
    maxSize: args.maxSize || undefined,
    disabled: Boolean(args.disabled),
    uploadUrl: args.uploadUrl || undefined,
    fieldName: args.name || DEFAULT_FILE_UPLOAD_FIELD_NAME,
    icons: renderFileTypeIcons(),
  };

  const validate = args.validateExpression ? `{ validate: (file) => (${args.validateExpression}) }` : "{}";
  const cfg = `Object.assign(${JSON.stringify(config)}, ${validate})`;
  const setters = `{ dragging: (v) => ${s.set("dragging", "v")}, invalid: (v) => ${s.set("invalid", "v")}, count: (v) => ${s.set("count", "v")} }`;

  return `el._fu || (new Function("el", "cfg", "sig", atob(${JSON.stringify(controllerBase64())})))(el, ${cfg}, ${setters})`;
}
