export function createJSONChildren(response, root) {
    var lst = [];
    var checkList = {};
    var name;
    $.each(response, function (k, v) {
        if (root == null) {
            name = k.toString();
            lst.push({
                name: name,
                children: createJSONChildren(v, name)
            });
        } else {
            var nodeMap = {},
                str = k.toString(),
                pairs,
                typeFound = false,
                numberOfNode = 0;

            //парсинг
            str = str.slice(str.indexOf(':') + 1, str.length);
            pairs = str.split(',');
            for (var i = 0; i < pairs.length; i++) {
                var parts = pairs[i].split('=');
                if (parts[0] === "type") {//в имени объекта есть ключ type
                    name = parts[1];
                    typeFound = true;
                } else {
                    nodeMap[parts[0]] = parts[1];
                }
            }

            if (!typeFound) {
                name = nodeMap[Object.keys(nodeMap)[0]];
                numberOfNode++;
            }

            if ((typeFound && Object.keys(nodeMap).length == 0) || (!typeFound && Object.keys(nodeMap).length == 1)) {//случай, когда имя объекта состоит только из одного ключа
                lst.push({
                    name: name,
                    root: root,
                    fullName: k.toString(),
                    json: v,
                    desc: v.desc
                });
            } else {//иначе (несколько ключей)
                if (name in checkList) {
                    var tmp = lst[checkList[name]].children;
                    lst[checkList[name]].children = tmp.concat(createChildren(nodeMap, root, v, numberOfNode, k.toString()));
                } else {
                    checkList[name] = lst.length;
                    lst.push({
                        name: name,
                        root: root,
                        children: createChildren(nodeMap, root, v, numberOfNode, k.toString())
                    });
                }
            }

            //вернуть все как было:
            /*lst.push({
             name: k.toString(),
             parent: parent,
             json: v
             });*/
        }
    });

    return lst;
}

function createChildren(nodeMap, root, json, numberOfNode, fullName) {
    var lst = [];
    var checkList = {};
    var key = Object.keys(nodeMap)[numberOfNode];
    var name = nodeMap[key];

    if (numberOfNode + 1 == Object.keys(nodeMap).length) {//это последний сын, пора добавлять json
        lst.push({
            name: name,
            root: root,
            fullName: fullName,
            json: json,
            desc: json.desc
        });
    } else {//все еще добавляем детей на основе ключей в имени объекта
        if (name in checkList) {
            var tpm = lst[checkList[name]].children;
            lst[checkList[name]].children = tmp.concat(createChildren(nodeMap, root, json, numberOfNode + 1, fullName));
        } else {
            checkList[name] = lst.length;
            lst.push({
                name: name,
                root: root,
                children: createChildren(nodeMap, root, json, numberOfNode + 1, fullName)
            })
        }
    }

    return lst;
}

function compareByNames(a, b) {
    if (a.name < b.name) {
        return -1;
    }
    if (a.name > b.name) {
        return 1;
    }

    return 0;
}

export function treeSort(lst) {
    lst.sort(compareByNames);
    for (var i = 0; i < lst.length; i++) {
        if ("children" in lst[i]) {
            lst[i].children = treeSort(lst[i].children);
        }
    }
    return lst;
}