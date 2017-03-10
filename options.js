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

function getBookmarkNodeType(BookmarkTreeNode) {
  if (BookmarkTreeNode.hasOwnProperty('url')) {
    type = "Bookmark";
  } else {
    type = "Folder";
  }
  return type;
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
      var children = BookmarkTreeNode.children;

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

function exportBookmarkCallback(BookmarkTreeNodeArray, depth, entries, folderLabel) {

  if (typeof depth === 'undefined') {
    depth = 0;
    entries = [];
    folderLabel = pathLookup[selectedId];
  }

  for (var x = 0; x < BookmarkTreeNodeArray.length; x++) {
    var BookmarkTreeNode = BookmarkTreeNodeArray[x];
    var type = getBookmarkNodeType(BookmarkTreeNode);

    if (type === "Folder") {
      var children = BookmarkTreeNode.children;
      //Extension.log("Folder: " + BookmarkTreeNode.title + ", " + children.length + " items");

      if (depth === 0) {
        folderPath = folderLabel;
      } else {
        folderPath = folderLabel + "/" + BookmarkTreeNode.title;
      }

      exportBookmarkCallback(children, depth + 1, entries, folderPath);
    } else {
      //Extension.log("Bookmark: " + BookmarkTreeNode.title + ", " + BookmarkTreeNode.url);
      json = {
        "name": BookmarkTreeNode.title,
        "url": BookmarkTreeNode.url,
        "path": folderLabel
      };
      entries.push(json);
    }
  }

  if (depth === 0) {
    var outputElem = document.getElementById('output');
    outputElem.style.height = "10px";

    outputElem.innerText = JSON.stringify(entries, null, '\t');
    outputElem.style.height = (outputElem.scrollHeight) + "px";
  }
};

function exportBookmarks(e) {
  e.preventDefault();
  var selectControl = document.getElementById("folder-select");
  var controlSelectedId = selectControl.options[selectControl.selectedIndex].value;
  selectedId = controlSelectedId;

  chrome.bookmarks.getSubTree(selectedId, exportBookmarkCallback);
}

window.onload = function () {
  document.getElementById("export-form").onsubmit = exportBookmarks;
}
