class notifycation{
    _event = {}
    constructor(name){
        if(new.target !== notifycation){
            return
        }
        if(!notifycation._instance){
            this.name = name
            notifycation._instance = this
        }
        return notifycation._instance
    }

    addEvent(key, cb) {
        this._event[key] = cb;
    }
    notify(key, param) {
        this._event[key](param);
    }
}
module.exports = notifycation

