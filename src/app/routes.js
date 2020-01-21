module.exports = function(app) {
    const todo = require('./controller');
    app.route('/').get(todo.index);
    app.route('/userlist').get(todo.daftarUser);
    app.route('/extdrivelist').get(todo.daftarExtFile);

    // buat all file admin directory
    // app.route('/drivelist').get(todo.FileList);

    app.route('/drivelist').get(todo.FileList);

    app.route('/drivepermission/:docid').get(todo.daftarPermissionId);
    
    app.route('/permissionlist').get(todo.PermissionList);
};