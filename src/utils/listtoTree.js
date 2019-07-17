/* eslint-disable */
function listToTree(myId, pId, list) {
  function exists(list, parentId) {
    for (var i = 0; i < list.length; i++) {
      if (list[i][myId] == parentId) return true;
    }
    return false;
  }

  var nodes = [];
  // get the top level nodes
  for (var i = 0; i < list.length; i++) {
    var row = list[i];
    if (!exists(list, row[pId])) {
      nodes.push(row);
    }
  }

  var toDo = [];
  for (var i = 0; i < nodes.length; i++) {
    toDo.push(nodes[i]);
  }
  while (toDo.length) {
    var node = toDo.shift(); // the parent node
    // get the children nodes
    for (var i = 0; i < list.length; i++) {
      var row = list[i];
      if (row[pId] == node[myId]) {
        if (node.children) {
          node.children.push(row)
        } else {
          node.children = [row]
        }
        toDo.push(row)
      }
    }
  }
  return nodes
}
export { //很关键
  listToTree
}
