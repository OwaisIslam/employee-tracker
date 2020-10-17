function mainMenu(connection) {
    connection.query('SELECT * FROM department', (error, result) => {
        if (error) throw error;
        console.table(result);
    })
}

function anotherFunction() {

}

module.exports = {
    mainMenu,
    anotherFunction
}