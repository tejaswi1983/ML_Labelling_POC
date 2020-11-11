let sam= {
    data:"hello",
    fet: function(){
        let objref = this;
        console.log(this.data)
        console.log(objref.data);
        (function(){
            console.log(this.data)
            console.log(objref.data)
        }());
    }
};
sam.fet();