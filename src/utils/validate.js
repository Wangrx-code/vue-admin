export function stripscript(str, type) {
   var pattern = new RegExp("[`~!@#$%^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）&;—|{ }【】‘；：”“'。，、？]");
   var rs = "";
   if (type === 'userName') {
      pattern = new RegExp("[`~!#$%^&*()=|{}':;',\\[\\]<>/?~！#￥……&*（）&;—|{ }【】‘；：”“'。，、？]");
   }
   for (var i = 0; i < str.length; i++) {
      rs = rs + str.substr(i, 1).replace(pattern, '');
   }
   return rs;
}

export function validate(value, type) {
   var reg;
   if (type === "userName") {
      reg = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/;
   }
   if (type === "password") {
      reg = /^(?!\D+$)(?![^a-zA-Z]+$)\S{6,20}$/;
   }
   if (type === "code") {
      reg = /^[a-z0-9]{6}$/;
   }
   return reg.test(value) ? true : false;
}