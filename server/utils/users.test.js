const expect = require('expect');
const { Users } = require('./users');

describe('Users', () => {
    var users = new Users();
    beforeEach(() => {

        users.users = [
        {
            id: 1,
            name: 'ace',
            room: 'Node Course'
        },
        {
            id: 2,
            name: 'Jen',
            room: 'React Course'
        },
        {
            id: 3,
            name: 'Mike',
            room: 'Node Course'
        }
    ]
    });
    it('should add new users', () => {
        users = new Users();
        var user = {
            id: 123,
            name: 'ace',
            room: 'The office fans'
        };
        var resUser = users.addUser(user.id, user.name, user.room);

        expect(users.users).toEqual([user]);
    });

    it('should return users of node course', () => {
        var userList = users.getUserList('Node Course');
        expect(userList).toEqual(['ace', 'Mike']);
    });

    it('should return users of React course', () => {
        var userList = users.getUserList('React Course');
        expect(userList).toEqual(['Jen']);
    });
    it('should remove user', () => {
        var id = 1;
        var user = users.removeUser(id);
        expect(user.id).toEqual(id);
        expect(users.users.length).toEqual(2);
    });
    it('should not remove user', () => {
        var id = 4;
        var user = users.removeUser(id);
        expect(user).toNotExist();
        expect(users.users.length).toEqual(3);
    });

    it('should find user', () => {
        var userId = 2;
        var user = users.getUser(userId);

        expect(userId).toEqual(user.id);
    });

    it('should not find user', () => {
        var userId = 4;
        var user = users.getUser(userId);
        expect(user).toNotExist();
    })
});