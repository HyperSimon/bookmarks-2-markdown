pathLookup = {};
selectedId = -1;

Extension = function () {
};

Extension.settings = {
  'logging': true
};

Extension.log = function (msg) {
  if (this.settings.logging) {
    console.log(arguments);
  }
};

function getBookmarkNodeType(bookmarkTreeNode) {
  if (bookmarkTreeNode === undefined) return ''
  return bookmarkTreeNode.hasOwnProperty('url') ? "Bookmark" : "Folder"
}

function populateBookmarkOptions(BookmarkTreeNodeArray, depth, folders, folderLabel) {

  if (typeof depth === 'undefined') {
    depth = 0;
    folders = {};
    folderLabel = "";
  }

  for (var x = 0; x < BookmarkTreeNodeArray.length; x++) {
    var BookmarkTreeNode = BookmarkTreeNodeArray[x];

    var type = getBookmarkNodeType(BookmarkTreeNode);

    if (type === "Folder") {
      const children = BookmarkTreeNode.children;

      if (depth === 0) {
        folderPath = BookmarkTreeNode.title;
      } else {
        folderPath = folderLabel + "/" + BookmarkTreeNode.title;
      }

      folders[folderPath] = BookmarkTreeNode.id;
      pathLookup[BookmarkTreeNode.id + ""] = folderPath;
      populateBookmarkOptions(children, depth + 1, folders, folderPath);
    }
  }

  if (depth === 0) {
    var options = "";
    for (tFolder in folders) {
      var folderId = folders[tFolder];
      if (tFolder === "") {
        tFolder = "(root)";
      }
      options += "<option value='" + folderId + "'>" + tFolder + "</option>";
    }
    document.getElementById("folder-select").innerHTML = options;
  }
};

chrome.bookmarks.getTree(populateBookmarkOptions);

function exportBookmarks(e) {
  e.preventDefault();
  var selectControl = document.getElementById("folder-select");
  var controlSelectedId = selectControl.options[selectControl.selectedIndex].value;
  const selectedId = controlSelectedId;

  chrome.bookmarks.getSubTree(selectedId, exportBookmarkCallback);
}

function inRange(number) {
  if (number === 0) return '#'
  let s = ''
  for (let i = 0; i < number; i++) {
    s += '#'
  }
  return s
}

function exportBookmarkCallback(BookmarkTreeNodeArray, depth, entries, folderLabel) {

  if (typeof depth === 'undefined') {
    depth = 0;
    entries = [];
    folderLabel = pathLookup[selectedId] ? pathLookup[selectedId] : null;
    console.info(BookmarkTreeNodeArray)
  }

  BookmarkTreeNodeArray.forEach(bookTreeNode => {
    var type = getBookmarkNodeType(bookTreeNode);
    if (type === "Folder") {
      var children = bookTreeNode.children;
      //Extension.log("Folder: " + bookTreeNode.title + ", " + children.length + " items");

      if (folderLabel || bookTreeNode.title) {
        const title = depth === 0 && folderLabel ? `# ${folderLabel}` : `${inRange(depth)} ${bookTreeNode.title}`
        entries.push(title)
      }

      if (depth === 0) {
        folderPath = folderLabel;
      } else {
        folderPath = folderLabel + "/" + bookTreeNode.title;
      }

      exportBookmarkCallback(children, depth + 1, entries, folderPath);
    } else if (type === 'Bookmark') {
      const md = `[${bookTreeNode.title}](${bookTreeNode.url})`
      entries.push(md);
    }
  })

  if (depth === 0) {
    var outputElem = document.getElementById('output');
    outputElem.style.height = "10px";
    let string = ''
    entries.forEach(e => {
      string += e + '\r\n'
    })

    outputElem.innerText = string;
    outputElem.style.height = (outputElem.scrollHeight) + "px";
  }
};

window.onload = function () {
  document.getElementById("export-form").onsubmit = exportBookmarks;
}