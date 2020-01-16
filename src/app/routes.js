module.exports = function(app) {
    const todo = require('./controller');
    app.route('/').get(todo.index);
    app.route('/userlist').get(todo.daftarUser);
    app.route('/drivelist').get(todo.FileList);
    app.route('/permissionlist').get(todo.PermissionList);
};