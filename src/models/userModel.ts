class User {
    constructor(
        public id: number,
        public username: string,
        public password: string,
        public fullname: string,
        public email: string,
        public tel: string,
    ) { }
}

export default User