const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');

const files = getFiles();

let whileTrue = 1;

console.log('Please, write your command!');

readLine(processCommand);

function getFiles() {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
    return filePaths.map(path => readFile(path));
}

function processCommand(command) {
    let input = String(command).split(" ");
    let allTodo = getAllTodo();
    switch (input[0]) {
        case 'sort':
            break
        case 'user':
            let usersTodos = allTodo.filter(x => x.split(';')[0].substr(8).toLowerCase() === input[1].toLowerCase())
            for(let userTodo of usersTodos){
                console.log(userTodo);
            }
            break;
        case 'date':
            let rule = new Date(input[1]);
            let type = 'all';
            if (input[1].split('-').length === 2) {
                type = 'year-month';
            } else {
                type = 'year';
            }
            let dataTodos = allTodo.filter(x => dateComparator(x, rule, type));
            console.log(dataTodos)
            break;
        case 'important':
            let rightTodos = allTodo.filter(x => x.search('!') !== -1)
            for (let t of rightTodos)
                console.log(t)
            break;
        case 'show':
            for (let todo of allTodo)
                console.log(todo)
            break;
        case 'exit':
            process.exit(0);
            break;
        default:
            console.log('wrong command');
            break;
    }
}

// TODO you can do it!
// TODO Jopa; 2015-08-10; you can do it!

function getAllTodo(){
    let keyword = 'TODO';
    const regex = new RegExp(
        // exclude TODO in string value with matching quotes:
        '^(?!.*([\'"]).*\\b' + keyword + '\\b.*\\1)' +
        // exclude TODO.property access:
        '(?!.*\\b' + keyword + '\\.\\w)' +
        // exclude TODO = assignment
        '(?!.*\\b' + keyword + '\\s*=)' +
        // final TODO match
        '.*\\b' + keyword + '\\b'
    );

    let files = getFiles();
    let todos = [];
    for(let file of files) {
        file.split('\n').forEach((file) => {
            let m = regex.test(file);
            if (m) {
                let rightString = file.substr(file.indexOf('// TODO'));
                if (rightString.length > 6)
                    todos.push(rightString);
            }
        });
    }
    return todos;
}

function dateComparator(input, rule, type){
    console.log(input)
    let tmp = '';
    try {
        tmp = String(input.split(';')[1].substr(1))
    } catch {
        return false
    }
    let dateString = new Date(tmp);
    switch (type){
        case 'year':
            return dateString.getFullYear() === rule.getFullYear();
        case 'all':
            return dateString.getDate() === rule.getDate()
        case 'year-month':
            return dateString.getFullYear() === rule.getFullYear() && dateString.getMonth() === rule.getMonth();
    }
}